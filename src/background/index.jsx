import TabUtils from '@/extentionUtils/tabUtils.js'

// 获取当前窗口所有数据
const getAllWindows = async () => {
  const ajaxArray = [TabUtils.getAllWindow(), TabUtils.getTabLists(), TabUtils.getCurrentWindowId()]
  const [windows, allTabs, curWindowId] = await Promise.all(ajaxArray)

  console.error('background-谷歌api获取窗口信息', JSON.stringify(windows))
  console.error('background-谷歌api获取tab信息', JSON.stringify(allTabs))

  // const windowMap = {}
  // const windowTabs = []
  // let currentTabs = []
  // windows.forEach((win, winIdx) => {
  //   const parentId = win.id
  //   currentTabs = allTabs.filter(i => i.windowId === parentId)
  //   // TODO 无痕模式
  //   const windowInfo = {
  //     // isCurrent: win.focused,
  //     name: `窗口-${winIdx}`,
  //     windowId: parentId,
  //     tabs: currentTabs,
  //   }
  //   //   console.error("窗口", win)

  //   // TODO 删除map
  //   windowMap[parentId] = windowInfo
  //   windowTabs.push(windowInfo)
  // })

  // const windowSortList = convertTabsData(currentTabs) // 以域名排序的sort
  // this.setState({
  //   windowTabs: windowTabs,
  //   activeTab: curWindowId,
  //   currentWindowTab: windowSortList
  // })

  // console.error('windowTabs', windowTabs)
  // console.error('windowSortList', windowSortList)
}

console.error('background页面代码注入---------------')

function backFun() {
  console.log('arguments：', arguments)
  const allViews = chrome.extension.getViews()
  console.log('chrome.extension.getViews()：', allViews)
}

backFun()

// 浏览器打开事件
chrome.runtime.onStartup.addListener(function () {
  console.error('浏览器打开事件---初始化插件')
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    console.error('插件被启动后，就进入了运行阶段')
    console.error(tabId, changeInfo, tab)

    chrome.history.search({ text: '' }, val => {
      console.error('获取搜索历史记录', val)
    })
  }
})

// 关闭浏览器
chrome.runtime.onSuspend.addListener(function () {
  console.log('Browser is about to close, save plugin data.')
})
