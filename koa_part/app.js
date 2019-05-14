const Koa = require('koa')
const app = new Koa()
const router = require('./router')
const request = require('request-promise')
const Static = require('koa-static')
const BodyParser = require('koa-bodyparser')
const { getRealPath, getHost } = require('./util')
const db = require('./db')
const { SuccessResult, ErrorResult, ResultEnum } = require('./router/modal')
const cors = require('koa-cors')

// 静态资源
app.use(Static('./dist'))
app.use(new BodyParser())

app.use(cors({
  origin: function (ctx) {
    if (ctx.url === '/cors') {
      return '*' // 允许来自所有域名请求
    }

    // 调试的时候使用跨域
    return 'http://localhost:3000'
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'], // 设置允许的HTTP请求类型
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}))

// 最后请求转发
app.use(async (ctx, next) => {
  await next()
  if (ctx.status === 404) {
    const userInfo = await db.getUserInfo(ctx.request.realPathObj.username)
    const url = `${userInfo.domain_scheme}${userInfo.domain}${ctx.request.url}`
    let obj = null
    ctx.request.headers.host = getHost(`${userInfo.domain_scheme}${userInfo.domain}`)
    let options = {
      method: ctx.method,
      url,
      headers: ctx.request.headers,
      json: true
    }
    if (ctx.method === 'POST') { options.body = ctx.request.body }
    try {
      obj = await request(options)
    } catch (err) {
      const errLog = `发生了错误，错误信息为: ${err.message}`
      obj = ErrorResult(ResultEnum.COMMON_ERROR, errLog)
      console.log(errLog)
    }
    ctx.body = obj
  }
})

// 本地请求
app.use(router.routes())

// mock 数据
app.use(async (ctx, next) => {
  const realPathObj = getRealPath(ctx.request.path)
  ctx.request.realPathObj = realPathObj
  ctx.request.url = getRealPath(ctx.request.url).suffix
  const isExistUser = await db.isExist(realPathObj.username)
  if (!isExistUser) {
    ctx.body = ErrorResult(ResultEnum.NOT_EXIST_ADMIN)
    return
  }
  // 不使用 mock 数据，直接转发
  const isopen = await db.getMockState(realPathObj.suffix, realPathObj.username)
  if (!isopen) { return }

  // 是否使用 yapi，使用走 yapi，不使用直接获取 mock 数据
  const mockFromYapi = await db.getYapiState(realPathObj.suffix, realPathObj.username)
  if (mockFromYapi) {
    // 从 YAPI 获取数据
    await next()
  } else {
    const mockData = await db.getMockData(realPathObj.suffix, realPathObj.username)
    ctx.body = SuccessResult(mockData)
  }
})

// 从 YAPI 获取 mock 数据
app.use(async (ctx, next) => {
  const userInfo = await db.getUserInfo(ctx.request.realPathObj.username)
  const url = `${userInfo.yapi_scheme}${userInfo.yapi}${ctx.request.url}`
  let obj = null
  let options = {
    method: ctx.method,
    url,
    json: true
  }
  try {
    obj = await request(options)
  } catch (err) {
    const errLog = `发生了错误，错误信息为: ${err.message}`
    obj = ErrorResult(ResultEnum.COMMON_ERROR, errLog)
    console.log(errLog)
  }
  ctx.body = obj
})

app.listen(3010, () => {
  console.log('正在监听3010端口')
})

module.exports = app
