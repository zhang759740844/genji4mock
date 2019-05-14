const UserError = {
  // 需要登录
  NEED_LOGIN: {
    code: -100,
    message: '请先登录'
  },
  // 存在该用户
  EXIST_ADMIN: {
    code: -101,
    message: '已存在该用户'
  },
  // 不存在该用户
  NOT_EXIST_ADMIN: {
    code: -102,
    message: '该用户不存在'
  },
  // 账号或密码不对
  NEED_USERNAME_OR_PASSWORD: {
    code: -103,
    message: '账号或密码错误'
  },
  // 更改域名失败
  CHANGE_ADMIN_ERROR: {
    code: -104,
    message: '改变域名失败'
  }
}

module.exports = UserError
