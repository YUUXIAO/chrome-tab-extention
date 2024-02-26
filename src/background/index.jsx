// import TabUtils from '@/extentionUtils/tabUtils.js'
import storageUtils from '@/extentionUtils/storage.js'
import messgaeUtils from './message.js'

// // 获取当前窗口所有数据
// const getAllWindows = async () => {
//   const ajaxArray = [TabUtils.getAllWindow(), TabUtils.getTabLists(), TabUtils.getCurrentWindowId()]
//   const [windows, allTabs, curWindowId] = await Promise.all(ajaxArray)

//   console.error('background-谷歌api获取窗口信息', JSON.stringify(windows))
//   console.error('background-谷歌api获取tab信息', JSON.stringify(allTabs))

//   // const windowMap = {}
//   // const windowTabs = []
//   // let currentTabs = []
//   // windows.forEach((win, winIdx) => {
//   //   const parentId = win.id
//   //   currentTabs = allTabs.filter(i => i.windowId === parentId)
//   //   // TODO 无痕模式
//   //   const windowInfo = {
//   //     // isCurrent: win.focused,
//   //     name: `窗口-${winIdx}`,
//   //     windowId: parentId,
//   //     tabs: currentTabs,
//   //   }
//   //   //   console.error("窗口", win)

//   //   // TODO 删除map
//   //   windowMap[parentId] = windowInfo
//   //   windowTabs.push(windowInfo)
//   // })

//   // const windowSortList = convertTabsData(currentTabs) // 以域名排序的sort
//   // this.setState({
//   //   windowTabs: windowTabs,
//   //   activeTab: curWindowId,
//   //   currentWindowTab: windowSortList
//   // })

//   // console.error('windowTabs', windowTabs)
//   // console.error('windowSortList', windowSortList)
// }

// console.error('background页面代码注入---------------')

// function backFun() {
//   console.log('arguments：', arguments)
//   const allViews = chrome.extension.getViews()
//   console.log('chrome.extension.getViews()：', allViews)
// }

// backFun()

function addlater(info, tab) {
  console.error('添加到稍后再看', info, tab)
}
// 安装了此拓展程序的配置文件首次启动时触发，初始化扩展,一般使用此事件设置状态或一次性初始化
chrome.runtime.onInstalled.addListener(function () {
  console.error('安装了此拓展程序的配置文件首次启动时触发，初始化扩展')
  chrome.contextMenus.create({
    id: 'tabs_extention_save',
    title: '当前网址加入收藏',
    type: 'normal',
    contexts: ['all'],
  })

  chrome.contextMenus.create({
    id: 'tabs_extention_later',
    title: '添加到稍后再看',
    type: 'normal',
    contexts: ['selection'],
  })
  chrome.contextMenus.onClicked.addListener((menuInfo, tabInfo) => {
    console.error('右键点击事件', JSON.stringify(menuInfo), JSON.stringify(tabInfo))
    messgaeUtils.sendMessageToContentScript('hello,我是messga', res => {
      console.error('收到消息回复', res)
    })
  })
})

// 浏览器打开事件
chrome.runtime.onStartup.addListener(function () {
  console.error('浏览器打开事件---初始化插件')
})

// 每个tab更新事件
// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   if (changeInfo.status === 'complete' && tab.active) {
//     console.error('每个tab更新事件')

//     // TabUtils.getAllWindow().then(res => {
//     //   console.error('11', res)
//     // })
//     // chrome.history.search({ text: '' }, val => {
//     //   console.error('获取搜索历史记录', val)
//     // })
//   }
// })

// 关闭浏览器
chrome.runtime.onSuspend.addListener(function () {
  storageUtils.removeStorageItem('windowName')
})
