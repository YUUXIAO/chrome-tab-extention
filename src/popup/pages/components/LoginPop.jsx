import React from 'react'
import { Form, Button, Select, Input } from 'antd'
import Store from '@/store/index'
import { userLogin } from '@/api/user'
// import { createNewWindow } from '@/apiUtils.js'
// import { mockUserCollect } from '@/api/user'

class LoginPop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: {}, // 表单信息
    }
  }
  componentDidMount() {
    console.error('stroe', Store.getState())
  }
  // 获取快捷链接
  // getShortCut = () => {}
  // 创建新的窗口
  createNewWindow = () => {
    const { field2, field1 } = this.state.formData
    const data = {
      name: field1,
      password: field2,
    }
    userLogin(data).then(res => {
      console.error('登录成功', res)
      const { token } = res
      localStorage.setItem('token', token)

      chrome.storage.sync.set({ token: token }, function () {
        // 通知保存完成。
      })
    })
  }
  changeFiled = (key, value) => {
    const { formData } = this.state
    formData[key] = value
    this.setState({
      formData: formData,
    })
  }

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
          <Form.Item label='姓名' name='filed1'>
            <Input placeholder='请输入域名' type='text' onChange={e => this.changeFiled('field1', e.target.value)} />
          </Form.Item>
          <Form.Item label='密码' name='filed2'>
            <Input placeholder='请输入域名' type='password' onChange={e => this.changeFiled('field2', e.target.value)} />
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

export default LoginPop
