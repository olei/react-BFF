import axios from 'axios'
// import fetch from 'isomorphic-fetch'
import types from '../../types'
/**
 * Created by olei on 2017/12/30.
 */
const type = types

export const clearListData = () => ({
  type: type.CLEAR_LIST_DATA,
  content: {}
})

export const getListData = (limit, offset) => ({
  type: type.GET_LIST_ITEMS,
  payload: {
    promise: axios.get(`/api/clientList?limit=${limit}&offset=${offset}`)
    // promise: fetch(`${window.$config.debug}/clientList?limit=${limit}&offset=${offset}`, {
    //   method: 'GET'
    // })
  }
})

export const getSearchData = key => ({
  type: type.GET_LIST_ITEMS,
  payload: {
    promise: axios.get(`/api/search?key=${key}`)
    // promise: fetch(`${window.$config.debug}/search?key=${key}`, {
    //   method: 'GET'
    // })
  }
})

export const setSearchKey = key => ({
  type: type.SET_SEARCH_KEY,
  content: key
})