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
  if (!allTabs?.length) return []
  // 分组归类
  const targetObj = Object.create(null)
  allTabs.forEach((tab) => {
    const domain = extractDomain(tab.url)
    if (!targetObj[domain]) {
      targetObj[domain] = [tab]
    } else {
      targetObj[domain].push(tab)
    }
  })
  console.error("targetObj", targetObj)
}
