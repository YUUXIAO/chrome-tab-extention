import storageUtils from '@/extentionUtils/storage.js'
import { fetchPost } from './fetch.js'

// 添加记事本/稍后再看
const postMenusMaps = async (type, menuInfo, tabInfo, token) => {
  const { pageUrl, selectionText } = menuInfo
  const menuIds = {
    tabs_extention_keys: {
      api: '/todoKeys',
      storageKey: 'todoKeys',
    },
    tabs_extention_later: {
      api: '/later',
      storageKey: 'laterData',
    },
  }
  const payload = {
    pageUrl,
    status: 0,
    createTime: Date.now(),
    pageTitle: tabInfo.title,
    favIconUrl: tabInfo.favIconUrl,
  }
  if (type === 'tabs_extention_keys') {
    payload.selection = selectionText
  }
  if (token) {
    fetchPost(menuIds[type].api, token, payload)
  } else {
    // 未登录，存本地
    const StorageArray = storageUtils.StorageArray
    const key = menuIds[type].storageKey
    payload.createTime = Date.now()
    await StorageArray.setItem(key, payload)
  }
}

// 安装了此拓展程序的配置文件首次启动时触发，初始化扩展,一般使用此事件设置状态或一次性初始化
chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: 'tabs_extention_keys',
    title: '添加到记事本',
    type: 'normal',
    contexts: ['selection'],
  })

  chrome.contextMenus.create({
    id: 'tabs_extention_later',
    title: '添加到稍后再看',
    type: 'normal',
    contexts: ['all'],
  })
  chrome.contextMenus.onClicked.addListener(async (menuInfo, tabInfo) => {
    const token = await storageUtils.getStorageItem('token')
    const { menuItemId } = menuInfo
    switch (menuItemId) {
      case 'tabs_extention_keys': // 关键词
      case 'tabs_extention_later': // 稍后再看
        postMenusMaps(menuItemId, menuInfo, tabInfo, token)

        break
      default:
        break
    }
  })
})

// 浏览器打开事件
chrome.runtime.onStartup.addListener(function () {
  console.log('浏览器打开事件---初始化插件')
})

// chrome.tabs.onCreated.addListener(function (tab) {
//   console.log(tab)
// })

// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   console.log('Tab2222 ' + tabId + ' has been changed with these options:')
//   console.log(changeInfo)
// })

// chrome.tabs.onMoved.addListener(function (tabId, moveInfo) {
//   console.log('Tab ' + tabId + ' has been moved:')
//   console.log(moveInfo)
// })

// chrome.tabs.onActivated.addListener(function (activeInfo) {
//   console.log('Tab ' + activeInfo.tabId + ' in window ' + activeInfo.windowId + ' is active now.')
// })

// chrome.tabs.onHighlighted.addListener(function (highlightInfo) {
//   console.log('Tab ' + 1 + ' in window ' + 1 + ' is highlighted now.')
// })

// chrome.tabs.onDetached.addListener(function (tabId, detachInfo) {
//   console.log('Tab ' + tabId + ' in window ' + detachInfo.oldWindowId + ' at position ' + detachInfo.oldPosition + ' has been detached.')
// })

// chrome.tabs.onAttached.addListener(function (tabId, attachInfo) {
//   console.log('Tab ' + tabId + ' has been attached to window ' + 2 + ' at position ' + 2 + ' .')
// })

// chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
//   console.log('Tab ' + tabId + ' in window ' + removeInfo.windowId + ', and the window is ' + (removeInfo.isWindowClosing ? 'closed.' : 'open.'))
// })

// chrome.tabs.onReplaced.addListener(function (addedTabId, removedTabId) {
//   console.log('Tab ' + removedTabId + ' has been replaced by tab ' + addedTabId + '.')
// })

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
