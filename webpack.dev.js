const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

let plugins = [];

console.log('✅ 当前是 开发 模式');

plugins.push(
  new HtmlWebpackPlugin({
    title: 'maby-lib-cli 环境测试',
    template: __dirname + '/public/index.html'
  }));
plugins.push(
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common'
  }));

let config = {
  entry: {
    'maby-lib-cli': __dirname + '/src/index.js',
    main: __dirname + '/example/index.js',
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'maby-lib-cli',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      './'
    ],
  },
  devServer: {
    contentBase: './dist'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', "stage-0"]
        }
      }, {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }, {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
    ]
  },
  plugins: plugins
};
module.exports = config;
