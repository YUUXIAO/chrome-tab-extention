import { isExtentionEnv } from '@/utils.js'

const getStorageItem = key => {
  return new Promise(resolve => {
    if (isExtentionEnv()) {
      chrome.storage.sync.get(key, val => {
        resolve(val[key] || '')
      })
    } else {
      const val = JSON.parse(localStorage.getItem(key)) || ''
      resolve(val)
    }
  })
}

const setStorageItem = (key, val) => {
  if (isExtentionEnv()) {
    chrome.storage.sync.set({ [key]: JSON.stringify(val) })
  } else {
    localStorage.setItem(key, JSON.stringify(val))
  }
}

const removeStorageItem = keys => {
  if (isExtentionEnv()) {
    chrome.storage.sync.remove(keys)
  } else {
    localStorage.removeItem(keys)
  }
}

const storageUtils = {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
}

export default storageUtils
