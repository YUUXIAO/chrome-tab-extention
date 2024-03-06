import { isExtentionEnv } from '@/utils.js'

const getStorageItem = key => {
  return new Promise(resolve => {
    if (isExtentionEnv()) {
      chrome.storage.sync.get(key, val => {
        resolve(val[key] || '')
      })
    } else {
      const val = localStorage.getItem(key) || ''
      resolve(val)
    }
  })
}

const setStorageItem = (key, val) => {
  if (isExtentionEnv()) {
    chrome.storage.sync.set({ [key]: val })
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

const clearStoragItem = () => {
  if (isExtentionEnv()) {
    chrome.storage.sync.clear()
  } else {
    localStorage.clear()
  }
}

class StorageArray {
  async setItem(key, value) {
    const listdata = (await getStorageItem(key)) || []
    listdata.push(value)
    setStorageItem(key, listdata)
  }
  async getItem(key) {
    return (await getStorageItem(key)) || []
  }

  async updateItem(key, val, updateObj) {
    const listdata = (await getStorageItem(key)) || []
    const isStringArray = typeof listdata[0] === 'string'
    if (!isStringArray) {
      const idx = listdata.findIndex(i => i.createTime === val)
      listdata[idx] = {
        ...listdata[idx],
        ...updateObj,
      }
      setStorageItem(key, listdata)
    }
  }

  async removeItem(key, val) {
    const listdata = (await getStorageItem(key)) || []
    if (!listdata.length) return
    const isArray = listdata[0] && typeof listdata[0] === 'object'
    let idx = 0
    if (!isArray) {
      idx = listdata.indexOf(val)
    } else {
      if (key === 'collectData') {
        idx = listdata.findIndex(i => i.url === val)
      } else {
        idx = listdata.findIndex(i => i.createTime === val)
      }
    }
    listdata.splice(idx, 1)
    setStorageItem(key, listdata)
  }
}

const storageUtils = {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearStoragItem,
  StorageArray: new StorageArray(),
}

export default storageUtils
