// 域名校验，判断有无域名tab
export const extractDomain = (url) => {
  if (typeof url !== "string") {
    return "Others"
  }
  const ret = url.match(/(https?:\/\/[^/]+)/)
  return ret ? ret[1] : "Others"
}

// 当前窗口tab按照域名排序
export const convertTabsData = (allTabs) => {
  console.error("当前窗口tab按照域名排序", allTabs)
  if (!allTabs?.length) return {}
  // 按照域名分组归类
  const domainSortData = Object.create(null)
  allTabs.forEach((tab) => {
    const domain = extractDomain(tab.url)
    if (!domainSortData[domain]) {
      domainSortData[domain] = {
        tabs: [tab]
      }
    } else {
      domainSortData[domain].tabs.push(tab)
    }
  })
  console.error("targetObj", domainSortData)
  return domainSortData
}

// 更新域名下的tab,return 当前tab 所有的信息
export const updateDomainData = (
  tab,
  domain,
  domainData,
  currentWindowData
) => {
  const { tabs } = domainData

  const hasOtherTab = tabs.filter((i) => i.id !== tab.id) // 当前域名下是否还有其他tab
  if (hasOtherTab.length) {
    currentWindowData[domain] = {
      ...domainData,
      tabs: hasOtherTab
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
