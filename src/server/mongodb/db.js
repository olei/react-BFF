'use strict'

import mongoose from 'mongoose'
import config from '../../../build/config'
import chalk from 'chalk'

console.log('运行环境：', process.env.NODE_ENV)
const url = process.env.NODE_ENV === 'development' ? config.url : config.productUrl
// mongoose.connect(config.url, {useMongoClient: true})
mongoose.connect(config.url)
mongoose.Promise = global.Promise

const db = mongoose.connection

db.once('open', () => {
  console.log(
    chalk.green('连接数据库成功')
  )
})

db.on('error', error => {
  console.error(
    chalk.red('Error in MongoDb connection: ' + error)
  )
  mongoose.disconnect()
})

db.on('close', () => {
  console.log(
    chalk.red('数据库断开，重新连接数据库')
  )
  mongoose.connect(config.url, {server: {auto_reconnect: true}})
})

export default db