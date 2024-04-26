import chalk from 'chalk'
import chokidar from 'chokidar'
import fs from 'fs'
// import path from 'path'
import child_process from 'child_process'

import dotenv from 'dotenv'
dotenv.config()

const CHANGE_Module_TEMP = new Set()

// todo: 3s不同模块处理
// npm start 启动

const throtter = (fn, wait = 3000) => {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    console.error('3s不同模块处理', args[1])
    const curPath = args[1]
    CHANGE_Module_TEMP.add(curPath)
    if (timer) {
      clearTimeout(timer)
      timer = null
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, wait)
    }
  }
}

const validatePopupDir = path => {
  const reg = /^(popup|content|background)(\/[a-zA-z_]{1,})+.(ts|js|jsx|tsx|less)$/
  const match = path.match(reg)
  if (match) {
    return match[1]
  }
  return false
}

const BUILD_SCRIPTS = {
  popup: 'build-popup',
  content: 'build-content',
  background: 'build-background',
}

// const tempContentDir = path.resolve(process.cwd(), process.env.TEMP_CONTENT_DIR)
// const tempBackgroundDir = path.resolve(process.cwd(), process.env.TEMP_BACKGROUND_DIR)
const excludeDir = ['api/', 'assests/', 'auto-imports.d.ts', 'extentionUtils/', 'router/', 'validate.ts', 'main.jsx']

// 判断dist文件是否生成
// const hasBuild = () => {
//   if (fs.existsSync(tempContentDir) || fs.existsSync(tempBackgroundDir)) {
//     console.error('有dist文件是否生成', fs.existsSync(tempContentDir), fs.existsSync(tempBackgroundDir))
//     return false
//   }
//   return true
// }

// chokidar不能限制多个文件夹,这里自己过滤src下面的不需要更新的文件
const ignoredFile = path => {
  const hasExcludeDirStart = excludeDir.find(i => {
    return path.indexOf(i) === 0
  })
  return hasExcludeDirStart
}

fs.writeFile('test.txt', 'Hello Node.js', err => {
  if (err) throw err
  console.log('The file has been saved!')
})

chokidar
  .watch('.', {
    ignored: /node_modules|\.git|\.vscode|dist/,
    cwd: 'src',
    ignoreInitial: true, // 忽略初始化文件时的监听判断
  })
  .on(
    'all',
    throtter((event, path) => {
      if (ignoredFile(path)) {
        console.log('是需要忽略的文件包', chalk.green(path))
        return
      }
      const dirPath = validatePopupDir(path)
      if (Object.keys(BUILD_SCRIPTS).includes(dirPath)) {
        CHANGE_Module_TEMP.add(dirPath)
        console.log(chalk.blue(`单独打包${dirPath}模块开始---------`))
        child_process.exec(BUILD_SCRIPTS[dirPath], (error, stdout, stderr) => {
          console.log(chalk.blue(`${dirPath}单独打包成功------------`))
          CHANGE_Module_TEMP.delete(dirPath)
        })
      } else {
        console.log(chalk.blue(`打包全部模块开始---------`))
        child_process.exec('npm run build', (error, stdout, stderr) => {
          console.log(chalk.blue('全部打包成功------------'))
        })
      }
    })
  )
