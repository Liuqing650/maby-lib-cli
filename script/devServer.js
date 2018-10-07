const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const chalk = require('chalk');
const path = require('path');

module.exports = () => {
  const PORT = process.env.PORT || 10123;
  const HOST = process.env.HOST || 'localhost';
  const createWebpackConfig = require(path.join(__dirname, '..', 'webpack.config.js'));
  const webpackConfig = createWebpackConfig(process.env);
  const devServerOptions = {
    contentBase: path.join(process.cwd(), 'dist'),
    overlay: true,
    hot: true,
    headers: {
      'access-control-allow-origin': '*',
    },
    port: PORT,
    stats: {
      modules: false,
      colors: true
    }
  };
  const compiler = webpack(webpackConfig);
  WebpackDevServer.addDevServerEntrypoints(compiler, devServerOptions);
  const devServer = new WebpackDevServer(compiler, devServerOptions);
  devServer.listen(PORT, HOST, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(chalk.cyan('\nStarting the development server...\n'));
  });
};
