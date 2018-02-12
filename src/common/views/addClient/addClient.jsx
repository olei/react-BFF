import React from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import Action from '../../store/actions'

import { List, InputItem, Toast, Button, WhiteSpace, WingBlank, TextareaItem, Modal } from 'antd-mobile'

import './addClient.less'

const mAlert = Modal.alert

@connect(
  state => ({...state}),
  dispatch => bindActionCreators(Action, dispatch)
)
export default class ListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      id: null,
      userValue: '',
      phone: '',
      idCard: '',
      remarks: '',
      buttType: '提 交',
      ctrlType: 'editor',
      goList: false,
      query: /\/(\w|\d)+$/ig.exec(window.location.pathname)[0].slice(1)
    }
  }

  componentDidMount () {
    if (this.state.query && this.state.query !== 'addClient') {
      if (this.props.user.data && !this.props.user.data.data) {
        this.props.getUserData(this.state.query)
      } else if (this.props.user.data && this.props.user.data.data) {
        this.setStateFn()
      }
      this.setState({
        id: parseInt(this.state.query),
        buttType: '修 改'
      })
    } else {
      this.setState({
        id: parseInt(this.state.query),
        buttType: '提 交'
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    const data = nextProps.user.data
    alert(data.message)
    if (data.status) {
      this.setState({
        goList: true
      })
    }
  }

  setStateFn () {
    const data = this.props.user.data.data
    this.setState({
      userValue: data.name,
      phone: data.phone,
      idCard: data.idCard,
      remarks: data.remarks
    })
  }

  confirmChange () {
    mAlert('修改', '确定执行这个操作吗?', [
      { text: '取消', onPress: () => console.log('cancel') },
      {
        text: '确定',
        onPress: () => {
          this.setState({
            ctrlType: 'editor'
          })
          this.putClient()
        }
      }
    ])
  }

  confirmDel () {
    mAlert('删除', '确定执行这个操作吗?', [
      { text: '取消', onPress: () => console.log('cancel') },
      {
        text: '确定',
        onPress: () => {
          this.setState({
            ctrlType: 'del'
          })
          this.delClient()
        }
      }
    ])
  }

  createClient () {
    this.setState({
      ctrlType: 'editor'
    })
    this.props.createUserData(this.state.userValue, this.state.idCard, this.state.phone.replace(/\s/ig, ''), this.state.remarks)
  }

  delClient () {
    this.props.delUserData(parseInt(this.state.query))
  }

  putClient () {
    this.props.putUserData(parseInt(this.state.query), this.state.userValue, this.state.idCard, this.state.phone.replace(/\s/ig, ''), this.state.remarks)
  }

  onChange (type, value) {
    let obj = {}
    obj[type] = value
    this.setState(obj)
  }

  render () {
    if (this.state.goList) {
      return <Redirect push to="/list/1" />
    }
    return (
      <div>
        <List renderHeader={() => '添加客户信息'}>
          <InputItem
            value={this.state.userValue}
            placeholder="请输入客户名称"
            editable={true}
            onChange={this.onChange.bind(this, 'userValue')}
          >姓名</InputItem>
          <InputItem
            type='phone'
            placeholder="请输入手机号"
            onChange={this.onChange.bind(this, 'phone')}
            value={this.state.phone}
          >手机号码</InputItem>
          <InputItem
            placeholder="请输入身份证"
            moneyKeyboardAlign="left"
            onChange={this.onChange.bind(this, 'idCard')}
            value={this.state.idCard}
          >身份证</InputItem>
        </List>
        <List renderHeader={() => '备注'}>
          <TextareaItem
            rows={3}
            placeholder="这里填写..."
            value={this.state.remarks}
            onChange={this.onChange.bind(this, 'remarks')}
          />
        </List>
        {(() => {
          if (this.state.id) {
            return (
              <WingBlank>
                <Button type="primary" onClick={this.confirmChange.bind(this)}>{ this.state.buttType }</Button><WhiteSpace />
                <Button type="warning" onClick={this.confirmDel.bind(this)}>删除</Button>
              </WingBlank>
            )
          } else {
            return (
              <WingBlank>
                <Button type="primary" onClick={this.createClient.bind(this)}>{ this.state.buttType }</Button>
              </WingBlank>
            )
          }
        })()}
      </div>
    )
  }
}