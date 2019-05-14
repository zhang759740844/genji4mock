const { query } = require('./base')
const { escape } = require('mysql')
const _ = require('lodash')

/**
 * 是否存在该用户
 * @param {String} username 用户名
 */
async function isExist (username) {
  const sql = `select id from User where username = ${escape(username)}`
  const result = await query(sql)
  return !_.isEmpty(result)
}

/**
 * 获取用户信息
 *
 * @param {*} username 用户名
 * @returns 用户信息
 */
async function getUserInfo (username) {
  const sql = `select domain, yapi, domain_scheme, yapi_scheme, id from User where username = ${escape(username)}`
  const result = await query(sql)
  return result[0]
}

/**
 * 改变或新增用户的域名
 *
 * @param {*} username 用户信息
 * @param {*} domain 用户的主域名
 * @param {*} yapi yapi 的地址
 * @param {*} domainScheme 用户主域名协议
 * @param {*} yapiScheme yapi协议
 * @returns 是否改变成功
 */
async function changeDomain (username, domain, yapi, domainScheme, yapiScheme) {
  const sql = `update User set domain = ${escape(domain)}, yapi = ${escape(yapi)}, domain_scheme = ${escape(domainScheme)}, yapi_scheme = ${escape(yapiScheme)}  where username = ${escape(username)}`
  try {
    await query(sql)
    return true
  } catch (error) {
    return false
  }
}

/**
 * 注册用户
 * @param {String} username 用户名
 * @param {String} password 密码
 */
async function register (username, password) {
  const sql = `insert into User (username, password) values (${escape(username)}, ${escape(password)})`
  try {
    await query(sql)
    return true
  } catch (error) {
    return false
  }
}

/**
 * 登录
 *
 * @param {*} username 用户名
 * @param {*} password 密码
 */
async function login (username, password) {
  const sql = `select id from User where username = ${escape(username)} and password = ${escape(password)}`
  const result = await query(sql)
  return !_.isEmpty(result)
}

module.exports = {
  isExist,
  register,
  login,
  getUserInfo,
  changeDomain
}
