import './index.less'
import { Tabs, Input, Collapse, Popconfirm, Avatar, Badge, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import {
  DeleteOutlined,
  HeartFilled,
  HeartOutlined,
  FieldTimeOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
  CopyOutlined,
  FormOutlined,
  MenuUnfoldOutlined,
  ArrowsAltOutlined,
  EyeOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
} from '@ant-design/icons'
import TabUtils from '@/extentionUtils/tabUtils.js'
import { updateDomainData, deleteDomainData, fitlerRepeatTab, windowHasRepeatTab, judgeCombineDomain, convertTabsData } from '@/utils'
import { urlCollect, getUserInfo } from '@/api/user'
import BookMarkPop from '../components/BookMarkPop'
import bookMarksUtils from '@/extentionUtils/bookmarks.js'
import storageUtils from '@/extentionUtils/storage'
import CreateNewWindow from '../components/createNewWindow'
import Store from '@/store/index'

const { Search } = Input
// TODO 抽出一个类的实现

export const withNavigation = Component => {
  return props => <Component {...props} navigate={useNavigate()} />
}

class DomainOne extends React.Component {
  render() {
    const { tabData, favorUrls, domain, domainValues, curTabData } = this.props
    return (
      <div
        key={tabData.id}
        className={`tab-one domain-header flex-y-center flex-x-between ${curTabData.id === tabData.id ? 'current' : ''}`}
        onClick={e => this.props.tabClick(e, tabData)}
      >
        <img
          alt={tabData.title}
          onError={e => {
            e.target.onerror = null
            e.target.src = '/logo.png'
          }}
          className='domain-icon'
          src={tabData.favIconUrl || ''}
        ></img>
        <div className='title content-info'>
          <div className='app-oneline'>{tabData.title}</div>
          <div className='sub-domain app-oneline'>{tabData.url}</div>
        </div>
        <div className='action flex-x-end'>
          {/* 收藏按钮 */}
          {favorUrls.find(i => i?.url === tabData.url) ? (
            <HeartFilled className='action-icon star-filled' onClick={e => this.props.onTabCollect(e, tabData)} />
          ) : (
            <HeartOutlined className='action-icon' onClick={e => this.props.onTabCollect(e, tabData)} />
          )}
          {/* 删除按钮 */}
          <DeleteOutlined className='action-icon' onClick={e => this.props.onTabDelete(e, tabData, domain, domainValues)} />
        </div>
      </div>
    )
  }
}

const operations = [
  {
    key: 'expand',
    icon: <ArrowsAltOutlined />,
    label: '铺开/收起域名',
    visible: true,
  },
  {
    key: 'combine',
    icon: <CopyOutlined />,
    label: '窗口合并',
    visible: false,
  },
  {
    key: 'combine-tab',
    icon: <MenuUnfoldOutlined />,
    label: '合并相同tab',
    visible: true,
  },
  {
    key: 'todo',
    icon: <FormOutlined />,
    label: '记事本',
    count: 0,
    visible: true,
  },
  {
    key: 'create-tag',
    icon: <EyeOutlined />,
    label: '查看/创建网页组',
    visible: true,
  },
  // {
  //   key: 'login',
  //   icon: <UserOutlined />,
  //   label: '登录/注册',
  //   visible: false,
  // },
  {
    key: 'later',
    icon: <FieldTimeOutlined />,
    label: '稍后再看',
    count: 0,
    visible: true,
  },
]

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      curTabData: {},

      // extentionDir: null,
      userinfo: {},
      bookMarkItem: {}, // 当前操作的书签数据
      bookMarkPopShow: false, // 选择书签
      activeTab: '', // 当前活跃窗口ID
      windowTabs: [], // 所有窗口数据
      isShowTodo: false, // 是否打开记事本
      hasCombineDomain: false, // 当前窗口是否有折叠域名
      currentWindowTab: {}, // 当前窗口域名键值对
      expandkeys: [],
      isShowLater: false,
      // loginWindowId: Store.getState().user.loginWindowId,
      isLogin: Store.getState().user.isLogin,
      collectUrls: Store.getState().user.collectUrls, //收藏信息
    }
  }

  get operationBtns() {
    const { windowTabs, isLogin, userinfo, hasCombineDomain, activeTab } = this.state
    operations.forEach(btn => {
      // 登录按钮
      // if (btn.key === 'login') {
      //   btn.visible = !isLogin
      // }
      if (btn.key === 'combine-tab') {
        const allTabs = windowTabs.find(i => i.windowId === activeTab)?.tabs || []
        const { hasRepeat } = windowHasRepeatTab(allTabs, false)
        btn.visible = hasRepeat
      }
      // 窗口合并
      if (btn.key === 'combine') {
        if (windowTabs.length > 1) btn.visible = true
      }
      // 稍后再看/记事本
      if (btn.key === 'todo') {
        btn.count = userinfo.todoCount
      }
      if (btn.key === 'later') {
        btn.count = userinfo.laterCount
      }
      if (btn.key === 'expand') {
        btn.visible = hasCombineDomain
      }
    })
    return operations
  }

  clearData = () => {
    storageUtils.clearStoragItem()
  }

  async componentDidMount() {
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
  }
  // 获取到用户信息
  getUserInfo = async () => {
    getUserInfo()
      .then(res => {
        const { userinfo } = res.data
        Store.dispatch({
          type: 'get_user',
          payload: userinfo,
        })
        this.setState({
          userinfo: res.data,
        })
      })
      .catch(async () => {
        let collectData = await storageUtils.StorageArray.getItem('collectData')
        const laterData = await storageUtils.StorageArray.getItem('laterData')
        const todoKeysData = await storageUtils.StorageArray.getItem('todoKeys')
        this.setState({
          userinfo: {
            laterCount: laterData.filter(i => i.status === 0)?.length || 0,
            todoCount: todoKeysData.filter(i => i.status === 0)?.length || 0,
          },
        })
        if (collectData?.length) {
          console.log('本地有收藏数据', collectData)
          const isOldData = collectData.find(i => typeof i === 'string')
          if (isOldData) {
            collectData = collectData.map(i => {
              return {
                url: i,
                bookMarkId: null,
              }
            })
          }

          Store.dispatch({
            type: 'get_user',
            payload: {
              collectUrls: collectData,
            },
          })
        }
      })
  }
  // 关闭窗口
  // TODO 抽取刷新currentWindowTab、windowDomain、activeTab的方法
  onEdit = (targetKey, action) => {
    let { windowTabs } = this.state
    if (action === 'remove') {
      // 删除窗口所有tab
      const isTempWindow = String(targetKey).includes('templId')
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
  // 切换窗口
  onChange = winId => {
    const { windowTabs } = this.state
    this.updateWindow(winId, windowTabs)
  }
  // 切换tab
  tabClick = (e, tab) => {
    e.stopPropagation()
    TabUtils.toggleTab(tab, this.state.activeTab)
  }

  // 收藏tab
  onTabCollect = async (e, tab) => {
    e.stopPropagation()
    const { collectUrls } = this.state
    const { url } = tab
    const collectFavor = collectUrls.find(i => i.url === url)
    const hasFavor = Boolean(collectFavor)

    if (hasFavor) {
      // 删除书签
      const marketId = collectFavor.bookMarkId
      marketId && bookMarksUtils.removeBookMarks(marketId)
      const payload = {
        url,
        bookMarkId: marketId,
      }
      this.updateCollectData('remove', payload)
    } else {
      // 创建书签
      this.setState({
        bookMarkItem: tab,
        bookMarkPopShow: true,
      })
    }
  }

  // 创建书签回调
  createBookMarksCb = async bookMarkId => {
    const { bookMarkItem } = this.state
    this.setState({
      bookMarkPopShow: false,
    })
    const payload = {
      url: bookMarkItem.url,
      bookMarkId: bookMarkId,
    }
    this.updateCollectData('set', payload)
  }

  // 更新收藏数据
  updateCollectData = async (type, payload) => {
    const { isLogin } = this.state
    if (isLogin) {
      urlCollect(payload).then(res => {
        Store.dispatch({
          type: 'set_collect',
          payload: res.data,
        })
      })
    } else {
      if (type === 'set') {
        await storageUtils.StorageArray.setItem('collectData', payload)
      } else {
        await storageUtils.StorageArray.removeItem('collectData', payload.url)
      }
      const collectData = await storageUtils.StorageArray.getItem('collectData')
      Store.dispatch({
        type: 'set_collect',
        payload: collectData,
      })
    }
  }

  // 删除单个tab
  onTabDelete = (e, tab, domain, domainValues) => {
    e.stopPropagation()
    TabUtils.deleteTab(tab.id)
    // 更新域名下的数据
    // const { windowTabs } = this.state
    const windowTabs = this.deleteTab([tab.id])
    const updateWindowData = updateDomainData(tab, domain, domainValues, this.state.currentWindowTab)
    if (Object.keys(updateWindowData)?.length) {
      this.setState({
        currentWindowTab: updateWindowData,
        windowTabs,
      })
    } else {
      const otherWindows = windowTabs.filter(i => i.windowId !== this.state.activeTab)
      const updateWindowId = otherWindows[0]?.windowId || null
      this.updateWindow(updateWindowId, otherWindows)
    }
  }
  // 删除该域名下所有tab
  onDomainTabDelete = (e, domain, domainValues) => {
    e.stopPropagation()
    const { currentWindowTab, windowTabs, activeTab } = this.state

    const { tabs } = domainValues
    tabs.forEach(tab => {
      TabUtils.deleteTab(tab.id)
    })
    // 判断当前窗口是否还有其他tab
    const updateWindowTabData = deleteDomainData(domain, currentWindowTab)
    if (Object.keys(updateWindowTabData)?.length) {
      // 还有其他tab数据
      const windowTabs = this.deleteTab(tabs.map(i => i.id))
      this.setState({
        windowTabs,
        currentWindowTab: updateWindowTabData,
      })
    } else {
      // 没有窗口数据了，要更新窗口
      const otherWindows = windowTabs.filter(i => i.windowId !== activeTab)
      const updateWindowId = otherWindows[0]?.windowId || null
      this.updateWindow(updateWindowId, otherWindows)
      TabUtils.toggleWindow(updateWindowId)
    }
  }

  deleteTab = tabIds => {
    const { windowTabs, activeTab } = this.state
    windowTabs.forEach(i => {
      if (i.windowId === activeTab) {
        i.tabs = i.tabs.filter(t => !tabIds.includes(t.id))
      }
    })
    return windowTabs
  }

  // 更新窗口数据
  updateWindow = (winId, windowTabs) => {
    const tabs = windowTabs.find(i => i.windowId === winId)?.tabs || []
    const windowSortList = convertTabsData(tabs) // 以域名排序的sort
    let hasCombineDomain = judgeCombineDomain(windowSortList) // 是否有折叠域名
    this.setState({
      currentWindowTab: windowSortList,
      activeTab: winId,
      windowTabs,
      hasCombineDomain,
    })
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
  // onSwitchChange = val => {}

  // 基础操作
  onOperationClick = async val => {
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
        this.props.navigate('/popup/todoKeys')
        break
      case 'create-tag':
        if (!this.state.isLogin) {
          alert('请先登录再使用此功能')
          return
        }
        this.props.navigate('/popup/urlGroup')
        break
      case 'later':
        this.props.navigate('/popup/later')
        break
      case 'login':
        const loginWindowId = await storageUtils.getStorageItem('loginWindowId')
        TabUtils.toggleWindow(Number(loginWindowId) || 1, { focus: true, drawAttention: true }).catch(() => {
          const left = window.screen.width - 40 - 300
          const properties = { url: 'pages/login.html', left, top: 100, width: 300, height: 400, type: 'popup' }
          TabUtils.createNewWindow(properties, async window => {
            storageUtils.setStorageItem('loginWindowId', window.id)
          })
        })
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

  // 合并当前窗口的tab
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
    const { windowTabs } = this.state
    const curWindowId = await TabUtils.getCurrentWindowId()
    const otherWindowIds = windowTabs.filter(i => i.windowId !== curWindowId).map(i => i.windowId)
    if (otherWindowIds?.length) {
      let otherTabs = []
      windowTabs.forEach(i => {
        if (i.windowId !== curWindowId) {
          otherTabs = [...otherTabs, ...i.tabs]
        }
      })
      const moveTabIds = otherTabs.map(i => i.id)
      await TabUtils.moveTabs(moveTabIds, { index: -1, windowId: curWindowId })
      this.getAllWindows()
    }
  }

  // 获取所有标签
  getAllBookMarks = () => {
    bookMarksUtils.getAllBookMarks().then(bookMarks => {
      const marksData = bookMarks[0].children || []
      Store.dispatch({
        type: 'get_bookmarks',
        payload: marksData,
      })
    })
  }

  // 获取所有tabs
  async getAllWindows() {
    const ajaxArray = [TabUtils.getAllWindow(), TabUtils.getTabLists(), TabUtils.getCurrentWindowId(), TabUtils.getCurrentTab()]
    const [windows, allTabs, curWindowId, curTabData] = await Promise.all(ajaxArray)
    const windowNames = (await storageUtils.getStorageItem('windowName')) || {}

    const windowTabs = [] // 所有窗口数据
    let activeWindowTabs = [] // 活跃窗口数据

    windows.forEach(win => {
      const parentId = win.id
      const isActiveWindow = parentId === curWindowId

      const currentTabsAll = allTabs.filter(i => i.windowId === parentId)
      if (isActiveWindow) activeWindowTabs = currentTabsAll // 当前窗口Tab数据

      // TODO 处理无痕模式
      // TODO 当前窗口挪到第一位
      const windowName = isActiveWindow ? `当前窗口` : `其他窗口`
      const windowInfo = {
        isActiveWindow: isActiveWindow,
        name: windowNames[String(parentId)] || windowName,
        windowId: parentId,
        isEdit: false,
        icon: currentTabsAll[0].favIconUrl,
        tabs: currentTabsAll,
      }
      windowTabs.push(windowInfo)
    })
    const windowSortList = convertTabsData(activeWindowTabs) // sort按域名排序
    let hasCombineDomain = judgeCombineDomain(windowSortList) // 是否有折叠域名
    // 窗口按钮判断
    this.setState({
      windowTabs: windowTabs,
      curTabData,
      activeTab: curWindowId,
      hasCombineDomain: hasCombineDomain,
      currentWindowTab: windowSortList,
    })
  }

  // 窗口重命名
  editWindow = (e, data) => {
    e.stopPropagation()
    const { windowTabs } = this.state
    windowTabs.forEach(win => {
      if (win.windowId === data.windowId) {
        win.isEdit = true
      }
    })
    this.setState({
      windowTabs,
    })
  }
  // 修改窗口名称
  updateWindowName = (e, wind) => {
    const name = e?.target?.value?.trim() || ''
    const { windowTabs } = this.state
    const updateId = wind.windowId
    windowTabs.forEach(async win => {
      if (win.windowId === updateId) {
        if (name) {
          win.name = name
          // 改名存本地，浏览器销毁清楚数据
          const windowNames = (await storageUtils.getStorageItem('windowName')) || {}
          windowNames[updateId] = name
          storageUtils.setStorageItem('windowName', windowNames)
        }
        wind.isEdit = false
      }
    })
    this.setState({
      windowTabs,
    })
  }
  // 设置弹窗状态
  setPopVisible = (type, visible) => {
    this.setState({
      [type]: visible,
    })
  }

  confirmout = async () => {
    await storageUtils.removeStorageItem('token')
    Store.dispatch({
      type: 'get_user',
      payload: {
        collectUrls: [],
      },
    })
  }
  render() {
    const { windowTabs, bookMarkPopShow, bookMarkItem, curTabData, activeTab, expandkeys, collectUrls, isLogin, currentWindowTab } = this.state
    const userInfo = this.state.userinfo?.userinfo || {}
    return (
      <div className='home-wrapper'>
        {/* 搜索当前窗口 */}
        <div className='search-wrapper flex-x-start flex-y-center'>
          <Search placeholder='请输入Tab名称或者网址链接' allowClear enterButton='搜索' className='flex' onSearch={this.onSearch} />
          {/* TODO 开放所有tab搜索 */}
          {
            <div className='user flex-mcenter'>
              {isLogin ? (
                <Popconfirm onConfirm={this.confirmout} description={`确定要退出${userInfo.mail}吗？`} okText='Yes' cancelText='No'>
                  <UserSwitchOutlined className='avatar' size='large' />
                </Popconfirm>
              ) : (
                <UserAddOutlined className='avatar' size='large' onClick={() => this.onOperationClick({ key: 'login' })} />
              )}
            </div>
          }
          {/* <Switch onChange={this.onSwitchChange} /> */}
        </div>
        {/* 操作按钮 */}
        {/* <Button onClick={this.clearData}></Button> */}

        {this.operationBtns
          .filter(btn => btn.visible)
          .map(btn => {
            return (
              <Button key={btn.key} size='small' icon={btn.icon} className='combine-btn' onClick={() => this.onOperationClick(btn)}>
                <Badge size='small' dot={btn.count > 0} color='red'>
                  {btn.label}
                </Badge>
              </Button>
            )
          })}
        {/* 窗口Tabs */}

        <Tabs
          onEdit={this.onEdit}
          type='editable-card'
          defaultActiveKey={windowTabs[0]?.windowId}
          activeKey={activeTab}
          items={windowTabs?.map((i, index) => {
            return {
              label: (
                <div className='flex-x-start' key={index}>
                  {!i.isEdit ? (
                    <span className='flex-x-start flex-y-center tab' onDoubleClick={e => this.editWindow(e, i)}>
                      <i className={i.isActiveWindow ? 'dot' : ''}></i> {i.name}
                    </span>
                  ) : (
                    <Input
                      className='edit-input'
                      placeholder={i.name}
                      allowClear
                      maxLength={5}
                      key={i.windowId}
                      onBlur={() => {
                        this.updateWindowName({}, i)
                      }}
                      onPressEnter={e => {
                        this.updateWindowName(e, i)
                      }}
                    />
                  )}
                  {!i.isEdit ? <Badge size='small' color='#ff3838' count={i.tabs.length}></Badge> : <></>}
                </div>
              ),
              key: i.windowId,
            }
          })}
          onChange={this.onChange}
        ></Tabs>
        {/* 列表 */}
        <div className='list-content'>
          {Boolean(Object.entries(currentWindowTab)?.length) && (
            <Collapse
              activeKey={expandkeys}
              expandIcon={({ isActive }) => {
                return isActive ? <CaretDownOutlined /> : <CaretRightOutlined />
              }}
              onChange={this.collapseChange}
              items={Object.entries(currentWindowTab).map(([domain, domainValues]) => {
                const overTabOne = domainValues.tabs.length > 1
                return {
                  key: domain,
                  collapsible: !overTabOne ? 'disabled' : 'header',
                  showArrow: overTabOne,
                  label: overTabOne ? (
                    <div className='flex-x-between flex-y-center collap-header domain-header'>
                      <img
                        src={domainValues.tabs[0].favIconUrl}
                        onError={e => {
                          e.target.onerror = null
                          e.target.src = '/logo.png'
                        }}
                        alt={domainValues.tabs[0].title}
                        className='domain-icon'
                      />
                      <div className='title content-info flex flex-x-start flex-y-center'>
                        {domain}({domainValues.tabs.length})
                      </div>
                      <DeleteOutlined className='domain-delete' onClick={e => this.onDomainTabDelete(e, domain, domainValues)} />
                    </div>
                  ) : (
                    <DomainOne
                      tabData={domainValues.tabs[0]}
                      favorUrls={collectUrls}
                      domain={domain}
                      curTabData={curTabData}
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
                          curTabData={curTabData}
                          key={tab.id}
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
        </div>
        {activeTab && String(activeTab).includes('templId') && <CreateNewWindow></CreateNewWindow>}
        {bookMarkPopShow && (
          <BookMarkPop
            isVisible={bookMarkPopShow}
            tabData={bookMarkItem}
            toggleModal={() => {
              this.setState({ bookMarkPopShow: false })
            }}
            createBookMarks={this.createBookMarksCb}
          ></BookMarkPop>
        )}
      </div>
    )
  }
}

export default withNavigation(Home)
