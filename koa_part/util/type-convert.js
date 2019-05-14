/**
 * Bool 类型转换为 TinyInt 类型
 *
 * @param {Boolean | String | Number} state Bool 类型
 * @returns
 */
function boolToTinyInt (state) {
  let result = null
  if (typeof state === 'string') {
    result = (state === 'false' || state === 'False' || state === 'FALSE') ? 0 : 1
  } else if (typeof state === 'boolean') {
    result = state ? 1 : 0
  } else if (typeof state === 'number') {
    result = state !== 0 ? 1 : 0
  }
  return result
}

/**
 * TinyInt 转为 Bool
 *
 * @param {*} state TinyInt 值
 * @returns Bool 类型值
 */
function tinyIntToBool (state) {
  return state !== 0
}

module.exports = {
  boolToTinyInt,
  tinyIntToBool
}
