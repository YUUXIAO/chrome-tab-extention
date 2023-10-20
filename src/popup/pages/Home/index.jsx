import "./index.less"
import { Tabs, Input, Collapse, Space, Switch, Button } from "antd"
import React from "react"
import { DeleteOutlined, StarOutlined, StarFilled } from "@ant-design/icons"
import { mockWindowsData, mockTabsData } from "@/api/popup.js"
import ChromeUtils from "@/apiUtils.js"
import { updateDomainData, deleteDomainData, convertTabsData } from "@/utils"
import CreateNewWindow from "../components/createNewWindow"
import Store from "@/store/index"
import TabPane from "antd/es/tabs/TabPane"

const { Search } = Input
// TODO 抽出一个类的实现
// TODO build 切换api；为mock数据

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: "1",
      windowTabs: [],
      currentWindowTab: [],
      // 收藏信息
      favorUrlMaps: [],
      favorUrls: new Set()
    }
  }
  componentDidMount() {
    this.getAllWindows()
    console.error("stroe", Store.getState())
    const userStore = Store.getState().user
    Store.subscribe(() => {
      this.setState({
        favorUrlMaps: userStore.favorUrlMaps,
        favorUrls: userStore.favorUrls
      })
    })
    console.error(111, this.state.favorUrlMaps)
  }
  // 关闭窗口
  // TODO 抽取刷新currentWindowTab、windowDomain、activeTab的方法
  onEdit = (targetKey, action) => {
    let { windowTabs } = this.state
    console.error("targetKey", targetKey, action)
    if (action === "remove") {
      // 删除窗口所有tab
      // const tabIds = currentWindowTab.tabs.map((i) => i.id)
      // ChromeUtils.deleteTab(tabIds)
      const targetWindow = windowTabs.find((i) => i.windowId === targetKey)
      const tabIds = targetWindow.tabs.map((i) => i.id)
      ChromeUtils.deleteTab(tabIds)
      this.setState({
        windowTabs,
        currentWindowTab: convertTabsData(windowTabs[0].tabs),
        activeKey: windowTabs[0].windowId
      })
    } else {
      // TODO 新增窗口
      console.error("新增窗口")
      const targetWindow = windowTabs.find(
        (i) => i.windowId === this.state.activeTab
      )
      console.error("targetWindow", targetWindow)
      const newWindowData = {
        name: `新增窗口-${windowTabs.length - 1}`,
        tabs: [],
        // isCurrent: true,
        windowId: `templId-${windowTabs.length}`
      }
      windowTabs.push(newWindowData)
      this.setState({
        windowTabs,
        activeTab: `templId-${windowTabs.length - 1}`,
        currentWindowTab: convertTabsData([])
      })
    }
  }
  onChange = (winId) => {
    console.error("切换tab", winId)

    const { windowTabs } = this.state
    const tabs = windowTabs.find((i) => i.windowId === winId)?.tabs || []
    const windowSortList = convertTabsData(tabs) // 以域名排序的sort
    console.error("windowTabs", windowTabs)
    this.setState({
      currentWindowTab: windowSortList,
      activeTab: winId
    })
  }
  // 切换tab
  tabClick = (e, tab) => {
    console.error("tabClick", e, tab)
    e.stopPropagation()
    ChromeUtils.toggleTab(tab, this.state.activeTab)
  }
  // 收藏tab
  onTabCollect = (e, tab) => {
    e.stopPropagation()
    const { url } = tab
    const hasFavor = this.state.favorUrls.has(url)
    console.error("是否已收藏---", hasFavor)
    if (hasFavor) {
      Store.dispatch({
        type: "favor_reduce",
        payload: tab
      })
    } else {
      Store.dispatch({
        type: "favor_add",
        payload: tab
      })
    }
    // const hasCollected = mockUserCollect.
  }
  // 删除单个tab
  onTabDelete = (e, tab, domain, domainValues) => {
    e.stopPropagation()
    ChromeUtils.deleteTab(tab.id)
    // domainValues 如果该域名下的数据全部删除了要更新列表
    // 更新域名下的数据
    const updateWindowData = updateDomainData(
      tab,
      domain,
      domainValues,
      this.state.currentWindowTab
    )
    this.setState({
      currentWindowTab: updateWindowData
    })
  }
  // 删除一组tab
  onDomainTabDelete = (e, domain, tabs) => {
    e.stopPropagation()
    tabs.forEach((tab) => {
      ChromeUtils.deleteTab(tab.id)
    })
    // 更新域名下的数据
    const updateWindowData = deleteDomainData(
      domain,
      this.state.currentWindowTab
    )
    this.setState({
      currentWindowTab: updateWindowData
    })
  }
  // 搜索当前窗口
  onSearch = (keyword) => {
    let result = []
    const { windowTabs, activeTab } = this.state
    console.error("搜索当前窗口", keyword, activeTab)
    console.error("allTabs", windowTabs)
    const allTabs =
      windowTabs.find((i) => {
        return i.windowId === activeTab
      })?.tabs || []
    if (keyword) {
      result = allTabs.filter((i) => {
        return i.title.includes(keyword)
      })
    } else {
      console.error(windowTabs)
      console.error(activeTab)
      result = allTabs || []
    }
    const windowSortList = convertTabsData(result) // 以域名排序
    this.setState({
      currentWindowTab: windowSortList
    })
  }
  // tab 鼠标移入移出
  handleMouse = (val, tab) => {
    console.error("鼠标移入移出")
    const id = val ? tab.id : null
    this.setState({
      mouseTabId: id
    })
  }
  // TODO 切换 switch
  onSwitchChange = (val) => {}

  // 窗口合并
  windowsCombine = async () => {
    const { windowTabs, activeTab } = this.state
    console.error("allTabs", mockTabsData)
    const allTabs = await ChromeUtils.getTabLists()
    const curWindowId = await ChromeUtils.getCurrentWindowId()
    // const allTabs = mockTabsData
    const otherWindowIds = windowTabs
      .filter((i) => i.windowId !== curWindowId)
      .map((i) => i.windowId)

    if (otherWindowIds?.length) {
      // const windowSortList = convertTabsData(allTabs) // 以域名排序的sort
      // 删除其他window
      // otherWindowIds.map((i) => ChromeUtils.deleteWindow(i.id))
      console.error("otherWindowIds", otherWindowIds)
      let otherTbas = []
      windowTabs.forEach((i) => {
        if (i.windowId !== curWindowId) {
          otherTbas = [...otherTbas, ...i.tabs]
        }
      })
      console.error("otherTbas", otherTbas)
      otherTbas.forEach((tab) => {
        const createProperties = {
          windowId: curWindowId,
          url: tab.url
        }
        ChromeUtils.createNewTab(createProperties)
      })

      otherWindowIds.map((i) => ChromeUtils.deleteWindow(i.id))
    } else {
      alert("当前只有一个窗口，不能进行合并")
    }
    this.getAllWindows()
  }
  // 获取所有tabs
  async getAllWindows() {
    // TODO mock
    // const ajaxArray = [
    //   ChromeUtils.getAllWindow(),
    //   ChromeUtils.getTabLists(),
    //   ChromeUtils.getCurrentWindowId()
    // ]
    // const [windows, allTabs, curWindowId] = await Promise.all(ajaxArray)

    const windows = mockWindowsData
    const allTabs = mockTabsData
    const curWindowId = ""
    console.error("谷歌api获取窗口信息", windows)
    console.error("谷歌api获取tab信息", allTabs)

    const windowMap = {}
    const windowTabs = []
    let currentTabs = []
    windows.forEach((win, winIdx) => {
      const parentId = win.id
      currentTabs = allTabs.filter((i) => i.windowId === parentId)
      // TODO 无痕模式
      const windowInfo = {
        // isCurrent: win.focused,
        name: `窗口-${winIdx}`,
        windowId: parentId,
        tabs: currentTabs
      }
      //   console.error("窗口", win)

      // TODO 删除map
      windowMap[parentId] = windowInfo
      windowTabs.push(windowInfo)
    })

    const windowSortList = convertTabsData(currentTabs) // 以域名排序的sort
    this.setState({
      windowTabs: windowTabs,
      activeTab: curWindowId,
      currentWindowTab: windowSortList
    })

    console.error("windowTabs", windowTabs)
    console.error("windowSortList", windowSortList)
  }
  render() {
    const { windowTabs, activeTab, favorUrls, currentWindowTab } = this.state
    return (
      <div className="home-wrapper">
        {/* 搜索当前窗口 */}
        <div className="search-wrapper flex-x-start flex-y-center">
          <Search
            placeholder="请输入Tab名称"
            allowClear
            enterButton="搜索"
            size="large"
            onSearch={this.onSearch}
          />
          {/* 开放所有tab搜索 */}
          <Switch onChange={this.onSwitchChange} />
        </div>
        {/* 合并所有窗口到一个窗口下 */}
        {
          <Button type="primary" onClick={this.windowsCombine}>
            合并所有窗口
          </Button>
        }
        {/* 窗口Tabs */}
        <Tabs
          type="editable-card"
          onEdit={this.onEdit}
          defaultActiveKey={windowTabs[0]?.windowId}
          activeKey={activeTab}
          items={windowTabs?.map((i) => {
            return { label: i.name, key: i.windowId }
          })}
          onChange={this.onChange}
        ></Tabs>
        {/* 列表 */}
        {Object.entries(currentWindowTab)?.length ? (
          Object.entries(currentWindowTab).map(([domain, domainValues]) => {
            return (
              <Collapse
                accordion
                key={domain}
                items={[
                  {
                    key: domain,
                    label: (
                      <div className="flex-x-between flex-y-center">
                        {domain}
                        <DeleteOutlined
                          onClick={(e) =>
                            this.onDomainTabDelete(e, domain, domainValues.tabs)
                          }
                        />
                      </div>
                    ),
                    children:
                      domainValues.tabs.length &&
                      domainValues.tabs.map((tab, tabIdx) => {
                        return (
                          <div
                            key={tab.id}
                            className="tab-one flex-y-center flex-x-between"
                            onClick={(e) => this.tabClick(e, tab)}
                          >
                            {/* onMouseEnter={this.handleMouse(true, tab)}
                      onMouseLeave={this.handleMouse(false, tab)} */}
                            <div className="flex-x-start">
                              <img
                                alt=""
                                className="icon"
                                src={tab.favIconUrl || ""}
                              ></img>
                              {tab.title}
                            </div>
                            <div className="action flex-x-start">
                              {/* 收藏按钮 */}
                              {favorUrls.has(tab.url) ? (
                                <StarFilled
                                  style={{ color: "#eebe77" }}
                                  onClick={(e) => this.onTabCollect(e, tab)}
                                />
                              ) : (
                                <StarOutlined
                                  onClick={(e) => this.onTabCollect(e, tab)}
                                />
                              )}
                              {/* 删除按钮 */}
                              <DeleteOutlined
                                onClick={(e) =>
                                  this.onTabDelete(e, tab, domain, domainValues)
                                }
                              />
                            </div>
                          </div>
                        )
                      })
                  }
                ]}
              />
            )
          })
        ) : (
          // 创建新Window
          <CreateNewWindow></CreateNewWindow>
        )}
      </div>
    )
  }
}

export default Home
