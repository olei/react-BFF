'use strict'
import formidable from 'formidable'
import dtime from 'time-formater'
import { md5 } from '../../utils/crypt'
import BaseComponent from './baseController'
import user from '../models/user'
import clientListModel from '../models/clientList'

class ClientList extends BaseComponent {
  constructor () {
    super()
    this.createClient = this.createClient.bind(this)
    this.showClient = this.showClient.bind(this)
    this.editorClient = this.editorClient.bind(this)
    this.delClient = this.delClient.bind(this)
    this.searchClient = this.searchClient.bind(this)
    this.getStatus = this.getStatus.bind(this)
    this.getClient = this.getClient.bind(this)
  }
  async createClient (req, res, next) {
    // test string 拼接
    // let body = ''
    // req.on('data', chunk => {
    //   body += chunk
    // })
    // req.on('end',function(){
    //   console.log(body, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<==================')
    // })

    // test buffer concat
    // let postData = [], len = 0
    // req.on('data', chunk => {
    //   postData.push(chunk)
    //   len += chunk.length
    // })
    // req.on('end',function(){
    //   const bb = Buffer.concat(postData, len).toString()
    //   console.log('===========>>>>>>>>>>>>>>>>>>', bb)
    // })
   
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.send({
          status: 0,
          message: '表单信息错误'
        })
        return
      }
      if (!this.verifyLogin(req, res)) return
      const {name, phone, idCard, remarks} = fields
      try {
        if (!name) {
          throw new Error('客户姓名参数错误')
        } else if (!phone) {
          throw new Error('电话参数错误')
        } else if (!idCard) {
          throw new Error('身份证参数错误')
        }
      } catch (err) {
        console.log(err.message, err)
        res.send({
          status: 0,
          message: err.message
        })
        return
      }
      try {
        const clientCard = await clientListModel.findOne({idCard})
        const clientPhone = await clientListModel.findOne({phone})
        if (clientCard || clientPhone) {
          res.send({
            status: 0,
            message: '客户已存在'
          })
          return
        }
        const clientId = await this.getId('client_id')
        const newClient = {
          name,
          age: new Date().getFullYear() - parseInt(idCard.slice(6,10)),
          idCard,
          tIdCard: `${idCard.slice(0, -4)}****`,
          phone,
          tPhone: `${phone.slice(0, 3)}****${phone.slice(-4)}`,
          id: clientId,
          gender: (idCard.slice(-2, -1) % 2 ? 1 : 0),
          remarks,
          create_time: dtime().format('YYYY-MM-DD HH:mm')
        }
        const adminId = this.getSessionAdminId(req) // req.session.admin_id
        const userInfo = await user.findOne({id: adminId})
        const newList = userInfo.clientList
        newList.push(clientId)
        await user.findOneAndUpdate({id: adminId}, {$set: {clientList: newList}})
        await clientListModel.create(newClient)
        res.send({
          status: 1,
          message: '添加成功'
        })
      } catch (err) {
        console.log(err.message, err)
        res.send({
          status: 0,
          message: '添加失败'
        })
      }
    })
  }
  async delClient (req, res, next) {
    const clientId = req.params.client_id
    if (!this.verifyLogin(req, res)) return
    const adminId = this.getSessionAdminId(req) // req.session.adminId
    const userInfo = await user.findOne({id: adminId}, {_id: 0, rights: 1, clientList: 1})
    if (userInfo.rights > 1) {
      res.send({
        status: 0,
        message: '没有权限删除信息'
      })
      return
    }
    const client = await clientListModel.findOneAndRemove({id: clientId})
    if (client) {
      const oleList = userInfo.clientList
      const newList = oleList.filter(i => i !== parseInt(clientId))
      await user.findOneAndUpdate({id: adminId}, {$set: {clientList: newList}})
      res.send({
        status: 1,
        message: '删除成功'
      })
    } else {
      res.send({
        status: 0,
        message: '用户不存在'
      })
    }
  }
  async editorClient (req, res, next) {
    const clientId = req.params.client_id
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.send({
          status: 0,
          message: '表单信息错误'
        })
        return
      }
      if (!this.verifyLogin(req, res)) return
      const adminId = this.getSessionAdminId(req) // req.session.admin_id
      const userInfo = await user.findOne({id: adminId}, {_id: 0, rights: 1})
      if (userInfo.rights > 1) {
        res.send({
          status: 0,
          message: '没有权限修改信息'
        })
        return
      }
      const {name, phone, idCard, remarks} = fields
      try {
        if (!name) {
          throw new Error('客户姓名参数错误')
        } else if (!phone) {
          throw new Error('电话参数错误')
        } else if (!idCard) {
          throw new Error('身份证参数错误')
        }
      } catch (err) {
        console.log(err.message, err)
        res.send({
          status: 0,
          message: err.message
        })
        return
      }
      const tIdCard = `${idCard.slice(0, -4)}****`
      const tPhone = `${phone.slice(0, 3)}****${phone.slice(-4)}`
      const clientInfo = await clientListModel.findOneAndUpdate({id: clientId}, {$set: {name, phone, idCard, tIdCard, tPhone, remarks, age: new Date().getFullYear() - parseInt(idCard.slice(6, 10)), gender: (idCard.slice(-2, -1) % 2 ? 1 : 0)}})
      if (clientInfo) {
        res.send({
          status: 1,
          message: '修改成功'
        })
      } else {
        res.send({
          status: 0,
          message: '客户不存在'
        })
      }
    })
  }
  async getClient (req, res, next) {
    const clientId = req.params.client_id
    if (!this.verifyLogin(req, res)) return
    const clientInfo = await clientListModel.findOne({id: clientId}, {_id: 0, name: 1, remarks: 1, age: 1, id: 1, gender: 1, create_time: 1, phone: 1, idCard: 1})
    res.send({
      status: 1,
      data: clientInfo
    })
  }
  async backShowClient (req, res, next) {
    const { limit, offset, adminId } = this.getStatus(req, res)
    const userInfo = await user.findOne({id: adminId})
    if (!userInfo) {
      return {
        status: 1,
        limit,
        offset,
        objects: []
      }
    }
    try {
      const newList = userInfo.clientList
      const data = await clientListModel.find({$or: newList.map(i => ({id: i}))}, {name: 1, age: 1, id: 1, create_time: 1, gender: 1, tIdCard: 1, tPhone: 1, _id: 0}).limit(20).skip(0).sort({_id: -1})
      return {
        status: 1,
        limit,
        offset,
        total: newList.length,
        objects: data
      }
    } catch (err) {
      console.log(err.message, err)
      return {
        status: 1,
        limit,
        offset,
        objects: []
      }
    }
  }
  async showClient (req, res, next) {
    const { limit, offset, adminId } = this.getStatus(req, res)
    const userInfo = await user.findOne({id: adminId})
    if (!userInfo) {
      res.send({
        status: 1,
        limit,
        offset,
        objects: []
      })
      return
    }
    try {
      const newList = userInfo.clientList
      const data = await clientListModel.find({$or: newList.map(i => ({id: i}))}, {name: 1, age: 1, id: 1, create_time: 1, gender: 1, tIdCard: 1, tPhone: 1, _id: 0}).limit(limit).skip(offset).sort({_id: -1})
      res.send({
        status: 1,
        limit,
        offset,
        total: newList.length,
        objects: data
      })
    } catch (err) {
      console.log(err.message, err)
      res.send({
        status: 1,
        limit,
        offset,
        objects: []
      })
    }
  }
  async searchClient (req, res, next) {
    const { limit, offset, adminId, query } = this.getStatus(req, res)
    const userInfo = await user.findOne({id: adminId})
    if (!userInfo || !query.key) {
      res.send({
        status: 1,
        limit,
        offset,
        objects: []
      })
      return
    }
    const newList = userInfo.clientList
    const num = parseInt(query.key)
    let key
    if (num) {
      if (num.toString().length === 11) key = 'phone'
      else if (num.toString().length >= 16) key = 'idCard'
      else key = 'name'
    } else {
      key = 'name'
    }
    const opt = {}
    opt.$or = newList.map(i => ({id: i}))
    opt[key] = query.key
    const data = await clientListModel.find(opt, {name: 1, age: 1, tIdCard: 1, tPhone: 1, id: 1, create_time: 1, gender: 1, _id: 0}).limit(limit).skip(offset)
    res.send({
      status: 1,
      limit,
      offset,
      objects: data
    })
  }
  getStatus (req, res) {
    const adminId = this.getSessionAdminId(req) // req.session.admin_id
    if (!this.verifyLogin(req, res)) return false
    const query = req.query
    const limit = parseInt(query.limit) || 5
    const offset = parseInt(query.offset) || 0
    return { limit, offset, adminId, query }
  }
}

export default new ClientList()