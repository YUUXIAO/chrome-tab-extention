// import TabUtils from '@/extentionUtils/tabUtils.js'
import storageUtils from '@/extentionUtils/storage.js'
// import messgaeUtils from './message.js'
import { fetchPost, fetchGet } from './fetch.js'

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

const a = {
  editable: false,
  frameId: 0,
  frameUrl: 'https://ant-design.antgroup.com/components/list-cn',
  menuItemId: 'tabs_extention_later',
  pageUrl: 'https://ant-design.antgroup.com/components/list-cn',
  selectionText: 'background',
}
const b = {
  active: true,
  audible: false,
  autoDiscardable: true,
  discarded: false,
  favIconUrl: 'https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png',
  groupId: -1,
  height: 747,
  highlighted: true,
  id: 954676296,
  incognito: false,
  index: 4,
  lastAccessed: 1709046192454.432,
  mutedInfo: { muted: false },
  pinned: false,
  selected: true,
  status: 'complete',
  title: '列表 List - Ant Design',
  url: 'https://ant-design.antgroup.com/components/list-cn',
  width: 1075,
  windowId: 954676142,
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
  chrome.contextMenus.onClicked.addListener(async (menuInfo, tabInfo) => {
    console.error('右键点击事件', JSON.stringify(menuInfo), JSON.stringify(tabInfo))
    const token = await storageUtils.getStorageItem('token')
    const { menuItemId, pageUrl, selectionText } = menuInfo
    switch (menuItemId) {
      // TODO 可以把收藏和稍后封装一起
      case 'tabs_extention_save': // 收藏网址
        if (token) {
          const url = `/favor?url=${pageUrl}`
          fetchGet(url).then(res => {
            console.error('添加收藏传参', res)
          })
        } else {
          // 未登录，存本地
          const collectData = (await storageUtils.getStorageItem('collectData')) || []
          collectData.push(collectData)
          storageUtils.setStorageItem('collectData', collectData)
        }
        break
      case 'tabs_extention_later': // 稍后再看
        const payload = {
          pageUrl,
          pageTitle: tabInfo.title,
          favIconUrl: tabInfo.favIconUrl,
          selection: selectionText,
        }
        if (token) {
          fetchPost('/later', token, payload).then(res => {
            console.error('添加稍后再看成功', res)
          })
        } else {
          // 未登录，存本地
          const laterData = (await storageUtils.getStorageItem('laterData')) || []
          payload.createTime = Date.now()
          laterData.push(payload)
          storageUtils.setStorageItem('laterData', laterData)
        }

        break
      default:
        break
    }
    // messgaeUtils.sendMessageToContentScript('hello,我是messga', res => {
    //   console.error('收到消息回复', res)
    // })
  })
})

// 浏览器打开事件
chrome.runtime.onStartup.addListener(function () {
  console.error('浏览器打开事件---初始化插件')
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
