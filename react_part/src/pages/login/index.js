import React, { Fragment } from 'react'
import { withCookies } from 'react-cookie'
import { LoginContainer, ItemContainer, ErrorContainer } from './style'
import author from '../../assets/author.png'
import { Icon, Button, Alert } from 'antd'
import axios from 'axios'
import config from '../../config'

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isRegister: false,
      username: '',
      password: '',
      confirmPassword: '',
      showError: false,
      errorMessage: ''
    }
  }

  registerUser (isRegister) {
    this.setState({ isRegister: !isRegister })
  }

  showErrorMessage (errorMessage) {
    this.setState({
      showError: true,
      errorMessage
    })
    setTimeout(() => {
      this.setState({ showError: false })
    }, 2000)
  }

  submit () {
    if (!this.state.username || !this.state.password) {
      this.showErrorMessage('用户名或密码输入错误')
      return
    }
    if (this.state.isRegister && this.state.password !== this.state.confirmPassword) {
      this.showErrorMessage('密码输入不一致')
      return
    }

    axios.post(config.host + (this.state.isRegister ? config.userUrl.register : config.userUrl.login), {
      username: this.state.username,
      password: this.state.password
    }, {
      withCredentials: true
    }).then(data => {
      console.log(data.data)
      if (data.data.code !== 200) {
        this.showErrorMessage(data.data.message)
        return
      }
      window.location.href = './'
    })
  }

  changeUserName (username) {
    this.setState({ username })
  }

  changePassword (password) {
    this.setState({ password })
  }

  changeConfirmPassword (confirmPassword) {
    this.setState({ confirmPassword })
  }

  render () {
    return (
      <Fragment>
        <ErrorContainer>
          {
            this.state.showError ? (
              <Alert className='alert' message={this.state.errorMessage} type='error' showIcon />
            ) : null
          }
        </ErrorContainer>
        <LoginContainer>
          <img src={author} className='img' />
          <ItemContainer>
            <Icon type='user' className='iconfont' />
            <input value={this.state.username} placeholder='用户名' className='input' onChange={(e) => { this.changeUserName(e.target.value) }} />
          </ItemContainer>
          <ItemContainer>
            <Icon type='lock' className='iconfont' />
            <input type='password' placeholder='密码' className='input' onChange={(e) => { this.changePassword(e.target.value) }} />
          </ItemContainer>
          <ItemContainer hidden={!this.state.isRegister}>
            <Icon type='lock' className='iconfont' />
            <input type='password' placeholder='确认密码' className='input' onChange={e => { this.changeConfirmPassword(e.target.value) }} />
          </ItemContainer>
          <div style={{ width: '100%' }}>
            <u onClick={() => { this.registerUser(this.state.isRegister) }}>{this.state.isRegister ? '取消注册' : '注册用户'}</u>
          </div>

          <Button onClick={() => { this.submit() }} type='primary' block>{!this.state.isRegister ? '登录' : '注册'}</Button>
        </LoginContainer>
      </Fragment>
    )
  }
}

export default withCookies(Login)
