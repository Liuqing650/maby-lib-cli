const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const chalk = require('chalk');
const path = require('path');

const runDevServer = () => {
  const PORT = process.env.PORT || 10123;
  const HOST = process.env.HOST || 'localhost';
  const OPEN = process.env.OPEN || false;
  const url = `http://${HOST}:${PORT}`;
  const createWebpackConfig = require(path.join(__dirname, '..', 'webpack.config.js'));
  const webpackConfig = createWebpackConfig(process.env);
  webpackConfig.entry.index.unshift(`webpack-dev-server/client?${url}`);
  const devServerOptions = {
    contentBase: path.join(process.cwd(), 'dist'),
    overlay: true,
    headers: {
      'access-control-allow-origin': '*',
    },
    open: OPEN,
    port: PORT,
    stats: {
      modules: false,
      colors: true
    }
  };
  const compiler = webpack(webpackConfig);
  const devServer = new WebpackDevServer(compiler, devServerOptions);
  devServer.listen(PORT, HOST, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(chalk.cyan(`\nOpen ${url} in a browser to view the app.\n`));
  });
};
runDevServer();
