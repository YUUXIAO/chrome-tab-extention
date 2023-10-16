import "./index.less"
import { Tabs, Input, Collapse, Space, Switch } from "antd"
import React from "react"
import { DeleteOutlined } from "@ant-design/icons"
import { mockWindowsData, mockTabsData } from "@/api/popup.js"
import ChromeUtils from "@/apiUtils.js"
import { extractDomain, updateDomainData, convertTabsData } from "@/utils"

const { Search } = Input
// TODO 抽出一个类的实现
// TODO build 切换api；为mock数据

class Home extends React.Component {
  constructor(props) {
    super(props)
    console.error("sper")
    this.state = {
      activeTab: "1",
      windowTabs: [],
      currentWindowTab: []
    }
  }
  // 关闭窗口
  onEdit = (targetKey, action) => {
    let { windowTabs, currentWindowTab } = this.state
    console.error("targetKey", targetKey, action)
    if (action === "remove") {
      // 删除窗口所有tab
      // const tabIds = currentWindowTab.tabs.map((i) => i.id)
      // ChromeUtils.deleteTab(tabIds)
      const targetWindow = windowTabs.find((i) => i.windowId === targetKey)
      const tabIds = targetWindow.map((i) => i.id)
      ChromeUtils.deleteTab(tabIds)
      this.setState({
        windowTabs,
        currentWindowTab: convertTabsData(windowTabs[0].tabs),
        activeKey: windowTabs[0].windowId
      })
    } else {
      // TODO 新增
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

    // chrome.windows.update(tab.windowId, { focused: true });
    // chrome.tabs.highlight({ tabs: tab.index, windowId: tab.windowId });
    // TODO mock
    ChromeUtils.toggleTab(tab)
  }
  // 删除单个tab
  onTabDelete = (tab, domain, domainValues) => {
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
  // 获取所有tabs
  async getAllWindows() {
    // TODO mock
    // const windows = await ChromeUtils.getAllWindow()
    // const allTabs = await ChromeUtils.getTabLists()
    const windows = mockWindowsData
    const allTabs = mockTabsData

    const windowMap = {}
    const windowTabs = []
    let currentTabs = []
    windows.forEach((win, winIdx) => {
      const parentId = win.id
      currentTabs = allTabs.filter((i) => i.windowId === parentId)
      // TODO 无痕模式
      const windowInfo = {
        isCurrent: win.focused,
        name: `窗口-${winIdx}`,
        windowId: parentId,
        tabs: currentTabs
      }
      //   console.error("窗口", win)

      if (win.focused) {
        this.setState({
          activeTab: parentId
        })
      }
      // TODO 删除map
      windowMap[parentId] = windowInfo
      windowTabs.push(windowInfo)
    })

    const windowSortList = convertTabsData(currentTabs) // 以域名排序的sort
    this.setState({
      windowTabs: windowTabs,
      currentWindowTab: windowSortList
    })
    console.error("windowTabs", windowTabs)
  }
  render() {
    const { windowTabs, activeTab, currentWindowTab } = this.state
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
        {/* <div className='list-wrapper'> */}
        {/* <Space direction="vertical"> */}
        {Object.entries(currentWindowTab).map(([domain, domainValues]) => {
          return (
            <Collapse
              accordion
              key={domain}
              items={[
                {
                  key: domain,
                  label: domain,
                  children: domainValues.tabs.map((tab, tabIdx) => {
                    return (
                      <div
                        key={tab.id}
                        className="tab-one flex-y-center flex-x-between"
                        onClick={this.tabClick}
                      >
                        {/* onMouseEnter={this.handleMouse(true, tab)}
                        onMouseLeave={this.handleMouse(false, tab)} */}
                        <div>
                          <img
                            alt={tab.url}
                            className="icon"
                            src={tab.favIconUrl || ""}
                          ></img>
                          {tab.title}
                        </div>
                        {this.state.mouseTabId === tab.id ? (
                          <DeleteOutlined
                            onClick={this.onTabDelete(
                              tab,
                              domain,
                              domainValues
                            )}
                          />
                        ) : null}
                      </div>
                    )
                  })
                }
              ]}
            />
          )
        })}
        {/* </Space> */}
      </div>
      // </div>
    )
  }
  componentDidMount() {
    this.getAllWindows()
  }
}

export default Home
