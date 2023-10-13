// build 的时候用来去除 mock 数据，换成 chrome.tabs.xxx这种数据
const fs = require("fs")
const readline = require("readline")
const chalk = require("chalk")
const path = require("path")

const pathDir = path.join(__dirname, "../../")
const excludeFiles = [] // 排除的文件
const excludeDirs = ["src/assets", "src/api", "src/router", "src/static"] // 排除的文件夹

// 处理分支信息
const execSync = require("child_process").execSync
const curBranch = execSync("git rev-parse --abbrev-ref HEAD").toString() // 获取当前分支名称

// 对比当前分支和master分支修改的所有文件
const modifyFileList = execSync(
  `git diff --name-status origin/master ${curBranch} `
)
  .toString()
  .split("\n")
const modifyFiles = getDealFiles(modifyFileList)

// 获取本地没有提交的文件
// 'git status -s' 没有办法获取本地没有commit的新增文件
const notCommitFile = execSync("git status -s").toString().split("\n")
const commitFiles = getDealFiles(notCommitFile)

// 文件判断处理
const updateFiles = [...modifyFiles, ...commitFiles]
const needOpenLine = []
updateFiles.forEach((r) => {
  fs.stat(r, (err) => {
    if (err) return
    const rl = readline.createInterface({
      input: fs.createReadStream(r)
    })
    let lineSort = 0
    rl.on("line", (line) => {
      lineSort += 1
      console.error("line----", lineSort, needOpenLine)
      if (lineSort === needOpenLine[needOpenLine.length - 1] + 1) {
        const lineReg = /^(\/\/)(.*)/
        if (line.replace(/^\s*/g, "").match(lineReg)) {
          console.error("符合----")
          console.error(line)
          needOpenLine.push(lineSort)
        }
      }
      if (line.includes("TODO mock")) {
        const reg = /\b(TODO mock)\b(.*)/
        const result = line.match(reg)
        if (result) {
          //   console.error("result----")
          //   console.error(line)
          needOpenLine.push(lineSort)
        }
        // if (result) {
        //   const name = result[1]
        //   const descRaw = result[3] || ""
        //   const type = todoTypes[name]
        //   console.log(
        //     type,
        //     chalk.blue.underline(r),
        //     descRaw.replace("-->", "").trim()
        //   )
        //   if (name === "TODO:H") process.exit(1)
        // }
      }
    })
    console.error("needOpenLine", needOpenLine)
  })
})

// 获取需要处理的文件列表
function getDealFiles(fileList) {
  const list = []
  fileList.forEach((file) => {
    if (file) {
      const reg = /(\S+)\s+(\S+)/
      const result = file.match(reg)
      if (!result || isNotDealFile(result[2], result[1])) return // 判断不需要处理的文件
      const f = path.join(pathDir, result[2])
      list.push(f)
    }
  })
  return list
}

// 判断不需要处理的文件
function isNotDealFile(fileName, type) {
  const isSrc = fileName.indexOf("src/") !== 0
  const isExcludeFile = excludeFiles.includes(fileName)
  const isExcludeDir = excludeDirs.some((d) => fileName.includes(d))
  const isDelete = type === "D" // 删除的文件
  const isAllowExtension = /\.(js|jsx)$/.test(fileName)
  return isSrc || isExcludeFile || isExcludeDir || isDelete || !isAllowExtension
}
