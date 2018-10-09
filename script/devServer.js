const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const chalk = require('chalk');
const path = require('path');
const openBrowser = require('react-dev-utils/openBrowser');
const packageInfo = require('./getPackage');

const runDevServer = () => {
  const { mabycli } = packageInfo;
  const serverOptions = mabycli.devServerOptions || false;
  const cliPort = JSON.stringify(mabycli.port) || false;
  const cliHost = JSON.stringify(mabycli.host) || false;
  const serverPort = serverOptions.port || false;
  const serverHost = serverOptions.host || false;
  const PORT = process.env.PORT || cliPort || serverPort || 10123;
  const HOST = process.env.HOST || cliHost || serverHost || 'localhost';
  const OPEN = process.env.OPEN || JSON.stringify(mabycli.openBrowser) === 'true' || false;
  const url = `http://${HOST}:${PORT}`;
  const createWebpackConfig = require(path.join(__dirname, '..', 'webpack.config.js'));
  const webpackConfig = createWebpackConfig(process.env);
  webpackConfig.entry.index.unshift(`webpack-dev-server/client?${url}`);
  let devServerOptions = {
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
  if (serverOptions) {
    try {
      devServerOptions = serverOptions;
    } catch (err) {
      console.error(chalk.red.bold('mabycli.devServerOptions is error, Uncaught SyntaxError: Unexpected json'));
    }
  }
  const compiler = webpack(webpackConfig);
  const devServer = new WebpackDevServer(compiler, devServerOptions);
  devServer.listen(PORT, HOST, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(chalk.cyan(`\nOpen ${url} in a browser to view the app.\n`));
    if (OPEN) {
      openBrowser(url);
    }
  });
};
runDevServer();
