import '../assets/less/reset.less'
import '../assets/less/index.less'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import storeApp from '../common/store'
import AppRoute from '../common/route'
import createHistory from 'history/createBrowserHistory'
const Route = AppRoute('client')

const initState = window.__INITIAL_STATE__ || {}
const store = storeApp(initState)
const history = createHistory()

let attachFastClick = require('fastclick')
attachFastClick.attach(document.body)

const target = document.getElementById('app')

class Root extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <Route history={history} />
      </Provider>
    )
  }
}

ReactDOM.render(<Root/>, target)
