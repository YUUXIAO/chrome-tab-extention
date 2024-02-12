import React from 'react'
import { Form, Button, Select, Input } from 'antd'
import Store from '@/store/index'
import TabUtils from '@/extentionUtils/tabUtils.js'
import { mockUserCollect } from '@/api/user'

class CreateNewWindowCom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: {}, // 表单信息
      favorUrlMaps: Store.getState().user.favorUrlMaps, // 收藏网址信息
      favorUrls: [], // 收藏网址列表
    }
  }
  componentDidMount() {
    console.error('stroe', Store.getState())
    Store.dispatch({
      type: 'favor_add',
      payload: mockUserCollect,
    })

    // 获取搜索历史记录
    // TODO
    // chrome.history.search({ text: "" }, (val) => {
    //   console.error("获取搜索历史记录", val)
    // })

    const userStore = Store.getState().user
    Store.subscribe(() => {
      this.setState({
        favorUrlMaps: userStore.favorUrlMaps,
        favorUrls: Array.from(userStore.favorUrls),
      })
    })
  }
  // 获取快捷链接
  // getShortCut = () => {}
  // 创建新的窗口
  createNewWindow = () => {
    alert(JSON.stringify(this.state.formData))
    const { field2, field1 } = this.state.formData
    const data = {
      url: [field1, ...field2],
    }
    TabUtils.createNewWindow(data).then(res => {
      alert(JSON.stringify(res))
    })
  }
  changeFiled1 = e => {
    const { formData } = this.state
    formData.field1 = e.target.value
    this.setState({
      formData: formData,
    })
  }
  changeFiled2 = val => {
    const { formData } = this.state
    formData.field2 = val
    this.setState({
      formData: formData,
    })
  }

  // 从收藏里面获取
  getFavorCut = () => {}
  render() {
    const { formData, favorUrlMaps, favorUrls } = this.state
    return (
      <div className='create-window-wrapper'>
        {/* 快捷按钮 */}
        {/* <Button onClick={this.getShortCut}>获取快捷选项</Button> */}
        <Form
          labelCol={{
            span: 5,
          }}
        >
          {/* rules={[{ required: true }]} */}
          <Form.Item label='域名' name='filed1'>
            <Input placeholder='请输入域名' type='text' onChange={this.changeFiled1} />
          </Form.Item>
          <Form.Item label='收藏网址||标签组' name='group'>
            <Select
              style={{ width: '100%' }}
              fieldNames={{
                label: 'title',
                value: 'url',
              }}
              onChange={this.changeFiled2}
              placeholder='选择收藏网址'
              showSearch
              options={favorUrlMaps}
              mode='multiple'
            />
          </Form.Item>

          <Form.Item className='flex-x-center'>
            <Button size='large' type='primary' onClick={this.createNewWindow}>
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default CreateNewWindowCom
