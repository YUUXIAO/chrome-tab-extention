// import { Tabs, Input, Collapse, Badge, Button } from 'antd'

import React, { useEffect, useState } from 'react'
import { Avatar, Button, List, Skeleton } from 'antd'
import { CheckCircleOutlined, CheckCircleFilled, CloseCircleFilled, CloseCircleOutlined } from '@ant-design/icons'
import { getLater, updateLater, deleteLater } from '@/api/user'
import { getUpdateTime } from '@/utils'

import './latePage.less'

const LaterPage = props => {
  const [headerText, setHeaderText] = useState('')
  const [isUndo, setUndo] = useState(true)

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
    const payload = {
      _id,
      status,
    }
    await updateLater(payload)
    props.initpage()
  }

  // 关闭
  const closeOne = async item => {
    console.error('关闭', item)
    const payload = {
      _id: item._id,
    }
    await deleteLater(payload)
    props.initpage()
  }

  // 处理时间
  const dealTime = timesamp => {
    let now = new Date(timesamp),
      y = now.getFullYear(),
      m = now.getMonth() + 1,
      d = now.getDate()

    return `${y}/${m}/${d} ${now.toTimeString().substr(0, 5)}`
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

class LaterPage2 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      undoData: [],
      doneData: [],
    }
  }

  getLaterData = () => {
    getLater().then(res => {
      const result = res.data
      const undoData = []
      const doneData = []
      result.forEach(item => {
        if (item.status === 0) {
          undoData.push(item)
        } else {
          doneData.push(item)
        }
      })
      this.setState({
        undoData,
        doneData,
      })
    })
  }
  componentDidMount() {
    this.getLaterData()
  }
  render() {
    const { undoData, doneData } = this.state
    return (
      <div className='later-page'>
        <LaterPage type='undo' dataSource={undoData} initpage={this.getLaterData}></LaterPage>
        <LaterPage type='done' dataSource={doneData} initpage={this.getLaterData}></LaterPage>
      </div>
    )
  }
}

export default LaterPage2
