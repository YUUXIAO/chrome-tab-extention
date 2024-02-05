import './index.less'
import { Tabs, Input, Dropdown, Collapse, Badge, Modal, Space, Switch, Button } from 'antd'
import React from 'react'
import { DeleteOutlined, StarOutlined, StarFilled, CloseOutlined } from '@ant-design/icons'
import { mockWindowsData, mockTabsData } from '@/api/popup.js'
import ChromeUtils from '@/apiUtils.js'
import { updateDomainData, deleteDomainData, fitlerRepeatTab, convertTabsData } from '@/utils'
import CreateNewWindow from '../components/createNewWindow'
import TodoList from '../components/TodoList'
import UrlsGroupPop from '../components/urlsGroupPop'

import Store from '@/store/index'

const { Search } = Input
// TODO 抽出一个类的实现

const operationBtns = [
  {
    key: 'combine',
    label: '窗口合并',
  },
  {
    key: 'combine-tab',
    label: '合并相同tab',
  },
  {
    key: 'todo',
    label: '记事本',
  },
  {
    key: 'create-tag',
    label: '查看/创建网页组',
  },
]

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
          {favorUrls.has(tabData.url) ? (
            <StarFilled className='action-icon' onClick={e => this.props.onTabCollect(e, tabData)} />
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
      activeTab: null, // 当前活跃窗口ID
      windowTabs: [], // 所有窗口数据
      isShowTodo: false, // 是否打开记事本
      isShowUrlsGroup: false, // 设置网页组
      currentWindowTab: [],
      // 收藏信息
      favorUrlMaps: [],
      favorUrls: new Set(),
    }
  }

  componentDidMount() {
    this.getAllWindows()
    console.error('stroe', Store.getState())
    const userStore = Store.getState().user
    Store.subscribe(() => {
      this.setState({
        favorUrlMaps: userStore.favorUrlMaps,
        favorUrls: userStore.favorUrls,
      })
    })
    // console.error(111, this.state.favorUrlMaps)
    // console.error("popup页面获取background 的数据1-----")
    // const background = chrome.extension.getBackgroundPage()
    // console.log(JSON.stringify(background))
  }
  // 关闭窗口
  // TODO 抽取刷新currentWindowTab、windowDomain、activeTab的方法
  onEdit = (targetKey, action) => {
    let { windowTabs } = this.state
    console.error('targetKey', targetKey, action)
    if (action === 'remove') {
      // 删除窗口所有tab
      const isTempWindow = targetKey.includes('templId')
      const targetWindow = windowTabs.find(i => i.windowId === targetKey)
      const tabIds = targetWindow.tabs.map(i => i.id)
      if (!isTempWindow) {
        ChromeUtils.deleteTab(tabIds)
      }
      this.setState({
        windowTabs,
        currentWindowTab: convertTabsData(windowTabs[0].tabs),
        activeKey: windowTabs[0].windowId,
      })
    } else {
      // TODO 新增窗口
      console.error('新增窗口22')

      const hasTempWindow = windowTabs.find(i => Boolean(String(i.windowId).includes('templId')))
      if (hasTempWindow) return
      // console.error("targetWindow", targetWindow)
      const newWindowData = {
        name: `新增窗口-${windowTabs.length - 1}`,
        tabs: [],
        // isCurrent: true,
        windowId: `templId-${windowTabs.length}`,
      }
      windowTabs.push(newWindowData)
      this.setState({
        windowTabs,
        activeTab: `templId-${windowTabs.length - 1}`,
        currentWindowTab: convertTabsData([]),
      })
    }
  }
  onChange = winId => {
    console.error('切换tab', winId)

    const { windowTabs } = this.state
    const tabs = windowTabs.find(i => i.windowId === winId)?.tabs || []
    const windowSortList = convertTabsData(tabs) // 以域名排序的sort
    // console.error("windowTabs", windowTabs)
    this.setState({
      currentWindowTab: windowSortList,
      activeTab: winId,
    })
    console.error('当前窗口tab数据---', windowSortList)
  }
  // 切换tab
  tabClick = (e, tab) => {
    console.error('tabClick', e, tab)
    e.stopPropagation()
    ChromeUtils.toggleTab(tab, this.state.activeTab)
  }
  // 收藏tab
  onTabCollect = (e, tab) => {
    e.stopPropagation()
    const { url } = tab
    const hasFavor = this.state.favorUrls.has(url)
    console.error('是否已收藏---', hasFavor)
    if (hasFavor) {
      Store.dispatch({
        type: 'favor_reduce',
        payload: tab,
      })
    } else {
      Store.dispatch({
        type: 'favor_add',
        payload: tab,
      })
    }
    // TODO 接口

    // const hasCollected = mockUserCollect.
  }
  // 删除单个tab
  onTabDelete = (e, tab, domain, domainValues) => {
    e.stopPropagation()
    ChromeUtils.deleteTab(tab.id)
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
    console.error('删除该域名下所有tab', domain, domainValues)
    console.error(windowTabs)
    const { tabs } = domainValues
    tabs.forEach(tab => {
      ChromeUtils.deleteTab(tab.id)
    })
    // 判断当前窗口是否还有其他tab
    const updateWindowTabData = deleteDomainData(domain, currentWindowTab)
    // const deleteTabLen = tabs.length
    // const curWindowTabsLen =
    // Reflect.deleteProperty(currentWindowTab, `${domain}`)
    console.error('删除后的数据', updateWindowTabData)
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
      ChromeUtils.toggleWindow(updateWindowId)
    }
  }
  // 搜索当前窗口
  onSearch = word => {
    let result = []
    let keyword = word.trim()
    const { windowTabs, activeTab } = this.state
    console.error('搜索当前窗口', keyword, activeTab)
    console.error('allTabs', windowTabs)
    const allTabs =
      windowTabs.find(i => {
        return i.windowId === activeTab
      })?.tabs || []
    if (keyword) {
      result = allTabs.filter(i => {
        return i.title.includes(keyword)
      })
    } else {
      console.error(windowTabs)
      console.error(activeTab)
      result = allTabs || []
    }
    const windowSortList = convertTabsData(result) // 以域名排序
    this.setState({
      currentWindowTab: windowSortList,
    })
    // TODO 接口
    const url = `http://127.0.0.1:3000/api?keyword=${keyword}`
    fetch(url)
      .then(response => {
        console.error('fetch 毁掉', response)
      })
      .then(data => {
        // 处理返回的数据
      })
      .catch(error => {
        // 处理错误
      })
  }
  // tab 鼠标移入移出
  handleMouse = (val, tab) => {
    console.error('鼠标移入移出')
    const id = val ? tab.id : null
    this.setState({
      mouseTabId: id,
    })
  }
  // TODO 切换 switch
  onSwitchChange = val => {}

  // 基础操作
  onOperationClick = val => {
    console.error('基础操作', val)
    switch (val.key) {
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
        // this.openUrlsGroup()
        this.setState({
          isShowUrlsGroup: true,
        })
        break
      default:
        break
    }
  }

  // openUrlsGroup = () => {
  //   // this.isShowUrlsGroup = true
  //   this.setState({
  //     isShowUrlsGroup: true,
  //   })
  // }

  // 展开/隐藏tab
  // expandDomain = ()=>{
  //   const {expandkeys} = this.state
  //   console.log(expandkeys)
  //   if(expandkeys.length){
  //     this.setState({
  //       expandkeys:[]
  //     })
  //   }else {
  //     this.setState({
  //       expandkeys:Object.keys(this.state.currentWindowTab)
  //     })
  //   }
  // }

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
    const curWindowId = await ChromeUtils.getCurrentWindowId()
    // const allTabs = mockTabsData
    const otherWindowIds = windowTabs.filter(i => i.windowId !== curWindowId).map(i => i.windowId)

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
        ChromeUtils.createNewTab(createProperties)
      })

      otherWindowIds.map(i => ChromeUtils.deleteWindow(i)) // 删除其他窗口
    } else {
      alert('当前只有一个窗口，不能进行合并')
    }
    this.getAllWindows()
  }
  // 获取所有tabs
  async getAllWindows() {
    // TODO mock
    // const ajaxArray = [ChromeUtils.getAllWindow(), ChromeUtils.getTabLists(), ChromeUtils.getCurrentWindowId()]
    // const [windows, allTabs, curWindowId] = await Promise.all(ajaxArray)

    const windows = mockWindowsData
    const allTabs = mockTabsData
    const curWindowId = 973095260
    console.error('谷歌api获取窗口信息', windows)
    console.error('谷歌api获取tab信息', allTabs)

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

    console.error('所有的窗口数据----', windowTabs)
    console.error('当前窗口tab数据---', windowSortList)
    // console.error("windowSortList", windowSortList)
  }
  render() {
    const { windowTabs, isShowTodo, isShowUrlsGroup, activeTab, expandkeys, favorUrls, currentWindowTab } = this.state
    return (
      <div className='home-wrapper'>
        {/* 搜索当前窗口 */}
        <div className='search-wrapper flex-x-start flex-y-center'>
          <Search placeholder='请输入Tab名称' allowClear enterButton='搜索' size='large' className='flex' onSearch={this.onSearch} />
          {/* <Dropdown.Button size='large' className='operation' menu={{ items: operationBtns, onClick: this.onOperationClick }}>
            操作
          </Dropdown.Button> */}
          {/* TODO 开放所有tab搜索 */}
          {/* <Switch onChange={this.onSwitchChange} /> */}
        </div>
        {/* 合并所有窗口到一个窗口下 */}
        {/* {
          <Button className='combine-btn' onClick={this.openUrlsGroup}>
            查看/创建网页组
          </Button>
        } */}
        {operationBtns.map(btn => {
          return (
            <Button type='primary' size='small' className='combine-btn' onClick={this.onOperationClick(btn.key)}>
              {btn.label}
            </Button>
          )
        })}
        {/* 窗口操作 */}
        {
          // <Dropdown.Button
          //   menu={{ items: operationBtns, onClick: this.onOperationClick }}
          // >
          //   操作
          // </Dropdown.Button>
        }
        {/* 窗口Tabs */}
        <Tabs
          type='editable-card'
          onEdit={this.onEdit}
          defaultActiveKey={windowTabs[0]?.windowId}
          activeKey={activeTab}
          items={windowTabs?.map(i => {
            return {
              label: (
                <div className='flex-x-start '>
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
        {/* 窗口操作 */}

        {/* 列表 */}
        {Object.entries(currentWindowTab)?.length ? (
          Object.entries(currentWindowTab).map(([domain, domainValues]) => {
            const overTabOne = domainValues.tabs.length > 1
            return (
              <Collapse
                key={domain}
                items={[
                  {
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
                        favorUrls={favorUrls}
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
                            favorUrls={favorUrls}
                            domain={domain}
                            domainValues={domainValues}
                            onTabCollect={this.onTabCollect}
                            tabClick={this.tabClick}
                            onTabDelete={this.onTabDelete}
                          ></DomainOne>
                        )
                      }),
                  },
                ]}
              />
            )
          })
        ) : (
          // 创建新Window
          <CreateNewWindow></CreateNewWindow>
        )}

        {/* 记事本 */}
        {isShowTodo && <TodoList></TodoList>}
        {isShowUrlsGroup && <UrlsGroupPop></UrlsGroupPop>}
      </div>
    )
  }
}

export default Home
