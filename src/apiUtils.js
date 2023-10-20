/* eslint-disable no-undef */

/**
 * 获取tabs列表
 */
export const getTabLists = (queryInfo = {}) => {
  return new Promise((resolve) => {
    chrome.tabs.query(queryInfo, (tabs) => resolve(tabs))
  })
}

// 创建新tab
export const createNewTab = (queryInfo = {}) => {
  console.error("创建新tab", queryInfo)
  chrome.tabs.create(queryInfo, (tab) => {
    console.error("创建新tab成功")
  })
}

// 创建新窗口
export const createNewWindow = () => {
  chrome.windows.create({}, (window) => {
    console.error("创建新窗口成功", window)
  })
}
/**
 * 获取当前tab
 */
export const getCurrentTab = () => {
  return new Promise((resolve) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      (tabs) => resolve(tabs[0])
    )
  })
}

/**
 * 切换tab
 * @param {number} tab
 * @param {number} windowId 当前窗口ID
 */
export const toggleTab = (tab, windowId) => {
  chrome.windows.update(windowId, { focused: true })
  chrome.tabs.highlight({ tabs: tab.index })
}

/**
 * 删除tab
 * @param {string}} type
 */
export const deleteTab = (ids) => {
  return new Promise((resolve) => {
    chrome.tabs.remove(ids)
    resolve(true)
  })
}

// window

/**
 * 获取当前窗口ID
 */
export const getCurrentWindowId = () => {
  return new Promise((resolve) => {
    return chrome.windows.getCurrent(({ id }) => {
      if (!id) return
      resolve(id)
    })
  })
}

/**
 * 获取所有窗口
 */
export const getAllWindow = () => {
  return new Promise((resolve) => {
    chrome.windows.getAll({}, (windows) => resolve(windows))
  })
}

// 删除一个窗口
export const deleteWindow = (windowId) => {
  return new Promise((resolve) => {
    chrome.windows.remove(windowId)
  })
}

const ChromeUtils = {
  getAllWindow,
  getCurrentWindowId,
  deleteTab,
  createNewTab,
  deleteWindow,
  toggleTab,
  getCurrentTab,
  getTabLists
}

export default ChromeUtils
