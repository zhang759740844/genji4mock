const { con } = require('./base')
con.connect()

const userQuery = require('./user')
const mockQuery = require('./mock')

module.exports = {
  ...userQuery,
  ...mockQuery
}
