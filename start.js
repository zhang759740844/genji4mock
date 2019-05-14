const shell = require('shelljs')
const fs = require('fs-extra')
const path = require('path')

function joinPath (pathString) {
  return path.join(__dirname, pathString)
}

async function readConfig () {
  const buffer = await fs.readFile('./config.json')
  return JSON.parse(buffer.toString())
}

async function writeHost (hostJSString) {
  await fs.writeFile(joinPath('./react_part/src/host.js'), hostJSString)
}

async function main () {
  const config = await readConfig()
  const host = config.host
  const hostJSString = `export default { host: '${host}' }`
  await writeHost(hostJSString)
  shell.cd(joinPath('./react_part'))
  // shell.exec('npm install')
  // shell.exec('npm run build')
  shell.cp('-r', joinPath('./react_part/build'), joinPath('./koa_part'))
}

main()

// shell.cd('./react_part/src')
