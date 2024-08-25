import React, { useState, useEffect, useRef, forwardRef } from 'react'
import { Space, Table, Button, Input, Affix } from 'antd'
import type { TableProps } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import storageUtils from '@/extentionUtils/storage.js'
import ImageComponent from './ImageLoader/Index'
import ContextMenuComponent from './ContextMenu/Index'
import ScrollBar from './ScrollBar'
import './NewTab.less'

interface ITableData {
  /**
   * 序号
   */
  sort: number
  /**
   * 描述
   */
  category: string
  /**
   * 相关
   */
  related: string
  /**
   * 链接地址
   */
  link: string
  /**
   * 当前表格行编辑态
   */
  isEditable: boolean
  /**
   * 当前表格行合并行数
   */
  _rowSpan: number
}

function App() {
  const [tableData, setTableData] = useState([])
  const [isTableEdit, setTableEdit] = useState(false)
  const [top, setTop] = useState<number>(10)
  const tableScrollRef = useRef<HTMLDivElement | null>(null)

  // 右键菜单选项
  const [menuItems, setMenuItems] = useState(() => {
    return [
      {
        label: '新增一行',
        action: target => {
          console.error('新增一行', target.innerText, tableData)
          const sort = tableData.find(i => i.category === target.innerText)
          console.error('sort', sort)
        },
      },
    ]
  })

  // 获取网址域名，并返回图标
  const getDomainIcon = (url: string) => {
    const domainMatch = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/)
    if (domainMatch) {
      const domain = domainMatch[0]
      return `${domain}/favicon.ico`
    }
  }

  const columns: TableProps<ITableData>['columns'] = [
    {
      title: '序号',
      width: 50,
      render: (_, record, index) => {
        return index + 1
      },
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      onCell: (record, index) => {
        return { rowSpan: record._rowSpan }
      },
      render: (_, record) => {
        return isTableEdit ? (
          <Input
            value={record.category}
            onChange={e => changeLink(e, record, 'category')}
            onPressEnter={e => pressEnter(e, record, 'category')}
          ></Input>
        ) : (
          <ContextMenuComponent label={record.category} menuItems={menuItems} />
        )
      },
    },
    {
      title: '相关内容',
      dataIndex: 'related',
      key: 'related',

      render: (_, record, index) => {
        return isTableEdit ? (
          <Input
            value={record.related}
            onPaste={e => onRelatedFocus(e, record, 'related', index)}
            onChange={e => changeLink(e, record, 'related')}
            onPressEnter={e => pressEnter(e, record, 'related')}
          ></Input>
        ) : record.link ? (
          <div className='flex-x-start flex-y-center'>
            <ImageComponent src={getDomainIcon(record.link)} />
            <a href={record.link}>{record.related}</a>
          </div>
        ) : (
          <span>{record.related}</span>
        )
      },
    },
    {
      title: '链接地址',
      dataIndex: 'link',
      width: 150,
      key: 'link',
      render: (_, record) => {
        return isTableEdit ? (
          <>
            <Input value={record.link} onChange={e => changeLink(e, record, 'link')} onPressEnter={e => pressEnter(e, record, 'link')}></Input>
          </>
        ) : (
          <div className='flex-x-start flex-y-center'>
            <div className='app-oneline link'>{record.link}</div>
          </div>
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record, index) => (
        <Space size='small'>
          <Button danger size='small' type='text' onClick={() => onDeleteRow(_, record, index)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  useEffect(() => {
    initTableData()
  }, [])

  // 初始化表格数据
  const initTableData = () => {
    storageUtils.getStorageItem('newTabSetting').then((res: string) => {
      console.error(res)
      const tableData = dealTableSpan(res)
      if (tableData.length) {
        setTableData(dealTableSpan(tableData))
      }
    })
  }

  // 处理表格行合并数据
  const dealTableSpan = (tableData: ITableData[]) => {
    const rowCategory = [] as ITableData[]
    tableData.forEach((row, index: number) => {
      // console.error("单行数据", row, index);
      // row.isEditable = false;
      if (index === 0 && !row._rowSpan) {
        // 第一行，直接添加
        row._rowSpan = 1
        rowCategory.push(row)
      } else {
        // 和之前出现过的类别相同，则合并行
        const sameCategoryPre = row?.category && rowCategory.find(i => i.category === row.category)
        if (sameCategoryPre) {
          row._rowSpan = 0
          sameCategoryPre._rowSpan = ++sameCategoryPre._rowSpan
          // 找到最后一条相同类别，push到后面去
          const lastOneIndex = rowCategory.findLastIndex(i => {
            return i.category === row.category
          })
          rowCategory.splice(lastOneIndex + 1, 0, row)
        } else {
          row._rowSpan = 1
          rowCategory.push(row)
        }
      }
    })
    return rowCategory
  }

  const onDeleteRow = (_, record: ITableData, index: number) => {
    tableData.splice(index, 1)
    setTableData(dealTableSpan(tableData))
  }

  /**
   * 粘贴文本或链接到表格
   * @param e Event对象
   * @param record 当前操作行数据
   * @param key 当前操作列
   * @returns void
   * 1. 禁用原本粘贴逻辑
   * 2. 读取剪贴板数据
   * 3.判断剪贴板数据类型，如果是文本或html（解析出链接）
   */
  const onRelatedFocus = async (e, record: ITableData, key: string, index: number) => {
    const clipboardItems = await navigator.clipboard.read()
    const linkTexts = []
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const item = await clipboardItem.getType(type)
        if (item && item.type === 'text/html') {
          const clipboardHtml = await item.text()
          const parser = new DOMParser()
          const doc = parser.parseFromString(clipboardHtml, 'text/html')
          const hrefTags = doc.querySelectorAll('a')
          hrefTags.forEach(tag => {
            linkTexts.push({
              text: tag.innerText,
              href: tag.href,
            })
          })
          if (linkTexts.length) {
            const pushData = linkTexts.map(item => {
              return {
                id: uuidv4(),
                category: '',
                related: item.text,
                link: item.href,
                isEditable: false,
              }
            })

            // 当前操作行会有默认粘贴的内容要去掉，后面的数据就是插入现在操作行的后面
            // 判断第一行是不是有分类数据，如果有的话新复制的数据就是都是这个分类的二级数据
            if (pushData.length) {
              const oldRowData: ITableData = tableData[index]
              if (oldRowData.category) {
                pushData.map(i => {
                  i.category = oldRowData.category
                  return i
                })
              }
              tableData.splice(index, 1, ...pushData)
            }
            setTableData(dealTableSpan([...tableData]))
          }
        } else if (item && item.type === 'text/plain') {
          const urlRegex = /^(?:(http|https|ftp):\/\/)?((|[\w-]+\.)+[a-z0-9]+)(?:(\/[^/?#]+)*)?(\?[^#]+)?(#.+)?$/
          const text = await item.text()
          if (urlRegex.test(text)) {
            // 纯链接
            record.link = text
          } else {
            // 文本内容
            record[key] = text
          }

          setTableData(dealTableSpan([...tableData]))
        }
      }
    }

    // console.error("links", links);
    console.error('linkTexts', linkTexts)
  }

  const changeLink = (e, record: ITableData, key: string) => {
    record[key] = e.target.value
    setTableData([...tableData])
  }

  const pressEnter = (e, record: ITableData, key: string) => {
    record.isEditable = false
    setTableData([...tableData])
  }

  /**
   * 保存
   * 1. 过滤空数据
   */
  const onSaveSetting = async () => {
    const result: ITableData[] = []
    tableData.forEach((row: ITableData) => {
      if (row.category && row.link) {
        result.push(row)
      }
    })
    await storageUtils.setStorageItem('newTabSetting', result)
    setTableEdit(false)

    // 表格滚动到第一行
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollTop = 0
    }
  }
  const onEdit = async () => {
    setTableEdit(!isTableEdit)
  }

  const addTableRow = () => {
    const addRow = {
      id: uuidv4(),
      category: '',
      related: '',
      link: '',
      isEditable: true,
    }

    setTableData(dealTableSpan([...tableData, addRow]))

    setTimeout(() => {
      if (tableScrollRef.current) {
        tableScrollRef.current.scrollTop = tableScrollRef.current.scrollHeight
      }
    }, 300)
  }
  return (
    <div className='new-tab flex-x-center'>
      <div className='wrapper'>
        <Affix offsetTop={top} style={{ marginBottom: '10px' }}>
          <div>
            <Button onClick={onSaveSetting} style={{ marginRight: '10px' }}>
              保存
            </Button>
            <Button onClick={onEdit}>{isTableEdit ? '取消编辑' : '编辑表格'}</Button>
            <Button disabled={!isTableEdit} onClick={addTableRow} style={{ marginLeft: '10px' }}>
              添加
            </Button>
          </div>
        </Affix>
        <ScrollBar ref={tableScrollRef}>
          <Table size='small' bordered rowKey='id' columns={columns} pagination={false} dataSource={tableData} />
        </ScrollBar>
      </div>
    </div>
  )
}

export default App
