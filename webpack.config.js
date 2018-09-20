const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv !== 'production';
const ASSET_PATH = '/';
const ANALYZER = process.env.ANALYZER || false;

// 环境
const PORT_ENV = process.env.PORT || 10123;
const PREVIEW = process.env.PREVIEW || false;

const isAutoDll = false; // 是否开启 autodll
const eslint = true;
const stylelint = false;

// 获取主题颜色
const pkgPath = path.resolve(__dirname, './package.json');
const pkg = fs.existsSync(pkgPath) ? require(pkgPath) : {};
const libraryName = pkg.name || 'maybe-lib';
const version = pkg.version.toLocaleLowerCase() || '';
let mabel = {};

if (pkg.mabel && typeof pkg.mabel === 'string') {
  let cfgPath = pkg.mabel;
  // relative path
  if (cfgPath.charAt(0) === '.') {
    cfgPath = path.resolve(__dirname, cfgPath);
  }
  const getMabel = require(cfgPath);
  mabel = getMabel();
} else if (pkg.mabel && typeof pkg.mabel === 'object') {
  mabel = pkg.mabel;
}


const vendor = [
  'react',
  'react-dom'
];

console.log(isDev ? '开发模式' : '发布模式');

// 设置插件环境 development/prodcution
const getPlugins = () => {
  // Common
  const plugins = [
    new ExtractTextPlugin({
      filename: `${libraryName}.${version}.css`,
      disable: isDev
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: JSON.stringify(nodeEnv) }),
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
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
        name: 'vendor',
        minChunks: Infinity
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest'
      }),
      new webpack.HotModuleReplacementPlugin(),
      new StyleLintPlugin({ failOnError: stylelint }),
      new webpack.NamedModulesPlugin()
    );
  } else {
    plugins.push(
      new CleanWebpackPlugin(['dist']),
      new UglifyJsPlugin({
        uglifyOptions: {
          beautify: true, // 最紧凑的输出
          comments: true, // 删除所有的注释
          compress: {
            warnings: false,
            drop_console: !PREVIEW, // 删除所有的 `console` 语句
            collapse_vars: true,
            reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
          }
        }
      }),
    );
  }
  if (isAutoDll) {
    plugins.push(
      new AutoDllPlugin({
        context: path.resolve(process.cwd()),
        inject: true,
        filename: '[name].dll.js',
        entry: {
          vendor
        }
      })
    )
  }
  if (ANALYZER) {
    plugins.push(
      new BundleAnalyzerPlugin(),
    );
  }
  return plugins;
};

// 获取入口
const getEntry = () => {
  if (isDev) {
    return {
      index: __dirname + '/example/index.js',
      [libraryName]: __dirname + '/src/index.js',
      vendor
    };
  }
  return {
    [libraryName]: __dirname + '/src/index.js',
  }
};

// 获取loaders
const webpackLoaders = () => {
  const loaders = [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        cacheDirectory: isDev
      }
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract(
        {
          fallback: 'style-loader',
          use:['css-loader', 'postcss-loader']
        },
      )
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract(
        {
          fallback: 'style-loader',
          use:[
            'css-loader',
            'postcss-loader',
            'less-loader'
          ]
        }
      )
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10240
          }
        }
      ]
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        'file-loader'
      ]
    }
  ];
  
  if (eslint) {
    loaders.unshift({
      test: /\.(js|jsx)?$/,
      enforce: 'pre',
      exclude: /node_modules/,
      loader: 'eslint-loader'
    });
  }
  return loaders;
};
module.exports = {
  name: 'client',
  target: 'web',
  cache: isDev,
  profile: isDev, // 是否捕捉 Webpack 构建的性能信息
  context: path.resolve(process.cwd()),
  entry: getEntry(),
  devtool: isDev ? 'inline-source-map' : 'hidden-source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: ASSET_PATH,
    filename: isDev ? '[name].js' : libraryName + '.' + version + '.min.js',
    pathinfo: isDev,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    overlay: true,
    hot: true,
    port: PORT_ENV,
    stats: {
      modules: false,
      colors: true
    }
  },
  plugins: getPlugins(),
  module: {
    loaders: webpackLoaders()
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src/'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json']
  }
};
