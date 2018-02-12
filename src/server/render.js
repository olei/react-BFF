import {renderToString} from 'react-dom/server'
import qs from 'qs'
import { Provider } from 'react-redux'
import { Set } from 'immutable'
import React from 'react'
import { StaticRouter as Router, matchPath } from 'react-router'
import { getVlogin } from '../common/store/actions'
import storeApp from '../common/store'
import AppRoute from '../common/route'
import fs from 'fs'
import path from 'path'
import routeConfig from '../common/route/config'
import clientList from './api/clientList'
import BaseController from './api/baseController'

// 请求测试
import axios from 'axios'

import createHistory from 'history/createMemoryHistory'
const history = createHistory()

function renderFullPage (html, initState) {
  const assets = JSON.parse(fs.readFileSync(path.join(__dirname, '../../build/webpack-assets.json')))
  const appJS = assets.javascript.app
  // const vendorJS = assets.javascript.vendor
  // const manifestJS = assets.javascript.manifest
  const appStyles = assets.styles.app
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>家长帮</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

      <meta name="mobile-agent" content="format=html5;url=https://m.jzb.com/bbs/bj/">
      <meta name="mobile-agent" content="format=xhtml;url=https://m.jzb.com/bbs/bj/">
      <link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.jzb.com/bbs/bj/"/>
      <meta http-equiv=”Cache-Control” content=”no-transform”/>
      <meta http-equiv=”Cache-Control” content=”no-siteapp”/>
      <script>!function(a){function b(){a.rem=f.getBoundingClientRect().width/16,f.style.fontSize=a.rem+"px",window.pubW=a.rem}var c,d=a.navigator.appVersion.match(/iphone/gi)?a.devicePixelRatio:1,e=1/d,f=document.documentElement,g=document.createElement("meta");if(a.dpr=d,a.addEventListener("resize",function(){clearTimeout(c),c=setTimeout(b,300)},!1),a.addEventListener("pageshow",function(a){a.persisted&&(clearTimeout(c),c=setTimeout(b,300))},!1),f.setAttribute("data-dpr",d),g.setAttribute("name","viewport"),g.setAttribute("content","initial-scale="+e+", maximum-scale="+e+", minimum-scale="+e+", user-scalable=no"),f.firstElementChild)f.firstElementChild.appendChild(g);else{var h=document.createElement("div");h.appendChild(g),document.write(h.innerHTML)}b()}(window);</script>
      <script>
        window.$config = {}
        window.$config.debug = 'http://localhost:3000'
      </script>
      <link href=${appStyles} rel=stylesheet>
    </head>
    <body>
      <div id="app"><div>${html}</div></div>
      <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(initState || '')}
      </script>
      <script src=${appJS}></script>
    </body>
    </html>
  `
}

// DOTO
export default async (req, res) => {
  console.log('--------------------', 'running', '---------------------')
  console.log('route: ', req.originalUrl)
  const store = storeApp({})
  let state = store.getState()
  let data = {}
  switch (req.originalUrl) {
    case '/list/0/0':
      data = await clientList.backShowClient(req, res)
      break
  }
  const Route = AppRoute('server', req.originalUrl, data)
  const match = routeConfig.reduce((acc, route) => matchPath(req.originalUrl, route, { exact: true }) || acc, null)
  if (!match.isExact) {
    res.status(404).send('无此内容')
    return
  }
  // axios.get('http://wechat-dev.jzb.com/live/index/cnxh').then(data => {
  //   console.log(data)
  // })
  // const finalState = Object.assign(state, {userID: new BaseController().getSessionAdminId(req)})
  const finalState = Object.assign(data, {userID: new BaseController().getSessionAdminId(req)})
  res.end(renderFullPage(renderToString(
    <Provider store={store}>
      <Route history={history} />
    </Provider>
  ), finalState))
}