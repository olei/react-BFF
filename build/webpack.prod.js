const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const webpackConfig = require('./webpack.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const Webpack_isomorphic_tools_plugin = require('webpack-isomorphic-tools/plugin')
const webpack_isomorphic_tools_plugin = new Webpack_isomorphic_tools_plugin(require('./webpack-isomorphic-tools-configuration')).development()

// 粉笔
const chalk = require('chalk')
// loading效果
const ora = require('ora')
// 命令操作
require('shelljs/global')

const assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production' ? './' : ''
  return path.posix.join(assetsSubDirectory, _path)
}

console.log(chalk.green.bold('当前运行：' + chalk.underline.green(process.env.NODE_ENV)))

const cwd = process.cwd()
const filePath = path.join(path.resolve(cwd, 'public'), '')
console.log(chalk.yellow.bold('\n正在删除 -> ' + chalk.rgb(9, 9, 9).bgYellow.bold(filePath) + ' 目录'))
rm('-rf', filePath)
mkdir('-p', filePath)
// cp('-R', './*', filePath)

console.log(
  '\n' +
  chalk.green.bold('delete finish\n')
)

console.log(__dirname)

const spinner = ora('正在构建项目...')
spinner.start()

const config = merge(webpackConfig, {
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[name].[chunkhash].js'
  },
  plugins: [
    webpack_isomorphic_tools_plugin,
    new webpack.DefinePlugin({
      // 定义全局变量
      'process.env':{
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),
    // css文件生成
    new ExtractTextPlugin(assetsPath('static/css/[name].[contenthash].css')),
    new webpack.optimize.ModuleConcatenationPlugin(),
    // 模板文件生成
    new HtmlWebpackPlugin({
      filename: 'tpl/index.html',
      template: `${__dirname}/../src/client/index.html`,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    // 根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id，使得ids可预测，降低文件大小
    new webpack.optimize.OccurrenceOrderPlugin(),
    // 文件压缩
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      comments: false,
      ie8: true
    })
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ["css-loader", "less-loader", "postcss-loader"]
            })
      },
      {
        test: webpack_isomorphic_tools_plugin.regular_expression('images'),
        loader: 'url-loader?limit=10240', // any image below or equal to 10K will be converted to inline base64 instead
      }
    ]
  }
})

webpack(config, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
  console.log(chalk.green.bold('build finish!'))
})