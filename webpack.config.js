const path = require('path');
const chalk = require('chalk');
const createWebpackConfig = require('./lib/createWebpackConfig');

module.exports = function(env = process.env) {
  const { webpackPlugins, webpackLoaders, outFileName, entryName, libraryName, library } = createWebpackConfig(env);
  const nodeEnv = env.NODE_ENV || 'development';
  const isDev = nodeEnv !== 'production';
  const ASSET_PATH = env.ASSET_PATH || '/';
  
  console.log(chalk.cyanBright(isDev ? `development: ${libraryName} is starting...` : `production: ${libraryName}${env.MINI === 'true' ? '.min' : ''} is building.`));
  // 环境
  const PORT_ENV = env.PORT || 10123;
  return {
    name: 'client',
    target: 'web',
    cache: isDev,
    profile: isDev, // 是否捕捉 Webpack 构建的性能信息
    context: path.resolve(process.cwd()),
    entry: entryName,
    devtool: isDev ? 'inline-source-map' : false,
    output: {
      path: path.join(process.cwd(), 'dist'),
      publicPath: ASSET_PATH,
      filename: outFileName,
      pathinfo: isDev,
      library: library,
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    devServer: {
      contentBase: path.join(process.cwd(), "dist"),
      overlay: true,
      headers: {
        'access-control-allow-origin': '*',
      },
      port: PORT_ENV,
      stats: {
        modules: false,
        colors: true
      }
    },
    plugins: webpackPlugins,
    module: {
      loaders: webpackLoaders
    },
    resolve: {
      modules: [path.resolve(process.cwd(), 'src/'), 'node_modules'],
      extensions: ['.js', '.jsx', '.json']
    }
  }
};
