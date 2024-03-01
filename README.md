# Getting Started with Create React App

基于 react、reactRouterV6、Vite、antDesign 实现的一个谷歌插件前端项目

后端基于 nodeJs+ mongodb 实现，具体可查看 https://github.com/YUUXIAO/tab-extentions-backend

## DONE && TODO LIST

### DONE LIST

- [x] 一键删除tab或窗口
- [x] 合并所有窗口 && 一键tab去重
- [x] 一键批量打开网站组
- [x] 邮箱登录📮
- [x] 网站右键菜单“添加稍后再看”
- [x] 网站选中关键词右键菜单“添加记事本”
- [x] 点击网站收藏可同步操作chrome书签
- [x] build 通过脚本处理解开chrome相关api，注释mock数据，通过判断浏览器环境区分api

### TODO LIST

- [ ] feature：网页时长统计
- [ ] feature：绑定谷歌账号 || outh2登录（chrome.identity）
- [ ] feature：快捷恢复（注入页面icon）【技术调研中💭】
- [ ] feature：当前窗口新建空白 tab,显示所有该窗口的 tablist【考虑中💭】

## Available Scripts

### `npm start`

启动项目,在浏览器访问 [http://127.0.0.1:5173/](http://localhost:3000)

### `npm run build`

打包项目所有文件到 `dist` 文件夹下，包括 popup、background、contentScript

### `npm run build-popup`

单独打包 popup, 如果你只改动了 popup 的功能，可以只运行这个命令

### `npm run build-content`

单独打包 contentScript, 如果你只改动了 contentScript 的功能，可以只运行这个命令

### `npm run build-background`

单独打包 background, 如果你只改动了 background 的功能，可以只运行这个命令

\*\*Note: 修改了生命周期等功能，需要到 chrome:://extentions 里手动重新加载插件，不然可能代码未生效

## Learn More

- [Chrome 拓展开发文档V3](https://developer.chrome.com/docs/extensions/reference/api?hl=zh-cn)

- [React 官网](https://reactjs.org/)
- [Vite 官网](https://cn.vitejs.dev/config/)
