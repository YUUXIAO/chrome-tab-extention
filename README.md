> TabManager 插件v1目前正在chrome webstore 审核中啦～～🎈

# TabManager谷歌插件

基于 react、reactRouterV6、Vite、antDesign 实现的一个谷歌插件前端项目

后端基于 node、mongodb 实现，具体可查看 https://github.com/YUUXIAO/tab-extentions-backend

谷歌插件开发相关内容了解可查看：https://github.com/YUUXIAO/NOTE/blob/master/Markdown/%E6%B5%8F%E8%A7%88%E5%99%A8/chrome%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91.md

本前端项目相关技术具体实现可查看：https://github.com/YUUXIAO/NOTE/blob/master/Markdown/%E6%B5%8F%E8%A7%88%E5%99%A8/Chrome%E6%8F%92%E4%BB%B6%E6%8A%80%E6%9C%AF%E5%AE%9E%E7%8E%B0%E6%96%B9%E6%A1%88.md

## FEATURE && TODO

### FEATURE

- [x] 一键删除一个或一组tab选项卡或窗口
- [x] 合并所有窗口选项卡 && 一键tab去重
- [x] 批量自定义网页组并支持一键网站组
- [x] 邮箱登录📮，并同步本地数据
- [x] 网站右键菜单“添加稍后再看”,支持修改完成状态
- [x] 网站选中关键词右键菜单“添加记事本”，支持修改完成状态
- [x] 点击网站收藏可同步操作chrome书签

### TODO

- [ ] perf：网页组编辑网址（目前仅支持新建网页组和一键窗口打开组的网页）
- [ ] perf：增加tab网页加载状态判断或刷新功能
- [ ] feature：网页时长统计
- [ ] feature：绑定谷歌账号 || outh2登录（chrome.identity）
- [ ] feature：选项卡组（tab Group）,考虑和现有网页组打通数据
- [ ] feature：网页注入悬浮球（待办、提示、网页组快捷操作）
- [ ] feature：插件设置页，支持用户自定义悬浮球、待办提示、收藏同步书签等功能
- [ ] feature：【技术调研中💭】快捷恢复（注入页面icon）
- [ ] feature：【考虑中💭】当前窗口新建选项卡,显示所有该窗口的 tablist

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
