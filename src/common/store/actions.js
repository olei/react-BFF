import * as homeAction from './modules/home/homeAction'
import * as listAction from './modules/list/listAction'
import * as userAction from './modules/userInfo/userAction'

export default {
  ...homeAction,
  ...listAction,
  ...userAction
}