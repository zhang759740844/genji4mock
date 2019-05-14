/**
 * 获取 mock 接口的用户以及真实路径
 *
 * @param {*} path 请求的路径
 * @returns 真实请求 {
 *  username: 请求的发起者
 *  realPath: 请求的真实路径
 * }
 */
function getRealPath (path) {
  let re = new RegExp('^/[^/]+')
  let arr = re.exec(path)
  return ({ username: arr[0].replace('/', ''), suffix: path.replace(arr[0], '') })
}

/**
 * 获取 host
 *
 * @param {*} domain 域名
 * @returns host
 */
function getHost (domain) {
  let re = new RegExp('^https?://')
  let arr = re.exec(domain)
  return domain.replace(arr[0], '')
}

module.exports = {
  getRealPath,
  getHost
}
