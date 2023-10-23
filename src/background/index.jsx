import ChromeUtils from "@/apiUtils.js"

// 获取当前窗口所有数据
const getAllWindows = async () => {
  // TODO mock
  const ajaxArray = [
    ChromeUtils.getAllWindow(),
    ChromeUtils.getTabLists(),
    ChromeUtils.getCurrentWindowId()
  ]
  const [windows, allTabs, curWindowId] = await Promise.all(ajaxArray)

  // const windows = mockWindowsData
  // const allTabs = mockTabsData
  // const curWindowId = ""
  console.error("background-谷歌api获取窗口信息", JSON.stringify(windows))
  console.error("background-谷歌api获取tab信息", JSON.stringify(allTabs))

  // const windowMap = {}
  // const windowTabs = []
  // let currentTabs = []
  // windows.forEach((win, winIdx) => {
  //   const parentId = win.id
  //   currentTabs = allTabs.filter((i) => i.windowId === parentId)
  //   // TODO 无痕模式
  //   const windowInfo = {
  //     // isCurrent: win.focused,
  //     name: `窗口-${winIdx}`,
  //     windowId: parentId,
  //     tabs: currentTabs
  //   }
  //   //   console.error("窗口", win)

  //   // TODO 删除map
  //   windowMap[parentId] = windowInfo
  //   windowTabs.push(windowInfo)
  // })

  // // const windowSortList = convertTabsData(currentTabs) // 以域名排序的sort
  // // this.setState({
  // //   windowTabs: windowTabs,
  // //   activeTab: curWindowId,
  // //   currentWindowTab: windowSortList
  // // })

  // console.error("windowTabs", windowTabs)
  // console.error("windowSortList", windowSortList)
}

function backFun() {
  console.log("arguments：", arguments)
  const allViews = chrome.extension.getViews()
  console.log("chrome.extension.getViews()：", allViews)
}

backFun()
