import TabUtils from '@/extentionUtils/tabUtils.js'
import storageUtils from '@/extentionUtils/storage'

// 判断谷歌插件环境
export const isExtentionEnv = () => {
  const isExtension = chrome.extension
  return Boolean(isExtension)
}

// 判断是否登录
export const hasToken = async () => {
  storageUtils.getStorageItem('token').then(token => {
    return Boolean(token)
  })
}

// 域名校验，判断有无域名tab
export const extractDomain = url => {
  if (typeof url !== 'string') {
    return 'Others'
  }
  const ret = url.match(/(https?:\/\/[^/]+)/)
  return ret ? ret[1] : 'Others'
}

// 当前窗口tab按照域名排序
export const convertTabsData = allTabs => {
  if (!allTabs?.length) return {}
  // 按照域名分组归类
  const domainSortData = Object.create(null)
  allTabs.forEach(tab => {
    const domain = extractDomain(tab.url)
    if (!domainSortData[domain]) {
      domainSortData[domain] = {
        tabs: [tab],
      }
    } else {
      domainSortData[domain].tabs.push(tab)
    }
  })
  return domainSortData
}

// 更新域名下的tab,return 当前tab 所有的信息
export const updateDomainData = (tab, domain, domainData, currentWindowData) => {
  const { tabs } = domainData

  const hasOtherTab = tabs.filter(i => i.id !== tab.id) // 当前域名下是否还有其他tab
  if (hasOtherTab.length) {
    currentWindowData[domain] = {
      ...domainData,
      tabs: hasOtherTab,
    }
  } else {
    Reflect.deleteProperty(currentWindowData, `${domain}`)
  }
  return currentWindowData
}

// 删除一整个域名下的所有tab
export const deleteDomainData = (domain, currentWindowData) => {
  Reflect.deleteProperty(currentWindowData, `${domain}`)
  return currentWindowData
}

// 过滤掉重复的tab
export const fitlerRepeatTab = (allTabs, windowTabs) => {
  const tabMap = {}
  const filterResult = [] // 过滤后的tab
  allTabs.forEach(tab => {
    if (!tabMap[tab.url]) {
      filterResult.push(tab)
      tabMap[tab.url] = true
    } else {
      TabUtils.deleteTab(tab.id) // 重复的tab删除
    }
  })
  // 更新windows
  if (windowTabs?.length) {
    const curWindowId = allTabs[0].windowId
    windowTabs.forEach(i => {
      if (i.windowId === curWindowId) {
        i.tabs = filterResult
      }
    })
  }
  return {
    tabs: filterResult,
    windows: windowTabs || [],
  }
}

export const getDeepKeys = (obj, key) => {
  let result = []
  obj.forEach(item => {
    if (item?.children?.length) {
      const val = getDeepKeys(item.children, key)
      result = [...result, ...val]
    } else {
      result.push(item[key])
    }
  })
  return result.filter(v => v)
}

export const getUpdateTime = function (updateTime) {
  if (updateTime === null) {
    return ''
  }
  let now = new Date().getTime()
  let second = Math.floor((now - updateTime) / 1000)
  let minute = Math.floor(second / 60)
  let hour = Math.floor(minute / 60)
  let day = Math.floor(hour / 24)
  let month = Math.floor(day / 31)
  let year = Math.floor(month / 12)
  if (year > 0) {
    return year + '年前'
  } else if (month > 0) {
    return month + '月前'
  } else if (day > 0) {
    let ret = day + '天前'
    if (day >= 7 && day < 14) {
      ret = '1周前'
    } else if (day >= 14 && day < 21) {
      ret = '2周前'
    } else if (day >= 21 && day < 28) {
      ret = '3周前'
    } else if (day >= 28 && day < 31) {
      ret = '4周前'
    }
    return ret
  } else if (hour > 0) {
    return hour + '小时前'
  } else if (minute > 0) {
    return minute + '分钟前'
  } else if (second > 0) {
    return second + '秒前'
  } else {
    return '刚刚'
  }
}
