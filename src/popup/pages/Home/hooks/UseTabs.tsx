// 传入所有tabs数据
// 传出：按域名分类，

import { useState } from 'react'
import TabUtils from '@/extentionUtils/tabUtils.js'

export interface Tabs {}
// 域名组tabs
export interface DomainGroup {
  domain: string
  tabs: Tabs[]
}

// 定义自定义 Hook 的返回值类型
type UseTabsReturnType = [domainGroups: DomainGroup[], combineSame: () => void]

// 定义自定义 Hook
export default async function useTabs(allTabs: Tabs[], windows): UseTabsReturnType {
  const domainGroups = [] as DomainGroup[]

  const windowTabs = [] // 所有窗口数据
  let activeWindowTabs = [] // 活跃窗口数据

  const curWindowId = await TabUtils.getCurrentWindowId()

  windows.forEach(win => {
    const parentId = win.id
    const isActiveWindow = parentId === curWindowId

    const currentTabsAll = allTabs.filter(i => i.windowId === parentId)
    if (isActiveWindow) activeWindowTabs = currentTabsAll // 当前窗口Tab数据

    // TODO 处理无痕模式
    // TODO 当前窗口挪到第一位
    const windowName = isActiveWindow ? `当前窗口` : `其他窗口`
    // name: windowNames[String(parentId)] || windowName,
    const windowInfo = {
      isActiveWindow: isActiveWindow,
      name: windowName,
      windowId: parentId,
      isEdit: false,
      icon: currentTabsAll[0].favIconUrl,
      tabs: currentTabsAll,
    }
    windowTabs.push(windowInfo)
  })

  // 合并相同tab
  const combineSame = () => {}

  return [domainGroups, combineSame]
}
