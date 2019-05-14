const path = require('path')

function joinPath (pathString) {
  return path.join(__dirname, pathString)
}

function joinKoaPath (pathString) {
  return path.join(joinPath('./koa_part'), pathString)
}

function joinReactPath (pathString) {
  return path.join(joinPath('./react_part'), pathString)
}

function joinReactSrcPath (pathString) {
  return path.join(joinPath('./react_part/src'), pathString)
}

const koaPath = joinPath('./koa_part')
const reactPath = joinPath('./react_part')
const reactSrcPath = joinPath('./react_part/src')

module.exports = {
  joinPath,
  joinKoaPath,
  joinReactPath,
  joinReactSrcPath,
  koaPath,
  reactPath,
  reactSrcPath
}
