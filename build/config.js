'use strict'

module.exports = {
  port: 3000,
  devPort: 8000,
  url: 'mongodb://root:123456@localhost:27017/admin',
  productUrl: 'mongodb://root:********@localhost:27017/admin',
  session: {
    name: 'SID',
    secret: 'SID',
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 5 * 60 * 1e3
      // domain: "localhost"
    }
  }
}