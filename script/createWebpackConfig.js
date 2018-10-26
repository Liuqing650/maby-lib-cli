const path = require('path');
const packageInfo = require('./getPackage');
const getEntry = require('./getEntry');
const getOutFilename = require('./getOutFilename');
const getPlugins = require('./webpackPlugins');
const getLoaders = require('./webpackLoaders');
const getResolve = require('./webpackResolve.js');
const handleIsExists = require('./handleFileLoader');
const handleLibaryName = require('./handleLibaryName');

module.exports = function(env) {
  const { libraryName, version, mabycli } = packageInfo;
  const { hyphenToHump } = handleLibaryName;

  const nodeEnv = env.NODE_ENV || 'development';
  const isMINI = env.MINI === 'true';
  const isDev = nodeEnv !== 'production';
  const PREVIEW = env.PREVIEW === 'true';
  const ANALYZER = env.ANALYZER || false;
  const ASSET_PATH = env.ASSET_PATH || '/';

  const library = hyphenToHump(libraryName);
  // 获取入口文件
  const entryName = getEntry({
    isDev,
    libraryName,
    vendors: mabycli.vendors || '',
    options: {
      preview: PREVIEW
    }
  });

  // 获取输出文件
  const outFileName = getOutFilename({
    fileType: 'js',
    isDev,
    isMINI,
    version,
    libraryName,
    options: {
      preview: PREVIEW
    }
  });

  // 获取插件
  const cssFileName = getOutFilename({
    fileType: 'css',
    isDev,
    isMINI,
    version,
    libraryName
  });

  const isExistClean = !isDev && !isMINI && handleIsExists(path.resolve(process.cwd(), 'dist'), [outFileName, cssFileName]);

  const ExtractTextPluginConfig = {
    filename: cssFileName,
    disable: isDev
  };
  const webpackPlugins = getPlugins({
    libraryName,
    stylelint: mabycli.stylelint || false,
    ExtractTextPluginConfig,
    isExistClean,
    isAutoDll: mabycli.isAutoDll || false,
    options: {
      nodeEnv,
      isDev,
      isMINI,
      assetPath: ASSET_PATH,
      analyzer: ANALYZER,
      preview: PREVIEW,
      plugins: mabycli.plugins || null,
    }
  });

  // 获取loaders
  const webpackLoaders = getLoaders({
    isDev,
    eslint: mabycli.eslint || false,
    options: {
      loaders: mabycli.loaders || null
    },
  });
  const resolve = getResolve({
    resolve: mabycli.resolve || null
  });
  return {
    webpackPlugins,
    webpackLoaders,
    outFileName,
    entryName,
    libraryName,
    library,
    resolve,
  };
};
