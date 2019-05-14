const { ResultEnum, SuccessResult, ErrorResult } = require('./modal')
const Router = require('koa-router')
const router = new Router()
const db = require('../db')

// 静默登录
// cookie 中的 userInfo，实际为 username
router.post('/login-sliently', async (ctx) => {
  const userInfo = ctx.cookies.get('userInfo')
  if (!userInfo) {
    ctx.body = ErrorResult(ResultEnum.NEED_LOGIN)
    return
  }

  const isLogin = await db.isExist(userInfo)
  ctx.body = isLogin ? SuccessResult() : ErrorResult(ResultEnum.NEED_LOGIN)
})

// 登录
router.post('/login', async (ctx) => {
  if (!ctx.request.body || !ctx.request.body.username || !ctx.request.body.password) {
    ctx.body = ErrorResult(ResultEnum.NEED_USERNAME_OR_PASSWORD)
    return
  }

  const loginResult = await db.login(ctx.request.body.username, ctx.request.body.password)
  if (loginResult) {
    ctx.cookies.set('userInfo', ctx.request.body.username, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: false,
      overwrite: true
    })
    ctx.body = SuccessResult()
  } else {
    ctx.body = ErrorResult(ResultEnum.NEED_USERNAME_OR_PASSWORD)
  }
})

// 注册
// username password
router.post('/register', async (ctx) => {
  if (ctx.request.body && ctx.request.body.username && ctx.request.body.password) {
    const isExist = await db.isExist(ctx.request.body.username)
    if (isExist) {
      ctx.body = ErrorResult(ResultEnum.EXIST_ADMIN)
      return
    }
    const result = await db.register(ctx.request.body.username, ctx.request.body.password)
    if (result) {
      ctx.cookies.set('userInfo', ctx.request.body.username, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: false,
        overwrite: true
      })
      ctx.body = SuccessResult()
    } else {
      ctx.body = ErrorResult(ResultEnum.COMMON_ERROR, '注册失败')
    }
  } else {
    ctx.body = ErrorResult(ResultEnum.NEED_USERNAME_OR_PASSWORD)
  }
})

// ANCHOR domain 相关

// 获取用户信息
router.get('/userinfo', async (ctx) => {
  const username = ctx.cookies.get('userInfo')
  const userInfo = await db.getUserInfo(username)
  if (!userInfo) {
    ctx.body = ErrorResult(ResultEnum.NOT_EXIST_ADMIN)
  } else {
    ctx.body = SuccessResult(userInfo)
  }
})

// 修改域名
router.post('/change-domain', async (ctx) => {
  const username = ctx.cookies.get('userInfo')
  const domain = ctx.request.body.domain
  const yapi = ctx.request.body.yapi
  const domainScheme = ctx.request.body.domainScheme
  const yapiScheme = ctx.request.body.yapiScheme
  const result = await db.changeDomain(username, domain, yapi, domainScheme, yapiScheme)
  if (result) {
    ctx.body = SuccessResult()
  } else {
    ctx.body = ErrorResult(ResultEnum.CHANGE_ADMIN_ERROR)
  }
})

module.exports = router
