import './index.less'
import {Tabs,List } from 'antd'
import React from 'react'
import {DeleteOutlined} from '@ant-design/icons'
import {mockWindowsData,mockTabsData} from '@/api/popup.js'

// TODO 抽出一个类的实现
// TODO build 切换api；为mock数据

class Home extends React.Component{
    constructor(props){
        super(props)
        console.error('sper')
        this.state = {
            activeTab:'1',
            windowTabs:[],
            currentWindowTab:[]
        }
    }
    // 关闭窗口
    
    onEdit = (targetKey, action)=>{
        let {windowTabs,currentWindowTab} = this.state
        console.error('targetKey', targetKey, action)
        if(action === 'remove'){
            windowTabs = windowTabs.filter(i=>i.windowId === targetKey)
            this.setState({
                windowTabs,
                currentWindowTab:windowTabs[0],
                activeKey: windowTabs[0].windowId
            })
        } else {
           // TODO 新增
        }
    }
    onChange = (winId)=>{
        console.error('切换tab', winId)
        
        const {windowTabs} = this.state
        const windowOne = windowTabs.find(i=>i.windowId === winId)?.tabs ||[]
        console.error('windowTabs',windowTabs)
        this.setState({
            currentWindowTab: windowOne
        })
        console.error(windowOne)
    }
    tabClick = async (tab)=>{
        console.error('tabClick', tab)
        await chrome.tabs.move(tab.id, {index: 0});
    }
    // 获取所有tabs
    async getAllWindows (){
        // TODO mock
        const windows = await chrome.windows.getAll({})
        const allTabs = await chrome.tabs.query({})
        // const windows = mockW
        
        const windowMap = {}
        const windowTabs = []
        windows.forEach((win,winIdx) => {
            const parentId = win.id
            const tabs = allTabs.filter(i=> i.windowId === parentId)
            // TODO 无痕模式
            const windowInfo = {
                isCurrent: win.focused,
                name: `窗口-${winIdx}`,
                windowId: parentId,
                tabs
            }
            if(win.focused){
                this.setState({
                    activeTab: parentId,
                    currentWindowTab: tabs
                })
            }
            // TODO 删除map
            windowMap[parentId]= windowInfo
            windowTabs.push(windowInfo)

        });
        this.setState({
            windowTabs: windowTabs
        })
       console.error('windowTabs',windowTabs)
    }
    render (){
        const {windowTabs,activeTab,currentWindowTab} = this.state
        return (
            <div className='home-wrapper'>
                <Tabs type="editable-card" onEdit={this.onEdit} closable defaultActiveKey={windowTabs[0]?.windowId} activeKey={activeTab} items={windowTabs?.map((i)=>{
                    return {label: i.name, key: i.windowId}
                })} onChange={this.onChange} >
                </Tabs>
                {currentWindowTab.map((tab,tabIdx)=>{
                    return (
                        <div className="tab-one flex-y-center flex-x-between" onClick={this.tabClick(tab)} key={tabIdx}>
                            <div className='title app-oneline'>{tab.title}</div>
                            <div className='action flex-x-end'>
                            <DeleteOutlined  twoToneColor="#eb2f96"/>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
    componentDidMount(){
        this.getAllWindows()
    }
}

export default Home