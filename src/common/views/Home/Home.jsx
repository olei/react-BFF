import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import Action from '../../store/actions'

import { Flex, NoticeBar, Icon, Carousel, WhiteSpace, WingBlank } from 'antd-mobile'

import './Home.less'

@connect(
  state => ({...state}),
  dispatch => bindActionCreators(Action, dispatch)
)

export default class HomeView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: ['1', '2', '3'],
      imgHeight: 176,
      slideIndex: 0
    }
  }

  componentWillMount () {
    // console.log(1)
  }

  componentDidMount () { // 服务端无此生命周期
    // alert(2)
  }

  componentWillReceiveProps (nextProps) {}

  fn () {
    alert('test')
  }

  render () {
    return (
      <div>
        <Carousel
          autoplay={false}
          infinite
          selectedIndex={1}
          beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          afterChange={index => console.log('slide to', index)}
        >
          {this.state.data.map(val => (
            <a
              key={val}
              href="http://www.alipay.com"
              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
              <img
                src={`https://img.alicdn.com/tps/i4/TB1QB6MXNWYBuNjy1zkSutGGpXa.jpg_760x760Q50s50.jpg_.webp`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  window.dispatchEvent(new Event('resize'))
                  this.setState({ imgHeight: 'auto' })
                }}
              />
            </a>
          ))}
        </Carousel>
        <NoticeBar mode="link" onClick={() => alert('1')}>
          测试通知内容，内容尽量多！文字要长，内容要多，测试滚动走马灯！！！！！
        </NoticeBar>
        <WhiteSpace size="lg" />
        <Flex>
          <Flex.Item>
            <Link to="/about">
              <div className="bBu">{ this.props.home.siteInfo }</div>
            </Link>
          </Flex.Item>
          <Flex.Item>
            <Link to="/about">
              <div className="sBu">已完成</div>
            </Link>
            <Link to="/about">
              <div className="sBu">未完成</div>
            </Link>
          </Flex.Item>
          <Flex.Item>
            <Link to="/about">
              <div className="sBu">本地</div>
            </Link>
            <Link to="/list/0/0">
              <div className="sBu">外地</div>
            </Link>
          </Flex.Item>
        </Flex>
        <WhiteSpace size="lg" />
        <Flex>
          <Flex.Item>
            <div className="bBu rb">工具</div>
          </Flex.Item>
          <Flex.Item>
            <div className="sBu rb">计算器</div>
            <div className="sBu rb">利率计算</div>
          </Flex.Item>
          <Flex.Item>
            <div className="sBu rb">汇率计算</div>
            <div className="sBu rb">无</div>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}