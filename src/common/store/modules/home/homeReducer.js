import types from '../../types'
import { createReducer } from '../../util'
import InitState from './homeInitState'
/**
 * Created by olei on 2017/12/29.
 */
const type = types

export default createReducer(new InitState(), {
  [type.GET_SITE_DATA]: (state, data) => {
    return state.set('siteInfo', data)
  },
  [`${type.GET_LOGIN_ITEMS}_SUCCESS`]: (state, data) => {
    return state.set('data', data)
  },
  [`${type.GET_VLOGIN}_SUCCESS`]: (state, data) => {
    console.log('get action')
    return state.set('vLogin', !!data.status)
  }
})