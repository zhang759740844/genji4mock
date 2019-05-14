const shell = require('shelljs')
const fs = require('fs-extra')
const path = require('./path')
const chalk = require('chalk')

function getHost () {
  const net = require('os').networkInterfaces()
  let address = ''
  for (const key in net) {
    const netItemArr = net[key].filter(alias => (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal))
    if (netItemArr.length !== 0) {
      address = netItemArr[0].address
    }
  }
  return address
}

async function writeHost (hostJSString) {
  await fs.writeFile(path.joinReactSrcPath('./host.js'), hostJSString)
}

function prepareReact () {
  shell.cd(path.reactPath)
  console.log('react 依赖安装中')
  shell.exec('npm install')
  console.log(chalk.blue('react 依赖安装成功'))
  console.log('react 打包中')
  shell.exec('npm run build')
  shell.rm('-rf', path.joinKoaPath('./dist'))
  shell.cp('-r', path.joinReactPath('./build'), path.koaPath)
  shell.mv('-f', path.joinKoaPath('./build'), path.joinKoaPath('./dist'))
  console.log(chalk.blue('react 打包成功'))
}

function prepareKoa () {
  console.log('koa 依赖安装中')
  shell.cd(path.koaPath)
  shell.exec('npm install')
  console.log(chalk.blue('koa 依赖安装成功'))
  console.log('koa 服务启动中')
  shell.exec('npm run pro')
  console.log(chalk.blue('koa 服务启动成功'))
}

async function main () {
  const host = 'http://' + getHost() + ':3010'
  const hostJSString = `export default { host: '${host}' }`
  await writeHost(hostJSString)
  console.log(chalk.blue('写入 Host 成功'))
  prepareReact()
  prepareKoa()
}

main()
