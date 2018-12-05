const path = require('path');
const webpack = require('webpack');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// 设置插件环境 development/prodcution
const webpackPlugins = ({
  libraryName,
  stylelint,
  ExtractTextPluginConfig,
  isExistClean,
  isAutoDll,
  options,
}) => {
  const {nodeEnv, isDev, isMINI, assetPath, analyzer, preview} = options;
  const userPlugins = options.plugins;
  let plugins = [
    new ExtractTextPlugin(ExtractTextPluginConfig),
    new webpack.EnvironmentPlugin({ NODE_ENV: JSON.stringify(nodeEnv) }),
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(assetPath),
      __DEV__: isDev,
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ];
  if (isDev) {
    plugins.push(
      new HtmlWebpackPlugin({
        title: libraryName,
        template: path.join(process.cwd(), '/example/index.ejs')
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors',
        minChunks: Infinity
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest'
      }),
      new webpack.HotModuleReplacementPlugin(),
      new StyleLintPlugin({ failOnError: stylelint }),
      new webpack.NamedModulesPlugin()
    );
  } else if (isMINI) {
    plugins.push(
      new UglifyJsPlugin({
        uglifyOptions: {
          beautify: true, // 最紧凑的输出
          comments: true, // 删除所有的注释
          compress: {
            warnings: false,
            drop_console: true, // 删除所有的 `console` 语句
            collapse_vars: true,
            reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
          }
        }
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true
      })
    );
  } else if (preview) {
    plugins.push(
      new HtmlWebpackPlugin({
        title: libraryName,
        template: path.join(process.cwd(), '/example/index.ejs')
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest'
      }),
      new webpack.NamedModulesPlugin()
    );
  }
  if (isAutoDll) {
    plugins.push(new AutoDllPlugin({
      context: path.resolve(process.cwd()),
      inject: true,
      filename: '[name].dll.js',
      entry: {
        vendor
      }
    }));
  }
  if (analyzer) {
    plugins.push(new BundleAnalyzerPlugin());
  }
  if (userPlugins) {
    if (typeof userPlugins === 'function') {
      return userPlugins(plugins);
    } else if (typeof userPlugins === 'object') {
      if (Array.isArray(userPlugins)) {
        plugins = plugins.concat(userPlugins);
      } else if (Object.keys(userPlugins).length > 0) {
        Object.keys(userPlugins).map((key) => {
          plugins.push(userPlugins[key]);
        });
      }
    }
  }
  return plugins;
};

module.exports = webpackPlugins;
