import './index.less'
import {Tabs} from 'antd'
import React from 'react'


class Home extends React.Component{
    constructor(props){
        super(props)
        console.error('sper')
        this.state = {
            activeTab:'1',
            windowTabs:[]
        }
    }
    onChange(e){
        console.error('切换tab', e)
    }
    // 获取所有tabs
    async getAllWindows (){
        const windows = await chrome.windows.getAll({})
        const allTabs = await chrome.tabs.query({})
        const windowMap = {}
        const windowTabs = []
        console.error('windows', windows)
        console.error('tabs',allTabs)
        windows.forEach((win,winIdx) => {
            const parentId = win.id
            const tabs = allTabs.filter(i=> i.windowId === parentId)
            // TODO 无痕模式
            const windowInfo = {
                isCurrent: win.focused,
                label: `窗口${winIdx}`,
                value: parentId,
                tabs
            }
            if(win.focused){
        this.activeTab  = parentId
            }
            windowMap[parentId]= windowInfo
            windowTabs.push(windowInfo)

        });
        this.windowTabs = windowTabs
       console.error(windowMap)
    }
    render (){
        return (
            <div>
                <div>`1`</div>
                <Tabs defaultActiveKey={this.activeTab} items={this.windowTabs} onChange={this.onChange} />
                <div>end</div>
            </div>
        )
    }
    componentDidMount(){
        this.getAllWindows()
        console.error('componentDidMount')
    }
}

export default Home