/* eslint-disable no-undef */

import { mockWindowsData, mockTabsData } from '@/api/popup.js'
import { isExtentionEnv } from '@/utils.js'

/**
 * 获取tabs列表
 */
export const getTabLists = (queryInfo = {}) => {
  return new Promise(resolve => {
    if (isExtentionEnv()) {
      chrome.tabs.query(queryInfo, tabs => resolve(tabs))
    } else {
      resolve(mockTabsData)
    }
  })
}

// 创建新tab
export const createNewTab = (queryInfo = {}) => {
  console.error('创建新tab', queryInfo)
  chrome.tabs.create(queryInfo, tab => {
    calert('创建新tab成功', JSON.stringify(tab))
  })
}

// 创建新窗口
export const createNewWindow = (params = {}, callback) => {
  chrome.windows.create(params, window => {
    console.error('创建新窗口', window)
    callback && callback(window)
  })
}

// 切换窗口
export const toggleWindow = windowId => {
  chrome.windows.update(windowId, { focused: true })
}

/**
 * 获取当前tab
 */
export const getCurrentTab = () => {
  return new Promise(resolve => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      tabs => resolve(tabs[0])
    )
  })
}

/**
 * 切换tab
 * @param {number} tab
 * @param {number} windowId 当前窗口ID
 */
export const toggleTab = (tab, windowId) => {
  toggleWindow(windowId)
  chrome.tabs.highlight({ tabs: tab.index })
}

/**
 * 删除tab
 * @param {string}} type
 */
export const deleteTab = ids => {
  return new Promise(resolve => {
    if (isExtentionEnv()) {
      chrome.tabs.remove(ids, () => {
        resolve(true)
      })
    } else {
      resolve(true)
    }
  })
}

// window

/**
 * 获取当前窗口ID
 */
export const getCurrentWindowId = () => {
  return new Promise(resolve => {
    if (isExtentionEnv()) {
      return chrome.windows.getCurrent(({ id }) => {
        if (!id) return
        resolve(id)
      })
    } else {
      resolve(973095260)
    }
  })
}

/**
 * 获取所有窗口
 */
export const getAllWindow = () => {
  return new Promise(resolve => {
    if (isExtentionEnv()) {
      chrome.windows.getAll({}, windows => {
        console.error('获取所有窗口', windows)
        resolve(windows)
      })
    } else {
      resolve(mockWindowsData)
    }
  })
}

// 删除一个窗口
export const deleteWindow = windowId => {
  return new Promise(resolve => {
    chrome.windows.remove(windowId)
  })
}

const TabUtils = {
  getAllWindow,
  getCurrentWindowId,
  deleteTab,
  createNewTab,
  deleteWindow,
  toggleTab,
  getCurrentTab,
  toggleWindow,
  getTabLists,
  createNewWindow,
}

export default TabUtils
