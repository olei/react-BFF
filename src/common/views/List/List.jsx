import React from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import Action from '../../store/actions'

import { List, SearchBar, Button } from 'antd-mobile'

import './List.less'

const Item = List.Item

// @connect(
//   state => ({...state}),
//   dispatch => bindActionCreators(Action, dispatch)
// )
// class ListC extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       data: this.props.listdata || {}
//     }
//   }

//   componentDidMount () { // 服务端无此生命周期
//     if (window.__INITIAL_STATE__.objects) {
//       this.setState({
//         data: window.__INITIAL_STATE__
//       })
//     } else {
//       this.props.clearListData()
//       this.props.getListData(20, 0)
//     }
//   }

//   componentWillReceiveProps (nextProps) {
//     this.setState({
//       data: nextProps.list.data
//     })
//   }

//   render () {
//     return (
//       <div>
//         {this.state.data.objects && this.state.data.objects.map((item, index) => {
//           return (
//             <li key={item.id}>
//               { index + 1 < 10 ? `0${index + 1}` : index + 1 } - { item.id } - { item.name } - { item.age } - { item.tIdCard } - { item.tPhone }
//             </li>
//           )
//         })}
//       </div>
//     )
//   }
// }

// export default data => {
//   return class ListView extends React.Component {
//     constructor (props) {
//       super(props)
//     }

//     render () {
//       return (
//         <ListC listdata={data} />
//       )
//     }
//   }
// }

export default data => {
  @connect(
    state => ({...state}),
    dispatch => bindActionCreators(Action, dispatch)
  )
  class ListC extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        data: data || {}
      }
    }

    componentDidMount () { // 服务端无此生命周期
      if (window.__INITIAL_STATE__.objects) {
        this.setState({
          data: window.__INITIAL_STATE__
        })
      } else {
        this.props.clearListData()
        this.props.getListData(20, 0)
      }
    }

    componentWillReceiveProps (nextProps) {
      this.setState({
        data: nextProps.list.data
      })
    }

    render () {
      return (
        <div>
          {this.state.data.objects && this.state.data.objects.map((item, index) => {
            return (
              <li key={item.id}>
                { index + 1 < 10 ? `0${index + 1}` : index + 1 } - { item.id } - { item.name } - { item.age } - { item.tIdCard } - { item.tPhone }
              </li>
            )
          })}
        </div>
      )
    }
  }

  return ListC
}