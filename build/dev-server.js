const webpack = require('webpack')
const path = require('path')
const express = require('express')
const http = require('http')
const proxyMiddleware = require('http-proxy-middleware')
const config = require('./config')

// 粉笔
const chalk = require('chalk')

const dev = require('./webpack.dev')
const proxyTable = require('./proxyTable')

const app = express()
const compiler = webpack(dev)

const port = process.env.PORT || config.devPort

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: dev.output.publicPath,
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
  },
  historyApiFallback: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler)
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  next()
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

app.use(devMiddleware)

app.use(hotMiddleware)

// const staticPath = path.posix.join('/', 'static')
// app.use(staticPath, express.static('./static'))
app.use(express.static(__dirname + dev.output.publicPath))

// http server
const server = http.createServer(app)
server.listen(port, '0.0.0.0', function(err) {
  if (err) throw err
  // server.keepAliveTimeout = 0 //node版本号低于8.1.1  由于超时，node kill掉请求。通过设置keepalivetimeout解决超时热更新失效
  const addr = server.address()
  console.log('Listening at http://%s:%d', addr.address, addr.port)
})


// express server
// app.listen(port, function (err) {
//   if(err){
//       console.error(err)
//   } else {
//       console.log(chalk.green.bold('\nlistened at port -> ' + chalk.rgb(9, 9, 9).green.bold(port)))
//   }
// })