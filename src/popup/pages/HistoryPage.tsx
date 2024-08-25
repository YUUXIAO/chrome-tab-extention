import React, { useRef, useEffect, useState } from 'react'
import { ExportOutlined, FolderAddOutlined, ImportOutlined, SearchOutlined, PauseOutlined, ScheduleOutlined } from '@ant-design/icons'
import type { DatePickerProps } from 'antd'
import { Affix, Checkbox, DatePicker, Input } from 'antd'
import type { SearchProps } from 'antd/es/input/Search'
import { getTodoKeys, deleteTodoKeys, updateTodoKeys } from '@/api/user'
import { getUpdateTime, dealTime } from '@/utils'
import HistoryUtils from '@/extentionUtils/HistoryUtils.js'
import tabUtils from '@/extentionUtils/tabUtils.js'
import Store from '@/store/index'
import BtnPopover from '../components/btnPopover'

import dayjs from 'dayjs'

import duration from 'dayjs/plugin/duration'
import arraySupport from 'dayjs/plugin/arraySupport'

import './latePage.less'
import './history.less'

dayjs.extend(duration)
dayjs.extend(arraySupport)
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
    type: 'category',
    list: [
      { key: 'today', name: '今天' },
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
    type: 'category',
    list: [
      { key: 'mostVisit', name: '最多访问' },
      { key: 'lastVisit', name: '最近访问' },
      { key: 'last100', name: '最近100条' },
      { key: 'last10', name: '最近10条' },
    ],
  },
  {
    name: '历史搜索：',
    key: 'historySort',
    type: 'category',
    list: [],
  },
]

function combineToWindow(props) {
  console.error('移动窗口', props)
}

function HistoryPage() {
  const dateScrollRef = useRef(null)
  const [historyData, setHistory] = useState([])
  const [checkList, setCheckList] = useState([])
  const [isAscNow, setSortCount] = useState(true)
  const [keyword, setKeywordVal] = useState('') // 搜索关键词
  const [filterMaps] = useState(
    new Map([
      ['timeSort', 'today'],
      ['countSort', 'last10'],
    ])
  )
  const [filters, setFilters] = useState(['last10', 'today']) // 当前选中的条件
  const [daysInMonth, setDaysInMonth] = useState([]) // 当月总共有几天
  const [quickySortList, setQuickSort] = useState(quickySort)
  const [pageParams, setPageParams] = useState({
    pageNo: 1,
    pageSize: 1000,
  })
  const getHistoryData = (params: string | object) => {
    // TODO 设置时间选项
    const baseQuery = {
      maxResults: pageParams.pageSize,
      startTime: new Date().getTime() - 24 * 3600 * 1000,
      endTime: new Date().getTime(),
      text: '',
    }
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
      // 按照关键词搜索/自定义搜索
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
  // const toggleSearchParams = btn => {
  //   const { key } = btn
  //   const resetParams = {
  //     pageNo: 1,
  //     pageSize: 10,
  //   }
  //   setPageParams({ ...pageParams, ...resetParams })
  //   switch (key) {
  //     case 'visitCount':
  //       getHistoryData(key)
  //       break

  //     default:
  //       break
  //   }
  // }

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
  const quicklyItemClick = (category, data) => {
    console.error('quicklyItemClick----', category, data)
    const baseQuery = {
      maxResults: pageParams.pageSize,
      startTime: new Date().getTime() - 24 * 3600 * 1000,
      endTime: new Date().getTime(),
      text: '',
    }
    let combineQuery = {}
    // 计算当前所有选中项,一种类别只能勾选一种类型
    console.error('filterMaps', filterMaps)
    // if (filterMaps.has(category)) {
    //   filterMaps.delete(category);
    // } else {
    //   filterMaps.set(category, data);
    // }
    filterMaps.set(category, data.key)

    setFilters(Array.from(filterMaps.values())) // 更新选中项
    // 合并所有筛选条件，查询记录
    switch (category) {
      case 'timeSort':
        if (data.key === '3Months') {
          const threeMonthsAgo = dayjs().clone().subtract(3, 'month').valueOf() // 3个月前时间戳-毫秒
          combineQuery.startTime = threeMonthsAgo
        } else if (data.key === 'lastMonth') {
          const threeMonthsAgo = dayjs().clone().subtract(1, 'month').valueOf() // 1个月前时间戳-毫秒
          combineQuery.startTime = threeMonthsAgo
        } else if (data.key === '10Days') {
          const threeMonthsAgo = dayjs().clone().subtract(10, 'day').valueOf() // 10天前时间戳-毫秒
          combineQuery.startTime = threeMonthsAgo
        } else if (data.key === 'lastWeek') {
          const threeMonthsAgo = dayjs().clone().subtract(7, 'day').valueOf() // 10天前时间戳-毫秒
          combineQuery.startTime = threeMonthsAgo
        } else if (data.key === 'year') {
          const currentYear = dayjs().year()
          const val = dayjs([currentYear, 0, 1]).valueOf()
          combineQuery.startTime = val
        } else if (data.key === 'month') {
          const val = dayjs().startOf('month').valueOf()
          combineQuery.startTime = val
        } else if (data.key === 'week') {
          const val = dayjs().startOf('week').valueOf()
          combineQuery.startTime = val
        } else if (data.key === 'today') {
          const val = dayjs().startOf('day').valueOf()
          combineQuery.startTime = val
        }

      case 'historySort': // 历史搜索
        break
      case 'countSort': // 访问次数
        if (data.key === 'mostVisit') {
          // 最多访问
        }
        if (data.key === 'last10') combineQuery.maxResults = 10
        if (data.key === 'last100') combineQuery.maxResults = 100
        break
    }
    combineQuery = Object.assign({}, baseQuery, combineQuery)
    console.error('合并后的参数------》', combineQuery)
    getHistoryData(combineQuery)
  }
  // 按访问量排序
  const sortByCount = () => {
    console.error('按访问量排序')
    if (historyData.length <= 1) return
    let result = []
    if (isAscNow) {
      // 升序改降序
      result = historyData.sort(function (a, b) {
        return a.visitCount - b.visitCount
      })
    } else {
      // 降序改升序
      result = historyData.sort(function (a, b) {
        return b.visitCount - a.visitCount
      })
    }
    setSortCount(!isAscNow)
    console.error('按访问量排序2', result)
    setHistory(result)
  }

  // 删除历史记录
  const deleteUrls = () => {
    console.error('删除历史记录', historyData)
    const urls = historyData.filter(i => checkList.includes(i.id)).map(i => i.url)
    const params = {
      details: urls,
    }
    HistoryUtils.deleteHistory(params)
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
    getCurMonthDays()
  }, [])
  const [currentWindows, setCurrentWindows] = useState([])

  // 把今天的日期滚动到可视区
  const targetItem = useRef(null)
  useEffect(() => {
    // console.error("把今天的日期滚动到可视区", targetItem.current);
    // targetItem.current &&
    //   targetItem.current.scrollIntoView({ behavior: "smooth" });
    const itemElement = document.getElementById(`targetItem`)
    console.error('把今天的日期滚动到可视区', itemElement)
    if (itemElement) {
      itemElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })
    }
  }, [])

  const getFavorIcon = url => {
    const urlObj = new URL(url)

    return `${urlObj.origin}/favicon.ico`
  }

  // 获取当月天数
  const getCurMonthDays = () => {
    const curDay = new Date().toISOString().split('T')[0] // 2024-07-04
    const curMonth = new Date().getMonth() + 1
    const weekDay = new Date().getDay() // 星期几
    const today = new Date().getDate() // 今天几号
    const year = new Date().getFullYear()
    const allDays = dayjs(curDay).daysInMonth()

    const getWeekDay = (day: string) => {
      return dayjs(`${year}-${curMonth}-${day}`).day()
    }

    const dateList = Array(allDays)
      .fill(' ')
      .map((_, day) => {
        return {
          day: day + 1,
          month: curMonth,
          weekDay: `星期${getWeekDay(String(day)) + 1}`,
          isToday: today,
          fullDay: `${year}-${curMonth}-${day}`,
        }
      })
    setDaysInMonth(dateList)
  }

  // 切换日期
  const toggleDay = data => {
    console.error('切换日期', data, data.fullDay)
    const endTime = dayjs(data.fullDay).endOf('day').toDate().getTime()
    const startTime = dayjs(data.fullDay).startOf('day').toDate().getTime()
    console.error('endTime', endTime)
    const query = {
      startTime,
      endTime,
      text: '',
      maxResults: 10,
    }
    HistoryUtils.getHistory(query).then(res => {
      console.error('获取历史记录', res)
      setHistory(res)
    })
  }

  // 选择日期
  const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.error(date, dateString)
    toggleDay({ fullDay: dateString })
  }
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
      {/* 日期滚动行 */}
      <div className='date-scroll flex-x-start flex-y-start'>
        <div className='scroll-area flex' ref={dateScrollRef}>
          {daysInMonth.map(i => {
            const isToday = i.day === i.isToday
            return (
              <div
                key={i.day}
                id={isToday ? 'targetItem' : ''}
                className={'date-item flex-mcenter' + (isToday ? ' active' : '')}
                onClick={() => toggleDay(i)}
              >
                <div className='week flex-center'>{i.weekDay}</div>
                <div className='day flex-center'>{i.day}</div>
                <div className='month flex-center'>{`${i.month}月`}</div>
              </div>
            )
          })}
        </div>
        <div className='calendar relative flex-mcenter'>
          <ScheduleOutlined style={{ fontSize: '48px', color: '#999' }} />
          <DatePicker className='component' onChange={onDateChange} />
        </div>
      </div>

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
          <div className='quicky-row flex-x-start flex-y-center' key={q.name}>
            <span className='c-h3'>{q.name}</span>
            <div className='quicky-content'>
              {q.list.map(l => {
                return (
                  <span
                    className={['c-btn-transparent', filters.includes(l.key) ? 'active' : null].join(' ')}
                    key={l.key}
                    onClick={() => quicklyItemClick(q.key, l)}
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
        <div className='controls'>
          <span className='flex-x-start' onClick={sortByCount}>
            访问量
            <PauseOutlined className='c-icon' />
          </span>
          <span className='flex-x-start' onClick={deleteUrls}>
            删除
          </span>
          {/* 窗口批量打开 */}
          <ExportOutlined className='c-icon' onClick={openWindow} title='窗口批量打开' />
          {/* 移动到窗口 */}
          {/* <ImportOutlined className="c-icon" onClick={combineToWindow} /> */}
          {/* <BtnPopover title='移动到窗口' content={currentWindows} config={{ key: 'id' }}></BtnPopover> */}
          {/* 标签组 */}
          {/* <FolderAddOutlined /> */}
        </div>
      </div>
      {/* 列表区域 */}
      <CheckboxGroup onChange={toggleCheck} value={checkList} style={{ width: '100%' }}>
        <div className='flex-dir-column' style={{ width: '100%' }}>
          {historyData.map(i => {
            const lastVisitTime = dayjs(i.lastVisitTime).format('YYYY-MM-DD HH:mm') // 最近访问时间
            return (
              <div key={i.id} className='history-item'>
                <div className='flex-x-start flex-y-center'>
                  <Checkbox value={i.id}></Checkbox>
                  <div className='info flex flex-x-start flex-y-center'>
                    <img className='c-logo' src={getFavorIcon(i.url)} alt='' />
                    <div>
                      <div className='flex-x-start flex-y-center'>
                        <span className='title'>{i.title}</span>
                        <span className='visit-count flex-center'>{i.visitCount}</span>
                      </div>
                      <div className='url app-oneline'>{i.url}</div>
                      <div className='lastVisit'>最近访问：{lastVisitTime}</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CheckboxGroup>
    </div>
  )
}
export default HistoryPage
