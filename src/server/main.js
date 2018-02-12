import express from 'express'
import path from 'path'
import db from './mongodb/db'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import history from 'connect-history-api-fallback'

// import routes from './routes/index'
import apiRouter from './routes/serverRoute'
import config from '../../build/config'

import handleRender from './render'

const app = express()

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', true) // 可以带cookies
  res.header('X-Powered-By', '3.2.1')
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
})

console.log('admin id: ', process.env.ADMIN_ID || '')
console.log('listen: ', config.port)

const MongoStore = connectMongo(session)
app.use(cookieParser())
app.use(
  session({
    name: config.session.name,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: config.session.cookie,
    store: new MongoStore({
      url: config.url
    })
  })
)

// app.engine('html', require('ejs').renderFile)

// app.set('view engine', 'ejs')
// app.use(express.static(`${__dirname}/public`))
app.use(express.static(path.join(__dirname, '../../public')))

// routes(app)
app.use('/api', apiRouter)

app.use(history())

app.use('*', handleRender)
app.listen(config.port)