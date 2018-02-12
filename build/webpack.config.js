const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const chalk = require('chalk')
const eslintFormatter = require('react-dev-utils/eslintFormatter')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

module.exports = {
  entry: {
    app: ['./src/client/main.jsx']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
  },
  plugins: [
    // 提取公共代码
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: function (module, count) {
    //     return (
    //       module.resource &&
    //       /\.js$/.test(module.resource) &&
    //       module.resource.indexOf(
    //         path.join(__dirname, '../node_modules')
    //       ) === 0
    //     )
    //   }
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'COMPONENTS': path.resolve(__dirname, '../common/components')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: resolveApp('src'),
        loader: require.resolve('babel-loader'),
        options: {
          plugins: [
            "transform-decorators-legacy",
            ['import', [{ libraryName: 'antd', style: true }]],  // import less
          ],
          cacheDirectory: true,
        },
      },
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),

            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: resolveApp('src'),
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: ['file-loader?limit=1000&name=files/[md5:hash:base64:10].[ext]']
      }
    ]
  }
}