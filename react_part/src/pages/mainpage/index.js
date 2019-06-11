import React from 'react'
import 'antd/dist/antd.css'
import author from '../../assets/author.png'
import { Switch, Layout, Avatar, message, Input, List, Empty, Button, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { LogoContainer, SiderContainer, ItemContainer, DataHeaderContainer, DataContainer } from './style'
import { withCookies } from 'react-cookie'
import axios from 'axios'
import config from '../../config'
import Item from 'antd/lib/list/Item'
import Drawer from './drawer'

const confirm = Modal.confirm
const Search = Input.Search
const { TextArea } = Input

const { Header, Content, Sider } = Layout

class MainPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLogined: !!props.cookies.get('userInfo'),
      userInfo: props.cookies.get('userInfo'),
      // mock 数据列表
      interfaceList: [],
      // 搜索到的 mock 数据列表
      searchedInterfaceList: [],
      // 选中的mock数据
      selectedMockData: {},
      // 搜索接口文字
      searchString: '',
      // 是否在搜索
      searching: false,
      // 是否是添加 Mock 数据
      addingMock: false,
      // 添加 Mock 的临时信息
      addingMockData: {
        interface_name: '',
        mock_data: ''
      }
    }
  }

  componentDidMount () {
    this.getMockList()
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
        e.preventDefault()
        this.refs.changeTextArea && this.refs.changeTextArea.blur()
        this.submitMockData()
      }
    })
  }

  // 获取 Mock 数据列表
  getMockList () {
    axios.get(config.host + config.mockUrl.mockList, {
      withCredentials: true
    }).then(res => {
      if (res.data.code !== 200) {
        message.error(res.data.message)
        return
      }
      this.setState({ interfaceList: res.data.data })
      return res.data.data[0]
    }).then(data => {
      if (!data) return
      const id = data.id
      return axios.get(config.host + config.mockUrl.mockInfo + `?id=${id}`, {
        withCredentials: true
      })
    }).then(res => {
      if (!res) { return }
      if (res && res.data.code !== 200) {
        message.error(res.data.message)
        return
      }
      this.setState({ selectedMockData: res.data.data })
    })
  }

  changeSearchString (e) {
    this.setState({ searchString: e.target.value })
  }

  // 根据名称搜索接口
  searchMockItem (value) {
    const searchedInterfaceList = this.state.interfaceList.filter(item => {
      return item.interface_name.indexOf(value) !== -1
    })
    this.setState({
      searching: true,
      searchString: value,
      searchedInterfaceList
    })
  }

  // 立即创建 Mock 数据
  createMockData () {
    this.setState({
      addingMockData: {
        ...this.state.addingMockData,
        interface_name: this.state.searchString
      },
      addingMock: true
    })
  }

  deleteAll () {
    confirm({
      title: '确认全部删除？',
      onOk: () => {
        axios.get(config.host + config.mockUrl.deleteAll, {
          withCredentials: true
        }).then(res => {
          if (res.data.code !== 200) {
            message.error('删除不成功')
          } else {
            message.success('删除成功')
            this.setState({
              interfaceList: [],
              searchedInterfaceList: []
            })
          }
        })
      }
    })
  }

  closeAll () {
    axios.get(config.host + config.mockUrl.closeAll, {
      withCredentials: true
    }).then(res => {
      if (res.data.code !== 200) {
        message.error('关闭不成功')
      } else {
        message.success('关闭成功')
        const newList = this.state.interfaceList.map(item => (Object.assign({}, item, { isopen: false })))
        const newSearchList = this.state.searchedInterfaceList.map(item => (Object.assign({}, item, { isopen: false })))
        this.setState({
          interfaceList: newList,
          searchedInterfaceList: newSearchList
        })
      }
    })
  }

  // 开关 Mock
  changeMockSwitch (value, item) {
    item.isopen = value
    axios.get(config.host + config.mockUrl.switchMock + `?id=${item.id}&state=${value}`, {
      withCredentials: true
    }).then(res => {
      if (res.data.code !== 200) {
        message.error(res.data.message)
        return
      }
      this.setState({ interfaceList: this.state.interfaceList })
    })
  }

  // 开关 YAPI
  changeYAPISwitch (value) {
    const mockInfo = this.state.selectedMockData
    axios.get(config.host + config.mockUrl.swithYAPI + `?id=${mockInfo.id}&state=${value}`, {
      withCredentials: true
    }).then(res => {
      if (res.data.code !== 200) {
        message.error(res.data.message)
        return
      }
      this.setState({ selectedMockData: { ...this.state.selectedMockData, use_yapi: value } })
    })
  }

  // data 输入框输入事件
  changeMockData (e) {
    this.setState({
      selectedMockData: {
        ...this.state.selectedMockData,
        mock_data: e.target.value
      }
    })
  }

  // 添加 Mock 数据的时候输入 data
  changeAddMockData (e) {
    this.setState({
      addingMockData: {
        ...this.state.addingMockData,
        mock_data: e.target.value
      }
    })
  }

  // 添加 Mock 数据时候的 InterfaceName
  changeMockInterfaceName (e) {
    this.setState({
      addingMockData: { ...this.state.addingMockData, interface_name: e.target.value }
    })
  }

  // 获取 Mock 数据详情
  getMockDetail (item) {
    axios.get(config.host + config.mockUrl.mockInfo + `?id=${item.id}`, {
      withCredentials: true
    }).then(res => {
      if (res.data.code !== 200) {
        message.error(res.data.message)
        return
      }
      this.setState({ selectedMockData: res.data.data })
    })
  }

  formatJSON () {
    let mockData = null
    if (!this.state.addingMock) {
      try {
        mockData = JSON.parse(this.state.selectedMockData.mock_data)
      } catch (error) {
        alert(error)
      }
    } else {
      try {
        mockData = JSON.parse(this.state.addingMockData.mock_data)
      } catch (error) {
        alert(error)
      }
    }
    if (!mockData) return
    const mockString = JSON.stringify(mockData, null, 2)
    if (!this.state.addingMock) {
      this.setState({
        selectedMockData: Object.assign(this.state.selectedMockData, { mock_data: mockString })
      })
    } else {
      this.setState({
        addingMockData: Object.assign(this.state.addingMockData, { mock_data: mockString })
      })
    }
  }

  // 更新 Mock 数据或者添加接口
  submitMockData () {
    const changedInterface = this.state.addingMock ? this.state.addingMockData : this.state.selectedMockData
    axios.post(config.host + config.mockUrl.updateMock, {
      data: changedInterface.mock_data,
      interfaceName: changedInterface.interface_name
    }, {
      withCredentials: true
    }).then(res => {
      if (res.data.code !== 200) {
        message.error(res.data.message)
      } else {
        message.success(`接口 ${changedInterface.interface_name} 保存成功`)
        this.setState({
          addingMockData: {
            interface_name: '',
            mock_data: ''
          },
          addingMock: false,
          searchString: '',
          searching: false
        })
        this.getMockList()
      }
    })
  }

  // 取消添加 Mock 数据
  cancelAddMockData () {
    this.setState({
      addingMock: false
    })
  }

  // 删除 Mock 数据
  deleteMockData () {
    axios.post(config.host + config.mockUrl.deleteMock, {
      id: this.state.selectedMockData.id
    }).then(res => {
      if (res.data.code !== 200) {
        message.error(res.data.message)
      } else {
        message.success('删除成功')
        this.getMockList()
      }
    })
  }

  renderLoginBtn () {
    return (
      <Link to='/login'>
        <LogoContainer>
          <Avatar size={32} icon='user' />
          <span className='text'>登录/注册</span>
        </LogoContainer>
      </Link>
    )
  }

  render () {
    const interfaceList = !this.state.searching ? this.state.interfaceList : this.state.searchedInterfaceList
    return (
      <Layout>
        <Drawer ref='drawer' />
        <Header>
          {
            this.state.isLogined ? (
              <LogoContainer onClick={() => { this.refs.drawer.openDrawer() }}>
                <img src={author} className='img' />
                <span className='text'>{this.state.userInfo}</span>
              </LogoContainer>
            ) : (
              this.renderLoginBtn()
            )
          }
          <h1 style={{ color: 'white' }}>自助Mock</h1>
        </Header>
        <Layout>
          <Sider width={400} style={{ background: '#fff' }}>
            <SiderContainer>
              <Search
                value={this.state.searchString}
                placeholder='输入 API 名'
                onChange={e => { this.changeSearchString(e) }}
                onSearch={value => { this.searchMockItem(value) }}
                enterButton
              />
              {
                interfaceList.length !== 0 ? (
                  <List
                    rowKey={item => item.id}
                    dataSource={interfaceList}
                    itemLayout='horizontal'
                    renderItem={item => (
                      <Item>
                        <ItemContainer onClick={() => { this.getMockDetail(item) }}>
                          <span>{item.interface_name}</span>
                          <Switch
                            checkedChildren='开'
                            unCheckedChildren='关'
                            checked={item.isopen}
                            onChange={(value, event) => {
                              event.stopPropagation()
                              this.changeMockSwitch(value, item)
                            }}
                          />
                        </ItemContainer>
                      </Item>
                    )}
                  />
                ) : (
                  <Empty
                    style={{ marginTop: '100px' }}
                    image='https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original'
                    imageStyle={{ height: 60 }}
                    description={<span> 未找到相关接口 </span>}
                  >
                    <Button hidden={!this.state.isLogined} onClick={() => { this.createMockData() }} type='primary'>现在创建？</Button>
                  </Empty>
                )

              }
              <div className='bottom'>
                <Button
                  onClick={() => { this.deleteAll() }}
                  className='button'
                  type='danger'
                >
                  删除全部
                </Button>
                <Button
                  onClick={() => { this.closeAll() }}
                  className='button'
                >
                  全部关闭
                </Button>
                <Button
                  className='button'
                  onClick={() => {
                    this.setState({ addingMock: true })
                  }}
                  type='primary'
                >
                  立即添加
                </Button>
              </div>
            </SiderContainer>
          </Sider>
          <Layout hidden={!this.state.isLogined || (this.state.interfaceList.length === 0 && !this.state.addingMock)} style={{ padding: '24px 24px 24px' }}>
            {
              this.state.addingMock ? (
                <DataHeaderContainer>
                  <Input
                    value={this.state.addingMockData.interface_name}
                    onChange={(e) => { this.changeMockInterfaceName(e) }}
                    onPaste={(e) => { this.changeMockInterfaceName(e) }}
                    placeholder='请输入添加的接口'
                  />
                </DataHeaderContainer>
              ) : (
                <DataHeaderContainer>
                  <span className='interface'>{this.state.selectedMockData.interface_name}</span>
                  <span className='hint'>使用YAPI?</span>
                  <Switch
                    checkedChildren='开'
                    unCheckedChildren='关'
                    checked={this.state.selectedMockData.use_yapi}
                    onChange={(value) => { this.changeYAPISwitch(value) }}
                  />
                </DataHeaderContainer>
              )
            }

            <Content style={{
              background: '#fff', padding: 24, margin: 0, minHeight: 500, height: 1
            }} >
              <DataContainer>
                <Button className='format' onClick={() => { this.formatJSON() }}>格式化</Button>
                {
                  !this.state.addingMock ? (
                    <TextArea
                      ref='changeTextArea'
                      className='textarea'
                      value={this.state.selectedMockData.mock_data}
                      onChange={e => { this.changeMockData(e) }}
                      onPaste={e => { this.changeMockData(e) }}
                    />
                  ) : (
                    <TextArea
                      className='textarea'
                      value={this.state.addingMockData.mock_data}
                      onChange={e => { this.changeAddMockData(e) }}
                      onPaste={e => { this.changeAddMockData(e) }}
                    />
                  )
                }
                <div className='btn-container'>
                  {
                    this.state.addingMock ? (
                      <div className='delete-btn' onClick={() => { this.cancelAddMockData() }}>取消</div>
                    ) : (
                      <div className='delete-btn' onClick={() => { this.deleteMockData() }}>删除</div>
                    )
                  }
                  <div className='save-btn' onClick={() => { this.submitMockData() }}>保存</div>
                </div>
              </DataContainer>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default withCookies(MainPage)
