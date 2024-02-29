import React, { useEffect, useState } from 'react'
import { List } from 'antd'
import { CheckCircleOutlined, CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons'
import { getTodoKeys, deleteTodoKeys, updateTodoKeys } from '@/api/user'
import { getUpdateTime, dealTime } from '@/utils'
import TabUtils from '@/extentionUtils/tabUtils.js'
import storageUtils from '@/extentionUtils/storage.js'
import Store from '@/store/index'

import './latePage.less'

const LaterPageCom = props => {
  const [headerText, setHeaderText] = useState('')
  const [isUndo, setUndo] = useState(true)
  const StorageArray = storageUtils.StorageArray
  const isLogin = Store.getState().user.isLogin

  useEffect(() => {
    const status = props.type
    const isUndo = status === 'undo'
    const header = isUndo ? '未处理' : '已处理'
    setUndo(isUndo)
    setHeaderText(`您${header}过的关键词`)
  }, [props])

  // 勾选状态，切换已读状态
  const toggleCheck = async item => {
    const { _id, status = 0 } = item
    if (isLogin) {
      const payload = {
        _id,
        status,
      }
      await updateTodoKeys(payload)
    } else {
      await StorageArray.updateItem('todoKeys', item.createTime, { status: Number(!status) })
    }
    props.initpage()
  }

  // 关闭
  const closeOne = async item => {
    if (isLogin) {
      const payload = {
        _id: item._id,
      }
      await deleteTodoKeys(payload)
    } else {
      await StorageArray.removeItem('todoKeys', item.createTime)
    }

    props.initpage()
  }

  // 打开来源页
  const openOrigin = url => {
    const createinfo = {
      url,
      selected: false,
      active: false,
    }
    TabUtils.createNewTab(createinfo)
  }

  return (
    <div>
      <List
        className={`todo-list ${isUndo ? 'undo-list' : 'done-list'}`}
        bordered
        dataSource={props.dataSource}
        header={<div className='header flex-y-center'>{headerText}</div>}
        renderItem={item => (
          <List.Item actions={[<CloseCircleOutlined className='icon' onClick={() => closeOne(item)} />]}>
            <List.Item.Meta
              className='pointer '
              title={
                <div className='info flex-x-start flex-y-center'>
                  <div className='checkbox'>
                    {isUndo ? (
                      <CheckCircleOutlined className='icon' onClick={() => toggleCheck(item)} />
                    ) : (
                      <CheckCircleFilled className='icon' onClick={() => toggleCheck(item)} />
                    )}
                  </div>
                  <div className='flex'>
                    <div className='title'>{item.selection}</div>
                    <div className='desc flex-x-start app-oneline' onClick={() => openOrigin(item.pageUrl)}>
                      <div className='time mr10'>
                        {dealTime(item.createTime)} {getUpdateTime(item.createTime)}
                      </div>
                      <div className='origin app-oneline'> 来源页面：{item.pageUrl}</div>
                    </div>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  )
}

class LaterPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogin: Store.getState().user.isLogin,
      undoData: [],
      doneData: [],
    }
  }

  dealData = result => {
    const undoData = []
    const doneData = []
    result.forEach(item => {
      if (item?.status === 1) {
        doneData.push(item)
      } else {
        undoData.push(item)
      }
    })
    this.setState({
      undoData,
      doneData,
    })
  }

  getKeysData = async () => {
    const { isLogin } = this.state
    if (isLogin) {
      getTodoKeys().then(res => {
        this.dealData(res.data)
      })
    } else {
      const todoKeysData = await storageUtils.StorageArray.getItem('todoKeys')
      this.dealData(todoKeysData)
    }
  }
  componentDidMount() {
    this.getKeysData()
  }
  render() {
    const { undoData, doneData } = this.state
    return (
      <div className='later-page'>
        <LaterPageCom type='undo' dataSource={undoData} initpage={this.getKeysData}></LaterPageCom>
        <LaterPageCom type='done' dataSource={doneData} initpage={this.getKeysData}></LaterPageCom>
      </div>
    )
  }
}

export default LaterPage
