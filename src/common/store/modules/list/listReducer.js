import types from '../../types'
import { createReducer } from '../../util'
import InitState from './listInitState'
/**
 * Created by olei on 2017/12/29.
 */
const type = types

export default createReducer(new InitState(), {
  [type.CLEAR_LIST_DATA]: (state, data) => {
    return state.set('data', data)
  },
  [type.SET_SEARCH_KEY]: (state, data) => {
    return state.set('search_key', data)
  },
  [`${type.GET_LIST_ITEMS}_SUCCESS`]: (state, data) => {
    const arr = state.data
    if (arr.objects) {
      arr.objects.push(...data.objects)
      data.objects = arr.objects
    }
    return state.set('data', data)
  }
})