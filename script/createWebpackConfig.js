const path = require('path');
const packageInfo = require('./getPackage');
const getPlugins = require('./webpackPlugins');
const getLoaders = require('./webpackLoaders');
const getOutFilename = require('./getOutFilename');
const getEntry = require('./getEntry');
const handleIsExists = require('./handleFileLoader');
const handleLibaryName = require('./handleLibaryName');

module.exports = function(env) {
  const { libraryName, version, mabycli } = packageInfo;
  const { hyphenToHump } = handleLibaryName;

  const nodeEnv = env.NODE_ENV || 'development';
  const isMINI = env.MINI === 'true';
  const isDev = nodeEnv !== 'production';
  const ASSET_PATH = env.ASSET_PATH || '/';
  const ANALYZER = env.ANALYZER || false;

  const library = hyphenToHump(libraryName);
  // 获取入口文件
  const entryName = getEntry({
    isDev,
    libraryName,
    vendors: mabycli.vendors || '',
  });

  // 获取输出文件
  const outFileName = getOutFilename({
    fileType: 'js',
    isDev,
    isMINI,
    version,
    libraryName
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
    nodeEnv,
    isDev,
    isMINI,
    ASSET_PATH,
    ANALYZER
  });

  // 获取loaders
  const webpackLoaders = getLoaders({
    isDev,
    eslint: mabycli.eslint || false,
  });
  return {
    webpackPlugins,
    webpackLoaders,
    outFileName,
    entryName,
    libraryName,
    library
  };
};
