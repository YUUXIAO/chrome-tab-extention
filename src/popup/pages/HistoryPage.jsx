import React, { useEffect, useState } from 'react'
import { Select, Checkbox } from 'antd'
import { ExportOutlined, FolderAddOutlined, ImportOutlined } from '@ant-design/icons'
import { getTodoKeys, deleteTodoKeys, updateTodoKeys } from '@/api/user'
import { getUpdateTime, dealTime } from '@/utils'
import HistoryUtils from '@/extentionUtils/HistoryUtils.js'
import tabUtils from '@/extentionUtils/tabUtils.js'
import Store from '@/store/index'
import BtnPopover from '../components/btnPopover'

import './latePage.less'
import './history.less'

const CheckboxGroup = Checkbox.Group

const buttonGroups = [
  {
    name: '按照访问量排序（一个月）',
    key: 'visitCount',
  },
  {
    name: '时间最近',
    key: 'lastest',
  },
  {
    name: '按照内容搜索',
    key: 'keyword',
  },
]

function combineToWindow(props) {
  console.error('移动窗口', props)
}

function HistoryPage() {
  const [historyData, setHistory] = useState([])
  const [checkList, setCheckList] = useState([])
  const [pageParams, setPageParams] = useState({
    pageNo: 1,
    pageSize: 10,
  })
  const getHistoryData = type => {
    // TODO 设置时间选项
    const query = { maxResults: pageParams.pageSize, startTime: new Date().getTime() - 24 * 3600 * 1000, endTime: new Date().getTime(), text: '' }
    HistoryUtils.getHistory(query).then(res => {
      console.error('获取历史记录', res)
      if (type === 'visitCount') {
        const result = res.sort(function (a, b) {
          return b.visitCount - a.visitCount
        })
        setHistory(result)
      }
      // setHistory(res)
    })
  }
  useEffect(() => {
    getHistoryData('visitCount')
  }, [])

  // 切换搜索条件
  const toggleSearchParams = btn => {
    const { key } = btn
    const resetParams = {
      pageNo: 1,
      pageSize: 10,
    }
    setPageParams({ ...pageParams, ...resetParams })
    switch (key) {
      case 'visitCount':
        getHistoryData(key)
        break
      default:
        break
    }
  }

  // 选择操作
  const checkAll = checkList.length === historyData.length // 全选状态
  const indeterminate = checkList.length > 0 && checkList.length < historyData.length
  const toggleSelectAll = e => {
    const checked = e.target.checked
    const selectAllIds = historyData.map(i => i.id)
    setCheckList(checked ? selectAllIds : [])
  }
  const toggleCheck = checkValues => {
    setCheckList(checkValues)
  }

  // 新窗口打开
  const openWindow = () => {
    const urls = historyData.filter(i => checkList.includes(i.id)).map(i => i.url)
    const params = {
      url: urls,
    }
    tabUtils.createNewWindow(params)
  }
  // 移动到窗口
  const combineToWindow = () => {}

  useEffect(() => {
    tabUtils.getAllWindow().then(res => {
      setCurrentWindows(res)
    })
  }, [])
  const [currentWindows, setCurrentWindows] = useState([])

  return (
    <div className='later-page'>
      {/* 按钮筛选区域 */}
      <div className='btn-groups flex-x-start flex-y-center'>
        {buttonGroups.map(btn => {
          return (
            <div className='sort-btn flex-center' key={btn.key} onClick={() => toggleSearchParams(btn)}>
              {btn.name}
            </div>
          )
        })}
        {/* 全选按钮 */}
        <Checkbox indeterminate={indeterminate} onChange={toggleSelectAll} checked={checkAll}>
          全选
        </Checkbox>
      </div>
      {/* 列表操作区域 */}
      <div className='list-operation flex-x-between flex-y-center'>
        <span className='flex-x-start'>
          总数：{historyData.length}/{checkList.length}
        </span>
        <div className='operation'>
          {/* 窗口批量打开 */}
          <ExportOutlined onClick={openWindow} title='窗口批量打开' />
          {/* 移动到窗口 */}
          <ImportOutlined onClick={combineToWindow} />
          {/* <BtnPopover title='移动到窗口' content={currentWindows} config={{ key: 'id' }}></BtnPopover> */}
          {/* 标签组 */}
          <FolderAddOutlined />
        </div>
      </div>
      {/* 列表区域 */}
      <CheckboxGroup onChange={toggleCheck} value={checkList}>
        <div className='flex-dir-column' style={{ with: '100%' }}>
          {historyData.map(i => {
            return (
              <div key={i.id} className='history-item flex-x-start flex-y-center'>
                <div className='flex-x-start'>
                  <Checkbox value={i.id}></Checkbox>
                  <span className='title ml10'>{i.title}</span>
                </div>
                <span className='visit-count flex-center'>{i.visitCount}</span>
              </div>
            )
          })}
        </div>
      </CheckboxGroup>
    </div>
  )
}
export default HistoryPage
