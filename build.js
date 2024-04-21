import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

// 复制临时目录的文件到目标文件夹
const copyTemp2Build = (tempDir, tarDir) => {
  if (!fs.existsSync(tarDir)) {
    fs.mkdir(tarDir) // 如果不存在目标目录就创建目录
  }

  fs.readdirSync(tempDir).forEach(file => {
    const tempPath = path.join(tempDir, file)
    const tarPath = path.join(tarDir, file)

    if (fs.lstatSync(tempPath).isDirectory()) {
      copyTemp2Build(tempPath, tarPath)
    } else {
      fs.copyFileSync(tempPath, tarPath)
    }
  })
}

// 删除临时目录
const deleteTempDir = tempDir => {
  if (fs.existsSync(tempDir)) {
    fs.readdirSync(tempDir).forEach(file => {
      const tempPath = path.join(tempDir, file)
      if (fs.lstatSync(tempPath).isDirectory()) {
        deleteTempDir(tempPath)
      } else {
        fs.unlinkSync(tempPath)
      }
    })
    fs.rmdirSync(tempDir)
  }
}

// content-script 临时打包目录
const tempContentDir = path.resolve(process.cwd(), process.env.TEMP_CONTENT_DIR)
const tempBackgroundDir = path.resolve(process.cwd(), process.env.TEMP_BACKGROUND_DIR)
const targetBuildDir = path.resolve(process.cwd(), process.env.TARGET_BUILD_DIR)
// 复制 content-script 和 background-script 的build 文件到最终build 目录中
copyTemp2Build(tempContentDir, targetBuildDir)
copyTemp2Build(tempBackgroundDir, targetBuildDir)
// 删除临时目录
deleteTempDir(tempContentDir)
deleteTempDir(tempBackgroundDir)
