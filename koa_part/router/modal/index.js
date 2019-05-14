const UserError = require('./UserError')
const MockError = require('./MockError')

const ResultEnum = {
  ...UserError,
  ...MockError,
  COMMON_ERROR: { code: -1 }
}

function ErrorResult (code = ResultEnum.COMMON_ERROR, message = '') {
  return ({ code: code.code, message: (message || code.message) })
}

function SuccessResult (data = {}) {
  return ({ code: 200, data })
}

module.exports = {
  ResultEnum,
  ErrorResult,
  SuccessResult
}
