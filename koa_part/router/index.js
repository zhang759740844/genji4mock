const Router = require('koa-router')
const router = new Router()
const userRouter = require('./user')
const mockRouter = require('./mock')

router.use('/user', userRouter.routes())
router.use('/mock', mockRouter.routes())

module.exports = router
