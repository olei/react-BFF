import axios from 'axios'
// import fetch from 'isomorphic-fetch'
import types from '../../types'
/**
 * Created by olei on 2017/12/30.
 */
const type = types

export const getUserData = id => ({
  type: type.GET_USER_INFO,
  payload: {
    promise: axios.get(`/getClient/${id}`)
  }
})

export const createUserData = (name, idCard, phone, remarks) => ({
  type: type.CREATE_USER_INFO,
  payload: {
    promise: axios.post(`/createClient`, `name=${encodeURIComponent(name)}&idCard=${idCard}&phone=${phone}&remarks=${encodeURIComponent(remarks)}`)
    // promise: fetch(`${window.$config.debug}/createClient`, {
    //   method: 'POST',
    //   body: `name=${encodeURIComponent(name)}&idCard=${idCard}&phone=${phone}&remarks=${encodeURIComponent(remarks)}`
    // })
  }
})

export const putUserData = (id, name, idCard, phone, remarks) => ({
  type: type.PUT_USER_INFO,
  payload: {
    promise: axios.put(`/clients/${id}`, `name=${encodeURIComponent(name)}&idCard=${idCard}&phone=${phone}&remarks=${encodeURIComponent(remarks)}`)
    // promise: fetch(`${window.$config.debug}/clients/${id}`, {
    //   method: 'PUT',
    //   body: `name=${encodeURIComponent(name)}&idCard=${idCard}&phone=${phone}&remarks=${encodeURIComponent(remarks)}`
    // })
  }
})

export const delUserData = id => ({
  type: type.DELELT_USER_INFO,
  payload: {
    promise: axios.delete(`/client/${id}`)
    // promise: fetch(`${window.$config.debug}/client/${id}`, {
    //   method: 'DELETE'
    // })
  }
})