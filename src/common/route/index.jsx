import * as React from 'react'
// BrowserRouter h5 histore 路由
import { BrowserRouter, StaticRouter, HashRouter, Switch, Route, Router as Rt } from 'react-router-dom'
import routeConfig from './config'
import HomeView from '../views/Home/Home'
import ListView from '../views/List/List'
import NotFound from '../views/NotFound/NotFound'

export default (type, url, gists) => {
  return class Router extends React.Component {
    constructor (props) {
      super(props)
      const Lv = ListView(gists)
      this.routes = <Switch>
        <Route exact path={routeConfig[0]} component={HomeView}></Route>
        <Route path={routeConfig[1]} component={Lv}></Route>
        <Route path={routeConfig[2]} component={NotFound}></Route>
      </Switch>
    }
    render () {
      if (type === 'server') {
        return (
          <StaticRouter context={{}} location={url}>
            {this.routes}
          </StaticRouter>
        )
      } else {
        return (
          <BrowserRouter children={ this.routes } />
        )
      }
    }
  }
}