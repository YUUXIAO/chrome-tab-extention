import './index.less'
import { Tabs, Input, Dropdown, Collapse, Badge, Modal, Space, Switch, Button } from 'antd'
import React from 'react'
import { DeleteOutlined, StarOutlined, StarFilled, CloseOutlined } from '@ant-design/icons'
// import { mockWindowsData, mockTabsData } from '@/api/popup.js'
import TabUtils from '@/extentionUtils/tabUtils.js'
import { updateDomainData, deleteDomainData, fitlerRepeatTab, convertTabsData } from '@/utils'
import { urlCollect, getUserInfo } from '@/api/user'
import bookMarksUtils from '@/extentionUtils/bookmarks.js'
import storageUtils from '@/extentionUtils/storage'

import CreateNewWindow from '../components/createNewWindow'
import TodoList from '../components/TodoList'
import LoginPop from './LoginPop'
import UrlsGroupPop from '../components/urlsGroupPop'

import Store from '@/store/index'
import { hasToken, isExtentionEnv } from '@/utils.js'

const { Search } = Input
// TODO 抽出一个类的实现

// const operationBtns = [
//   {
//     key: 'expand',
//     label: '铺开/收起域名',
//     visible: true,
//   },
//   {
//     key: 'combine',
//     label: '窗口合并',
//     visible: true,
//   },
//   {
//     key: 'combine-tab',
//     label: '合并相同tab',
//     visible: true,
//   },
//   {
//     key: 'todo',
//     label: '记事本',
//     visible: false,
//   },
//   {
//     key: 'create-tag',
//     label: '查看/创建网页组',
//     visible: true,
//   },
//   {
//     key: 'login',
//     label: '登录/注册',
//     visible: !hasToken(),
//   },
// ]

class DomainOne extends React.Component {
  render() {
    const { tabData, favorUrls, domain, domainValues } = this.props
    return (
      <div key={tabData.id} className='tab-one domain-header flex-y-center flex-x-between' onClick={e => this.props.tabClick(e, tabData)}>
        <div className='flex-x-start'>
          <img alt='' className='domain-icon' src={tabData.favIconUrl || ''}></img>
          {tabData.title}
        </div>
        <div className='action flex-x-end'>
          {/* 收藏按钮 */}
          {favorUrls.includes(tabData.url) ? (
            <StarFilled className='action-icon star-filled' onClick={e => this.props.onTabCollect(e, tabData)} />
          ) : (
            <StarOutlined className='action-icon' onClick={e => this.props.onTabCollect(e, tabData)} />
          )}
          {/* 删除按钮 */}
          <DeleteOutlined className='action-icon' onClick={e => this.props.onTabDelete(e, tabData, domain, domainValues)} />
        </div>
      </div>
    )
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: '', // 当前活跃窗口ID
      windowTabs: [], // 所有窗口数据
      isShowTodo: false, // 是否打开记事本
      isShowUrlsGroup: false, // 设置网页组
      isShowLogin: false,
      currentWindowTab: [],
      expandkeys: [],
      loginWindowId: Store.getState().user.loginWindowId,
      isLogin: Store.getState().user.isLogin,
      collectUrls: Store.getState().user.collectUrls, //收藏信息
      operationBtns: [
        {
          key: 'expand',
          label: '铺开/收起域名',
          visible: true,
        },
        {
          key: 'combine',
          label: '窗口合并',
          visible: true,
        },
        {
          key: 'combine-tab',
          label: '合并相同tab',
          visible: true,
        },
        {
          key: 'todo',
          label: '记事本',
          visible: false,
        },
        {
          key: 'create-tag',
          label: '查看/创建网页组',
          visible: true,
        },
      ],
    }
  }

  componentDidMount() {
    this.getUserInfo()
    this.getAllWindows()
    this.getAllBookMarks()

    Store.subscribe(() => {
      this.setState({
        isLogin: Store.getState().user.isLogin,
        loginWindowId: Store.getState().user.loginWindowId,
        collectUrls: Store.getState().user.collectUrls,
      })
    })
    console.error(Store.getState().user.isLogin)
    this.setState({
      operationBtns: [
        ...this.state.operationBtns,
        {
          key: 'login',
          label: '登录/注册',
          visible: !Store.getState().user.isLogin,
        },
      ],
    })

    // console.error(111, this.state.favorUrlMaps)
    // console.error("popup页面获取background 的数据1-----")
    // const background = chrome.extension.getBackgroundPage()
    // console.log(JSON.stringify(background))
  }
  // 获取到用户信息
  getUserInfo = () => {
    if (!hasToken()) return false
    getUserInfo()
      .then(res => {
        console.error('获取到用户信息', res)
        Store.dispatch({
          type: 'get_user',
          payload: res.data,
        })
      })
      .catch(err => {
        const { operationBtns } = this.state
        operationBtns.forEach(btn => {
          if (btn.key === 'login') {
            btn.visible = true
          }
        })
        this.setState({
          operationBtns,
        })
      })
  }
  // 关闭窗口
  // TODO 抽取刷新currentWindowTab、windowDomain、activeTab的方法
  onEdit = (targetKey, action) => {
    let { windowTabs } = this.state
    console.error('targetKey', targetKey, action)
    if (action === 'remove') {
      // 删除窗口所有tab
      const isTempWindow = String(targetKey).includes('templId')
      // const targetWindow = windowTabs.find(i => i.windowId === targetKey)
      // const tabIds = targetWindow.tabs.map(i => i.id)
      if (!isTempWindow) {
        windowTabs = windowTabs.filter(i => i.windowId !== targetKey)
        TabUtils.deleteWindow(targetKey)
      }
      this.setState({
        windowTabs,
        currentWindowTab: convertTabsData(windowTabs[0].tabs),
        activeKey: windowTabs[0].windowId,
      })
    } else {
      // TODO 新增窗口
      // console.error('新增窗口22')
      // const hasTempWindow = windowTabs.find(i => Boolean(String(i.windowId).includes('templId')))
      // if (hasTempWindow) return
      // // console.error("targetWindow", targetWindow)
      // const newWindowData = {
      //   name: `新增窗口-${windowTabs.length - 1}`,
      //   tabs: [],
      //   // isCurrent: true,
      //   windowId: `templId-${windowTabs.length}`,
      // }
      // windowTabs.push(newWindowData)
      // this.setState({
      //   windowTabs,
      //   activeTab: `templId-${windowTabs.length - 1}`,
      //   currentWindowTab: convertTabsData([]),
      // })
    }
  }
  onChange = winId => {
    // console.error('切换tab', winId)

    const { windowTabs } = this.state
    const tabs = windowTabs.find(i => i.windowId === winId)?.tabs || []
    const windowSortList = convertTabsData(tabs) // 以域名排序的sort
    // console.error("windowTabs", windowTabs)
    this.setState({
      currentWindowTab: windowSortList,
      activeTab: winId,
    })
    // console.error('当前窗口tab数据---', windowSortList)
  }
  // 切换tab
  tabClick = (e, tab) => {
    e.stopPropagation()
    TabUtils.toggleTab(tab, this.state.activeTab)
  }
  // 收藏tab
  onTabCollect = async (e, tab) => {
    e.stopPropagation()
    const { isLogin, collectUrls } = this.state
    const { url } = tab
    const hasFavor = collectUrls.includes(url)
    // 处理书签文件夹数据
    if (hasFavor) {
      if (!isExtentionEnv()) {
        const marketId = ''
        bookMarksUtils.removeBookMarks(marketId) // 移除书签
      }
    } else {
      const payload = {
        parentId: '1',
        title: '拓展收藏',
      }
      bookMarksUtils.createBookMarks(payload)
    }
    console.error('islohon', isLogin, Store.getState().user.isLogin)
    if (isLogin) {
      const payload = {
        url,
      }
      urlCollect(payload).then(res => {
        // console.error('收藏url--', res)
        Store.dispatch({
          type: 'set_collect',
          payload: res.data,
        })
      })
    } else {
      // 游客模式存本地
      const collectData = (await storageUtils.getStorageItem('collectData')) || []
      console.error('11', collectData)
      if (hasFavor) {
        collectData.delete(url)
      } else {
        collectData.push(url)
      }
      Store.dispatch({
        type: 'set_collect',
        payload: collectData,
      })
      console.error('collectData---', collectData)
      storageUtils.setStorageItem('collectData', collectData)
    }
  }
  // 删除单个tab
  onTabDelete = (e, tab, domain, domainValues) => {
    e.stopPropagation()
    TabUtils.deleteTab(tab.id)
    // domainValues 如果该域名下的数据全部删除了要更新列表
    // 更新域名下的数据
    const updateWindowData = updateDomainData(tab, domain, domainValues, this.state.currentWindowTab)
    this.setState({
      currentWindowTab: updateWindowData,
    })
  }
  // 删除该域名下所有tab
  onDomainTabDelete = (e, domain, domainValues) => {
    e.stopPropagation()
    const { currentWindowTab, windowTabs, activeTab } = this.state
    // console.error('删除该域名下所有tab', domain, domainValues)
    // console.error(windowTabs)
    const { tabs } = domainValues
    tabs.forEach(tab => {
      TabUtils.deleteTab(tab.id)
    })
    // 判断当前窗口是否还有其他tab
    const updateWindowTabData = deleteDomainData(domain, currentWindowTab)
    // const deleteTabLen = tabs.length
    // const curWindowTabsLen =
    // Reflect.deleteProperty(currentWindowTab, `${domain}`)
    // console.error('删除后的数据', updateWindowTabData)
    if (Object.keys(updateWindowTabData)?.length) {
      // 还有其他tab数据
      this.setState({
        currentWindowTab: updateWindowTabData,
      })
    } else {
      // 更新窗口
      const otherWindows = windowTabs.filter(i => i.windowId !== activeTab)
      const updateWindowId = otherWindows[0]?.windowId || null
      const activeTabData = convertTabsData(otherWindows[0]?.tabs)
      this.setState({
        currentWindowTab: activeTabData,
        activeTab: updateWindowId,
        windowTabs: otherWindows,
      })
      TabUtils.toggleWindow(updateWindowId)
    }
  }
  // 搜索当前窗口
  onSearch = word => {
    let result = []
    let keyword = word.trim()
    const { windowTabs, activeTab } = this.state
    const allTabs =
      windowTabs.find(i => {
        return i.windowId === activeTab
      })?.tabs || []
    if (keyword) {
      result = allTabs.filter(i => {
        if (i.title.includes(keyword) || i.url.includes(keyword)) {
          return i
        }
      })
    } else {
      result = allTabs || []
    }

    const windowSortList = convertTabsData(result) // 以域名排序
    this.setState({
      currentWindowTab: windowSortList,
    })
  }

  // TODO 切换 switch
  onSwitchChange = val => {}

  // 基础操作
  onOperationClick = val => {
    console.error('基础操作', val)
    switch (val.key) {
      case 'expand':
        this.expandDomain()
        break
      case 'combine':
        this.windowsCombine() // 合并所有窗口
        break
      case 'combine-tab':
        this.windowTabCombine() // 合并窗口相同tab
        break
      case 'todo':
        this.setState({
          isShowTodo: true, // 打开记事本
        })
        break
      case 'create-tag':
        this.openUrlsGroup()
        // chrome.tabs.create({ url: 'background.html' })
        // this.setState({
        //   isShowUrlsGroup: true,
        // })
        break
      case 'login':
        // this.openUrlsGroup()
        const { loginWindowId } = this.state
        console.error('屏幕宽度', loginWindowId, window)
        if (loginWindowId) {
          TabUtils.toggleWindow(loginWindowId, { focus: true, drawAttention: true })
          return
        }
        const left = window.screen.width - 40 - 300
        const properties = { url: 'pages/login.html', left, top: 100, width: 300, height: 400, type: 'popup' }
        TabUtils.createNewWindow(properties, async window => {
          const loginWindowId = window.id
          console.error(4, Store.getState().user)
          const collectData = await storageUtils.getStorageItem('collectData')
          console.error('collectData', collectData)
          Store.dispatch({
            type: 'get_loginWindow',
            payload: loginWindowId,
          })
        })
        // chrome.windows.create({ url: 'login.html', top: 20, width: 200, height: 400, type: 'popup' })
        // this.setState({
        //   isShowLogin: true,
        // })
        break

      default:
        break
    }
  }

  collapseChange = val => {
    this.setState({
      expandkeys: val,
    })
  }

  // 展开/隐藏domain
  expandDomain = () => {
    const { expandkeys, currentWindowTab } = this.state
    const keys = []
    for (const key in currentWindowTab) {
      if (currentWindowTab[key].tabs.length > 1) {
        keys.push(key)
      }
    }
    if (expandkeys.length) {
      this.setState({
        expandkeys: [],
      })
    } else {
      this.setState({
        expandkeys: keys,
      })
    }
  }

  // 过滤当前窗口tab数据
  // TODO 包含所有窗口
  windowTabCombine = () => {
    const { activeTab, windowTabs } = this.state
    const allTabs = windowTabs.find(i => i.windowId === activeTab)?.tabs || []
    const { tabs, windows } = fitlerRepeatTab(allTabs, windowTabs)
    this.setState({
      windowTabs: windows,
      currentWindowTab: convertTabsData(tabs), // sort按域名排序
    })
  }

  // 窗口合并
  windowsCombine = async () => {
    const { windowTabs, activeTab } = this.state
    const curWindowId = await TabUtils.getCurrentWindowId()
    // const allTabs = mockTabsData
    const otherWindowIds = windowTabs.filter(i => i.windowId !== curWindowId).map(i => i.windowId)

    // TODO 用chrome.tabs.move方法
    if (otherWindowIds?.length) {
      // 复制窗口Tab
      let otherTabs = []
      windowTabs.forEach(i => {
        if (i.windowId !== curWindowId) {
          otherTabs = [...otherTabs, ...i.tabs]
        }
      })
      console.error('其他窗口信息tab----', otherTabs)
      otherTabs.forEach(tab => {
        const createProperties = {
          windowId: curWindowId,
          url: tab.url,
        }
        TabUtils.createNewTab(createProperties)
      })

      otherWindowIds.map(i => TabUtils.deleteWindow(i)) // 删除其他窗口
    } else {
      alert('当前只有一个窗口，不能进行合并')
    }
    this.getAllWindows()
  }

  // 获取所有标签
  getAllBookMarks = () => {
    bookMarksUtils.getAllBookMarks().then(bookMarks => {
      const marksData = bookMarks[0].children || []
      Store.dispatch({
        type: 'get_bookmarks',
        payload: marksData,
      })
      // 查询是否有插件创建的收藏夹
      const hasExtentionDir = marksData.find(i => i.title === import.meta.env.VITE_BOOKMARKS_DIR_NAME)
      console.error('查询是否有插件创建的收藏夹名字', hasExtentionDir)
      // const fn = function (marksData) {
      //   for (let i = 0; i < marksData.length; i++) {
      //     const mark = marksData[i]
      //     if (mark?.children?.length) {
      //       return fn(mark.children)
      //     } else {
      //       if (mark.title === import.meta.env.VITE_BOOKMARKS_DIR_NAME) {
      //         return mark
      //       }
      //     }
      //   }
      // }
      // console.error(1, JSON.stringify(fn(marksData)))
    })
  }
  // 获取所有tabs
  async getAllWindows() {
    const ajaxArray = [TabUtils.getAllWindow(), TabUtils.getTabLists(), TabUtils.getCurrentWindowId()]
    const [windows, allTabs, curWindowId] = await Promise.all(ajaxArray)

    // const windowMap = {}
    const windowTabs = [] // 所有窗口数据
    let activeWindowTabs = [] // 活跃窗口数据
    windows.forEach((win, winIdx) => {
      const parentId = win.id
      const isActiveWindow = parentId === curWindowId

      // tab过滤
      const currentTabsAll = allTabs.filter(i => i.windowId === parentId)
      const { tabs: currentTabs } = fitlerRepeatTab(currentTabsAll)
      if (isActiveWindow) activeWindowTabs = currentTabs // 当前窗口Tab数据

      // TODO 处理无痕模式
      // TODO 当前窗口挪到第一位
      const windowName = isActiveWindow ? `当前窗口` : `窗口-${winIdx}`
      const windowInfo = {
        isActiveWindow: isActiveWindow,
        name: windowName,
        windowId: parentId,
        icon: currentTabs[0].favIconUrl,
        tabs: currentTabs,
      }
      // windowMap[parentId] = windowInfo
      windowTabs.push(windowInfo)
    })
    const windowSortList = convertTabsData(activeWindowTabs) // sort按域名排序
    this.setState({
      windowTabs: windowTabs,
      activeTab: curWindowId,
      currentWindowTab: windowSortList,
    })

    // console.error('所有的窗口数据----', windowTabs)
    // console.error('当前窗口tab数据---', windowSortList)
    // console.error("windowSortList", windowSortList)
  }
  // 设置弹窗状态
  setPopVisible = (type, visible) => {
    this.setState({
      [type]: visible,
    })
  }
  render() {
    const { windowTabs, isShowTodo, operationBtns, isShowUrlsGroup, isShowLogin, activeTab, expandkeys, collectUrls, currentWindowTab } = this.state
    return (
      <div className='home-wrapper'>
        {/* 搜索当前窗口 */}
        <div className='search-wrapper flex-x-start flex-y-center'>
          <Search placeholder='请输入Tab名称或者网址链接' allowClear enterButton='搜索' size='large' className='flex' onSearch={this.onSearch} />
          {/* TODO 开放所有tab搜索 */}
          {/* <Switch onChange={this.onSwitchChange} /> */}
        </div>
        {/* 操作按钮 */}
        {operationBtns
          .filter(btn => btn.visible)
          .map(btn => {
            return (
              <Button key={btn.key} type='primary' size='small' className='combine-btn' onClick={() => this.onOperationClick(btn)}>
                {btn.label}
              </Button>
            )
          })}
        {/* 窗口Tabs */}
        <Tabs
          type='editable-card'
          onEdit={this.onEdit}
          defaultActiveKey={windowTabs[0]?.windowId}
          activeKey={activeTab}
          items={windowTabs?.map((i, index) => {
            return {
              label: (
                <div className='flex-x-start' key={index}>
                  <span className='flex-x-start flex-y-center tab'>
                    <i className={i.isActiveWindow ? 'dot' : ''}></i> {i.name}
                  </span>
                  <Badge size='small' color='#faad14' count={i.tabs.length}></Badge>
                </div>
              ),
              key: i.windowId,
            }
          })}
          onChange={this.onChange}
        ></Tabs>
        {/* 列表 */}
        {Boolean(Object.entries(currentWindowTab)?.length) && (
          <Collapse
            activeKey={expandkeys}
            onChange={this.collapseChange}
            items={Object.entries(currentWindowTab).map(([domain, domainValues]) => {
              const overTabOne = domainValues.tabs.length > 1
              return {
                key: domain,
                collapsible: !overTabOne ? 'disabled' : 'header',
                showArrow: overTabOne,
                label: overTabOne ? (
                  <div className='flex-x-between flex-y-center domain-header'>
                    <div className='flex-x-start flex-y-center'>
                      <img src={domainValues.tabs[0].favIconUrl} className='domain-icon' />
                      {domain}
                    </div>
                    <CloseOutlined className='domain-delete' onClick={e => this.onDomainTabDelete(e, domain, domainValues)} />
                  </div>
                ) : (
                  <DomainOne
                    tabData={domainValues.tabs[0]}
                    favorUrls={collectUrls}
                    domain={domain}
                    domainValues={domainValues}
                    onTabCollect={this.onTabCollect}
                    tabClick={this.tabClick}
                    onTabDelete={this.onTabDelete}
                  ></DomainOne>
                ),
                children:
                  domainValues.tabs.length > 1 &&
                  domainValues.tabs.map((tab, tabIdx) => {
                    return (
                      <DomainOne
                        tabData={tab}
                        favorUrls={collectUrls}
                        domain={domain}
                        key={tabIdx}
                        domainValues={domainValues}
                        onTabCollect={this.onTabCollect}
                        tabClick={this.tabClick}
                        onTabDelete={this.onTabDelete}
                      ></DomainOne>
                    )
                  }),
              }
              // ]
            })}
          />
        )}

        {activeTab && String(activeTab).includes('templId') && <CreateNewWindow></CreateNewWindow>}
        {/* 记事本 */}
        {isShowTodo && <TodoList></TodoList>}
        {isShowUrlsGroup && <UrlsGroupPop open={isShowUrlsGroup} setPopVisible={this.setPopVisible}></UrlsGroupPop>}
        {/* {isShowLogin && <LoginPop open={isShowLogin} setPopVisible={this.setPopVisible}></LoginPop>} */}
      </div>
    )
  }
}

export default Home
