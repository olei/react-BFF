import axios from 'axios'
// import fetch from 'isomorphic-fetch'
import types from '../../types'
/**
 * Created by olei on 2017/12/30.
 */
const type = types
export const homeAction = str => ({
  type: type.GET_SITE_DATA,
  content: str
})

export const getData = (userName, password) => ({
  type: type.GET_LOGIN_ITEMS,
  payload: {
    promise: axios.post(`/onLogin`, `userName=${userName}&password=${password}`)
  }
})

export const getVlogin = () => ({
  type: type.GET_VLOGIN,
  payload: {
    promise: axios.get(`http://wechat-dev.jzb.com/live/index/cnxh`)
  }
})