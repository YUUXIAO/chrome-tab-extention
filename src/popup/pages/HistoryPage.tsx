import React, { useEffect, useState } from 'react'
import { ExportOutlined, FolderAddOutlined, ImportOutlined, SearchOutlined } from '@ant-design/icons'
import { Select, Checkbox, Input } from 'antd'
import type { SearchProps } from 'antd/es/input/Search'
import { getTodoKeys, deleteTodoKeys, updateTodoKeys } from '@/api/user'
import { getUpdateTime, dealTime } from '@/utils'
import HistoryUtils from '@/extentionUtils/HistoryUtils.js'
import tabUtils from '@/extentionUtils/tabUtils.js'
import Store from '@/store/index'
import BtnPopover from '../components/btnPopover'

import './latePage.less'
import './history.less'

const CheckboxGroup = Checkbox.Group
const { Search } = Input

const buttonGroups = [
  {
    name: '按照访问量排序（一个月）',
    key: 'visitCount',
  },
  {
    name: '时间最近',
    key: 'lastest',
  },
  // {
  //   name: '按照内容搜索',
  //   key: 'keyword',
  // },
]

const quickySort = [
  {
    name: '时间排序：',
    key: 'timeSort',
    list: [
      { key: 'week', name: '本周' },
      { key: 'month', name: '本月' },
      { key: 'year', name: '今年' },
      { key: 'lastWeek', name: '最近一周' },
      { key: '10Days', name: '最近十天' },
      { key: 'lastMonth', name: '最近一月' },
      { key: '3Months', name: '最近三月' },
    ],
  },
  {
    name: '访问次数：',
    key: 'countSort',
    list: [
      { key: 'mostVisit', name: '最多访问' },
      { key: 'lastVisit', name: '最近访问' },
      { key: 'last100', name: '最近100条' },
    ],
  },
  {
    name: '历史搜索：',
    key: 'historySort',
    list: [],
  },
]

function combineToWindow(props) {
  console.error('移动窗口', props)
}

function HistoryPage() {
  const [historyData, setHistory] = useState([])
  const [checkList, setCheckList] = useState([])
  const [keyword, setKeywordVal] = useState('') // 搜索关键词
  const filterMaps = new Map()
  const [filters, setFilters] = useState([]) // 当前选中的条件
  const [quickySortList, setQuickSort] = useState(quickySort)
  const [pageParams, setPageParams] = useState({
    pageNo: 1,
    pageSize: 100,
  })
  const getHistoryData = (params: string | object) => {
    // TODO 设置时间选项
    const baseQuery = { maxResults: pageParams.pageSize, startTime: new Date().getTime() - 24 * 3600 * 1000, endTime: new Date().getTime(), text: '' }
    if (typeof params === 'string') {
      HistoryUtils.getHistory(baseQuery).then(res => {
        console.error('获取历史记录', res)
        if (params === 'visitCount') {
          const result = res.sort(function (a, b) {
            return b.visitCount - a.visitCount
          })
          setHistory(result)
        }
        // setHistory(res)
      })
    } else {
      // 按照关键词搜索
      const combineQuery = Object.assign({}, baseQuery, params)
      HistoryUtils.getHistory(combineQuery).then(res => {
        console.error('获取历史记录', res)
        setHistory(res)
      })
    }
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

  // 关键词搜索
  // const onKeywordChange = e => {
  //   setKeywordVal(e.target.value)
  // }
  const onKeywordEnter = e => {
    // setKeywordVal(e.target.value)
    getHistoryData({ text: e.target.value })
  }
  // 点击快捷搜索
  // TODO 单独走hooks
  const timeSortMaps = new Map([
    ['week', 7],
    ['month', 30],
    ['year', 365],
    ['lastWeek', 7],
    ['lastMonth', 30],
    ['lastYear', 365],
    ['10Days', 10],
  ])
  const quickyItemClick = (key, data) => {
    console.error('quickyItemClick----', key, data)
    const baseQuery = { maxResults: pageParams.pageSize, startTime: new Date().getTime() - 24 * 3600 * 1000, endTime: new Date().getTime(), text: '' }
    let combineQuery = {}
    // 计算当前所有选中项
    console.error(filterMaps)
    if (filterMaps.has(data.key)) {
      filterMaps.delete(data.key)
    } else {
      filterMaps.set(data.key, data)
    }
    setFilters(Array.from(filterMaps.keys())) // 更新选中项

    console.error('filters', filters)
    // 记录多选的列表
    if (filters.includes(data.key)) {
      filters.splice(filters.indexOf(data.key), 1)
    } else {
      filters.push(data.key)
    }
    // 合并所有筛选条件，查询记录
    switch (key) {
      case 'timeSort':
        combineQuery.startTime = new Date().getTime() - 24 * 3600 * 1000 * timeSortMaps.get(data.key)
        break
      case 'historySort': // 历史搜索
        break
      case 'countSort': // 访问次数
        if (data.key === 'mostVisit'); // 最多访问
        if (data.key === 'last10') combineQuery.maxResults = 10
        if (data.key === 'last100') combineQuery.maxResults = 100
        break
    }
    combineQuery = Object.assign({}, baseQuery, combineQuery)
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
      {/* <div className='btn-groups flex-x-start flex-y-center'>
        {buttonGroups.map(btn => {
          return (
            <div className='c-btn flex-center' key={btn.key} onClick={() => toggleSearchParams(btn)}>
              {btn.name}
            </div>s
          )
        })}
      </div> */}
      {/* 搜索关键词 */}
      <Input
        className='c-search-input'
        value={keyword}
        prefix={<SearchOutlined className='c-icon' />}
        placeholder='搜索'
        // onChange={onKeywordChange}
        onPressEnter={onKeywordEnter}
      />
      {/* 快捷搜索 */}
      {quickySortList.map(q => {
        return (
          <div className='quicky-row flex-x-start flex-y-center'>
            <span className='c-h3'>{q.name}</span>
            <div className='quicky-content'>
              {filters}
              {q.list.map(l => {
                return (
                  <span
                    className={['c-btn-transparent', filters.includes(l.key) ? 'active' : null].join(' ')}
                    key={l.key}
                    onClick={() => quickyItemClick(q.key, l)}
                  >
                    {l.name}
                  </span>
                )
              })}
            </div>
          </div>
        )
      })}
      {/* 列表操作区域 */}
      <div className='list-operation flex-x-between flex-y-center'>
        <div className='flex-x-start flex-y-center'>
          {/* 全选按钮 */}
          <Checkbox indeterminate={indeterminate} onChange={toggleSelectAll} checked={checkAll}>
            全选
          </Checkbox>
          <span className='flex-x-start'>
            总数：{historyData.length}/{checkList.length}
          </span>
        </div>
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
