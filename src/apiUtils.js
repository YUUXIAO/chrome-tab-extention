/* eslint-disable no-undef */

/**
 * 获取tabs列表
 */
export const getTabLists = () => {
  return new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => resolve(tabs))
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
 * @param {number} index
 * @param {number} windowId 当前窗口ID
 */
export const toggleTab = ({ index, windowId }) => {
  chrome.windows.update(windowId, { focused: true })
  chrome.tabs.highlight({ tabs: index, windowId: windowId })
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

const ChromeUtils = {
  getAllWindow,
  getCurrentWindowId,
  deleteTab,
  toggleTab,
  getCurrentTab,
  getTabLists
}

export default ChromeUtils
