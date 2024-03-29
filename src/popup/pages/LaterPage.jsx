// import { Tabs, Input, Collapse, Badge, Button } from 'antd'

import React, { useEffect, useState } from 'react'
import { Avatar, List } from 'antd'
import { CheckCircleOutlined, CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons'
import { getLater, updateLater, deleteLater } from '@/api/user'
import { getUpdateTime, dealTime } from '@/utils'
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
    const header = isUndo ? '未读' : '已读'
    setUndo(isUndo)
    setHeaderText(`您${header}过的页面`)
  }, [props])

  // 勾选状态，切换已读状态
  const toggleCheck = async item => {
    const { _id, status } = item
    if (isLogin) {
      const payload = {
        _id,
        status,
      }
      await updateLater(payload)
    } else {
      await StorageArray.updateItem('laterData', item.createTime, { status: Number(!status) })
    }
    props.initpage()
  }

  // 关闭
  const closeOne = async item => {
    if (isLogin) {
      const payload = {
        _id: item._id,
      }
      await deleteLater(payload)
    } else {
      await StorageArray.removeItem('laterData', item.createTime)
    }
    props.initpage()
  }

  return (
    <div>
      <List
        className={`later-list ${isUndo ? 'undo-list' : 'done-list'}`}
        itemLayout='horizontal'
        bordered
        dataSource={props.dataSource}
        header={<div className='header flex-y-center'>{headerText}</div>}
        renderItem={item => (
          <List.Item
            actions={[
              isUndo ? (
                <CheckCircleOutlined className='icon' onClick={() => toggleCheck(item)} />
              ) : (
                <CheckCircleFilled className='icon' onClick={() => toggleCheck(item)} />
              ),
              <CloseCircleOutlined className='icon' onClick={() => closeOne(item)} />,
            ]}
          >
            <List.Item.Meta
              className='pointer '
              avatar={<Avatar src={item.favIconUrl || ''} />}
              title={
                <div className='info'>
                  <div className='time'>
                    {dealTime(item.createTime)} {getUpdateTime(item.createTime)}
                  </div>
                  <div className='title'>{item.pageTitle}</div>
                </div>
              }
              description={<div className='desc app-oneline'>{item.pageUrl}</div>}
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

  getLaterData = async () => {
    const { isLogin } = this.state
    if (isLogin) {
      getLater().then(res => {
        this.dealData(res.data)
      })
    } else {
      const todoKeysData = await storageUtils.StorageArray.getItem('laterData')
      this.dealData(todoKeysData)
    }
  }
  componentDidMount() {
    this.getLaterData()
  }
  render() {
    const { undoData, doneData } = this.state
    return (
      <div className='later-page'>
        <LaterPageCom type='undo' dataSource={undoData} initpage={this.getLaterData}></LaterPageCom>
        <LaterPageCom type='done' dataSource={doneData} initpage={this.getLaterData}></LaterPageCom>
      </div>
    )
  }
}

export default LaterPage
