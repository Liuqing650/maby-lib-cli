const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 获取loaders
const webpackLoaders = (isDev, eslint) => {
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
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'postcss-loader']
      })
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      })
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
module.exports = webpackLoaders;
