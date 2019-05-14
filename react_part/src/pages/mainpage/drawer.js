import React from 'react'
import { Drawer, Input, Select, message, Button } from 'antd'
import { DrawerContainer, DrawerBottomContainer } from './style'
import axios from 'axios'
import config from '../../config'

const Option = Select.Option

class MyDrawer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      domain: '',
      yapi: '',
      domainScheme: 'http://',
      yapiScheme: 'http://'
    }
  }

  componentDidMount () {
    console.log('hahah')
  }

  openDrawer () {
    axios.get(config.host + config.userUrl.getUserInfo, {
      withCredentials: true
    }).then(res => {
      if (res.data.code !== 200) {
        message.error(res.data.message)
      } else {
        const data = res.data.data
        this.setState({
          domain: data.domain,
          yapi: data.yapi,
          domainScheme: data.domain_scheme,
          yapiScheme: data.yapi_scheme,
          show: true
        })
      }
    })
  }

  onClose () {
    this.setState({ show: false })
  }

  changeHost (e, isDomain) {
    if (isDomain) {
      this.setState({ domain: e.target.value })
    } else {
      this.setState({ yapi: e.target.value })
    }
  }

  changeScheme (value, isDomain) {
    if (isDomain) {
      this.setState({ domainScheme: value })
    } else {
      this.setState({ yapiScheme: value })
    }
  }

  submitDomain () {
    axios.post(config.host + config.userUrl.changeDomain, {
      domain: this.state.domain,
      yapi: this.state.yapi,
      domainScheme: this.state.domainScheme,
      yapiScheme: this.state.yapiScheme
    }, {
      withCredentials: true
    }).then(res => {
      if (res.data.code !== 200) {
        message.error(res.data.message)
      } else {
        message.success('更新域名成功')
        this.setState({ show: false })
      }
    })
  }

  renderSelectBefore (isDomain) {
    const value = isDomain ? this.state.domainScheme : this.state.yapiScheme
    return (
      <Select
        value={value}
        onChange={(value) => { this.changeScheme(value, isDomain) }}
        style={{ width: 100 }}
      >
        <Option value='http://'>http://</Option>
        <Option value='https://'>https://</Option>
      </Select>
    )
  }

  render () {
    return (
      <Drawer
        title='设置域名'
        width={720}
        visible={this.state.show}
        onClose={() => { this.onClose() }}
      >
        <DrawerContainer>
          <b>主域名</b>
          <Input
            value={this.state.domain}
            addonBefore={this.renderSelectBefore(true)}
            onChange={(e) => { this.changeHost(e, true) }}
          />
          <b>yapi域名</b>
          <Input
            value={this.state.yapi}
            addonBefore={this.renderSelectBefore(false)}
            onChange={(e) => { this.changeHost(e, false) }}
          />
        </DrawerContainer>
        <DrawerBottomContainer>
          <Button className='button' type='primary' onClick={() => { this.submitDomain() }}>
            确定
          </Button>
          <Button className='button' onClick={() => {
            this.setState({ show: false })
          }}>
            取消
          </Button>
        </DrawerBottomContainer>
      </Drawer>
    )
  }
}

export default MyDrawer
