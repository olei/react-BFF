import { createStore, applyMiddleware, combineReducers } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'
import thunk from 'redux-thunk'
// import createHistory from 'history/createBrowserHistory'
import promiseMiddleware from './util/promiseMiddleware'

// const history = createHistory()
// const middleware = routerMiddleware(history)
// const middlewares = [thunk, middleware, promiseMiddleware({promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR']})]
const middlewares = [thunk, promiseMiddleware({promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR']})]

// const store = createStore(
//   combineReducers({routing: routerReducer, ...rootReducer}),
//   composeWithDevTools(applyMiddleware(...middlewares))
// )

export default function (initState) {
  return createStore(
    combineReducers({routing: routerReducer, ...rootReducer}),
    initState,
    composeWithDevTools(applyMiddleware(...middlewares))
  )
}