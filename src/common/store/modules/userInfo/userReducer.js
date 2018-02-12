import types from '../../types'
import { createReducer } from '../../util'
import InitState from './userInitState'
/**
 * Created by olei on 2017/12/29.
 */
const type = types

export default createReducer(new InitState(), {
  [`${type.CREATE_USER_INFO}_SUCCESS`]: (state, data) => {
    return state.set('data', data)
  },
  [`${type.GET_USER_INFO}_SUCCESS`]: (state, data) => {
    return state.set('data', data)
  },
  [`${type.PUT_USER_INFO}_SUCCESS`]: (state, data) => {
    return state.set('data', data)
  },
  [`${type.DELELT_USER_INFO}_SUCCESS`]: (state, data) => {
    return state.set('data', data)
  }
})