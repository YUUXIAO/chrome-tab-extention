import TabUtils from '@/extentionUtils/tabUtils.js'

// 判断谷歌插件环境
export const isExtentionEnv = () => {
  const isExtension = chrome.extension
  return Boolean(isExtension)
}

// 判断是否登录
export const hasToken = async () => {
  let token = ''
  if (isExtentionEnv()) {
    const data = await chrome.storage.sync.get('token')
    console.error('判断是否登录', data)
    token = data?.token || ''
    return Boolean(token)
  } else {
    token = localStorage.getItem('token')
    return Boolean(token)
  }
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
  console.error('当前窗口tab按照域名排序', allTabs)
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
  console.error('targetObj', domainSortData)
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
    item.mult_url = `${obj.id}_${obj[key]}` // 做唯一标志
    if (item?.children?.length) {
      const val = getDeepKeys(item.children, key)
      result = [...result, ...val]
    } else {
      result.push(item[key])
    }
  })
  return result.filter(v => v)
}
