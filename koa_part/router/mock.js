const { ResultEnum, SuccessResult, ErrorResult } = require('./modal')
const db = require('../db')
const Router = require('koa-router')
const router = new Router()

// 获取 mock 列表
router.get('/mock-list', async (ctx) => {
  const mockList = await db.mockList(ctx.cookies.get('userInfo'))
  ctx.body = SuccessResult(mockList)
})

// 新增或更新mock
router.post('/update-mock', async (ctx) => {
  const interfaceName = ctx.request.body.interfaceName
  const data = ctx.request.body.data
  if (!interfaceName || !data) {
    ctx.body = ErrorResult(ResultEnum.NEED_INTERFACENAME_OR_DATA)
    return
  }

  try {
    const resultId = await db.getMockDataId(interfaceName, ctx.cookies.get('userInfo'))
    if (resultId) {
      await db.updateMockData(data, resultId)
    } else {
      await db.addMockData(interfaceName, data, ctx.cookies.get('userInfo'))
    }
    ctx.body = SuccessResult()
  } catch (error) {
    ctx.body = ErrorResult(ResultEnum.COMMON_ERROR, error.message)
  }
})

// 删除 mock 接口
router.post('/delete-mock', async (ctx) => {
  const interfaceId = ctx.request.body.id
  try {
    await db.deleteMockData(interfaceId)
    ctx.body = SuccessResult()
  } catch (error) {
    ctx.body = ErrorResult(ResultEnum.COMMON_ERROR, error.message)
  }
})

// 开关 switch
router.get('/switch-mock', async (ctx) => {
  const interfaceId = ctx.request.query.id
  const state = ctx.request.query.state
  await db.switchMock(interfaceId, state)
  ctx.body = SuccessResult()
})

// 返回 mock 的数据
router.get('/mock-info', async (ctx) => {
  const interfaceId = ctx.request.query.id
  const mockInfo = await db.getMockInfo(interfaceId)
  ctx.body = SuccessResult(mockInfo)
})

// 开关 yapi
router.get('/switch-yapi', async (ctx) => {
  if (!ctx.request.query.state) {
    ctx.body = ErrorResult(ResultEnum.NEED_BOOL_STATE)
    return
  }
  const interfaceId = ctx.request.query.id
  const state = ctx.request.query.state
  await db.switchyapi(interfaceId, state)
  ctx.body = SuccessResult()
})

router.get('/close-all', async (ctx) => {
  const username = ctx.cookies.get('userInfo')
  try {
    await db.closeAllMock(username)
    ctx.body = SuccessResult()
  } catch (error) {
    ctx.body = ErrorResult(-1, error.message)
  }
})

router.get('/delete-all', async (ctx) => {
  const username = ctx.cookies.get('userInfo')
  try {
    await db.deleteAllMockData(username)
    ctx.body = SuccessResult()
  } catch (error) {
    ctx.body = ErrorResult(-1, error.message)
  }
})

module.exports = router
