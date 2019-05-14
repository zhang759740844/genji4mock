const { query } = require('./base')
const { escape } = require('mysql')
const { tinyIntToBool, boolToTinyInt } = require('../util')

/**
 * 根据用户名获取用户 mock 列表
 *
 * @param {String} userInfo 用户名
 * @returns 数据列表 {
 *  id: 数据id
 *  interface_name: 接口名
 *  isopne: 是否使用
 * }
 */
async function mockList (userInfo) {
  const sql = `select MockData.id, interface_name, isopen from MockData, User where User.username = ${escape(userInfo)} and User.id = MockData.user_id order by update_time desc`
  let resultList = await query(sql)
  resultList.forEach(item => {
    item.isopen = tinyIntToBool(item.isopen)
  })
  return resultList
}

/**
 * 增加 Mock Api
 *
 * @param {*} interfaceName 接口名
 * @param {*} data 接口 Mock JSON
 * @param {*} userInfo 用户名
 * @returns 成功插入的 id
 */
async function addMockData (interfaceName, data, userInfo) {
  const id = await getUserId(userInfo)
  const sql = `insert into MockData (interface_name, mock_data, user_id) values (${escape(interfaceName)}, ${escape(data)}, ${id})`
  const result = await query(sql)
  return result.insertId
}

/**
 * 更新 Mock Api
 *
 * @param {*} data 接口 Mock JSON
 * @param {*} id 更新的 Mock Data 的 id
 */
async function updateMockData (data, id) {
  const sql = `update MockData set mock_data = ${escape(data)} where id = ${id}`
  await query(sql)
}

/**
 * 查看某个用户是否 mock 了该接口
 *
 * @param {String} interfaceName 接口名
 * @param {String} userInfo 用户名
 * @returns 存在接口的id 或 null
 */
async function getMockDataId (interfaceName, userInfo) {
  const userId = await getUserId(userInfo)
  const sql = `select id from MockData where user_id = ${userId} and interface_name = ${escape(interfaceName)}`
  const result = await query(sql)
  return result.length === 0 ? null : result[0].id
}

/**
 * 删除 Mock 接口
 *
 * @param {*} id Mock 接口的 id
 */
async function deleteMockData (id) {
  const sql = `delete from MockData where id = ${id}`
  await query(sql)
}

async function deleteAllMockData (username) {
  const userId = await getUserId(username)
  const sql = `delete from MockData where user_id = ${escape(userId)}`
  await query(sql)
}

async function closeAllMock (username) {
  const userId = await getUserId(username)
  const sql = `update MockData set isopen = 0 where user_id = ${escape(userId)}`
  await query(sql)
}

/**
 * 开关 Mock 接口
 *
 * @param {*} id Mock 接口的 id
 * @param {*} state Mock 开关状态
 */
async function switchMock (id, state) {
  const stateInt = boolToTinyInt(state)
  const sql = `update MockData set isopen = ${stateInt} where id = ${escape(id)}`
  await query(sql)
}

/**
 * 获取 MockData 的 id 对应的 Mock 数据
 *
 * @param {*} id Mock 接口 id
 * @returns Mock 数据 {
 *  mock_data: mock 数据
 *  use_yapi: 是否使用 yapi
 * }
 */
async function getMockInfo (id) {
  const sql = `select id, interface_name, mock_data, use_yapi from MockData where id = ${escape(id)} limit 1`
  const result = await query(sql)
  const one = { ...result[0], use_yapi: tinyIntToBool(result[0].use_yapi) }
  return one
}

/**
 * 启动或关闭 yapi 调用
 *
 * @param {*} id 接口 id
 * @param {*} state 开关状态
 */
async function switchyapi (id, state) {
  const stateInt = boolToTinyInt(state)
  const sql = `update MockData set use_yapi = ${stateInt} where id = ${(escape(id))}`
  await query(sql)
}

// SECTION 非网页端接口

/**
 * 根据接口名和用户名判断是否是开启的
 *
 * @param {*} interfaceName 接口名
 * @param {*} username 用户名
 * @returns 是否开启 如果不存在接口 返回 null
 */
async function getMockState (interfaceName, username) {
  const userId = await getUserId(username)
  const sql = `select isopen from MockData where interface_name = ${escape(interfaceName)} and user_id = ${userId} limit 1`
  const result = await query(sql)
  return result.length === 0 ? null : result[0].isopen
}

/**
 * 获取接口对应的 Mock 数据
 *
 * @param {*} interfaceName 接口名
 * @returns Mock 数据 {
 *  mock_data: mock 数据
 *  username: 用户名
 * }
 */
async function getMockData (interfaceName, username) {
  const userId = await getUserId(username)
  const sql = `select mock_data from MockData where interface_name = ${escape(interfaceName)} and user_id = ${userId} limit 1`
  let result = await query(sql)
  return result.length === 0 ? null : JSON.parse(result[0].mock_data)
}

/**
 * 获取接口是否使用 Yapi
 *
 * @param {*} interfaceName 接口名
 * @param {*} username 用户名
 * @returns 是否使用 bool 或者没有该接口
 */
async function getYapiState (interfaceName, username) {
  const userId = await getUserId(username)
  const sql = `select use_yapi from MockData where interface_name = ${escape(interfaceName)} and user_id = ${userId} limit 1`
  let result = await query(sql)
  return result.length === 0 ? null : result[0].use_yapi
}

// SECTION 内部方法

// 根据 userInfo 获取用户 id
async function getUserId (userInfo) {
  const sql = `select id from User where username = ${escape(userInfo)} `
  const result = await query(sql)
  return result[0].id
}

module.exports = {
  mockList,
  addMockData,
  getMockDataId,
  updateMockData,
  deleteMockData,
  switchMock,
  getMockInfo,
  switchyapi,
  getMockData,
  getYapiState,
  getMockState,
  deleteAllMockData,
  closeAllMock
}
