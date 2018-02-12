import React from 'react'

function d (War) {
  return class Test extends React.Component {
    render () {
      return (
        <div>
          Test1
          <War/>
        </div>
      )
    }
  }
}

function d1 (War) {
  return class Test extends React.Component {
    render () {
      return (
        <div>
          Test2
          <War/>
        </div>
      )
    }
  }
}

function d2 (val) {
  return War => (
    class Test extends React.Component {
      render () {
        return (
          <div>
            Test345678 {val}
            <War/>
          </div>
        )
      }
    }
  )
}

@d
@d1
@d2('++')
export default class NotFoundView extends React.Component {
  render () {
    return (
      <div>
        错误信息
      </div>
    )
  }
}