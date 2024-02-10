import React from 'react'
import { Form, Button, Space, message, Alert, Input } from 'antd'
import Store from '@/store/index'

import { userLogin, sendMail } from '@/api/user'
// import { createNewWindow } from '@/apiUtils.js'
// import { mockUserCollect } from '@/api/user'

class LoginPop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inOneMinute: false,
      expireTime: 60,
      isShowMessage: false,
      formData: {}, // 表单信息
    }
  }
  componentDidMount() {
    console.error('stroe', Store.getState())
  }
  // 获取验证码
  getCode = () => {
    const { email } = this.state.formData
    if (!email) {
      this.setState({
        isShowMessage: true,
      })
      return
    }
    if (this.state.inOneMinute) return

    sendMail({ email: email }).then(res => {
      console.error('获取验证码成功', res)
      let time = 60
      this.setState({
        inOneMinute: true,
      })
      // const { expireTime } = this.state
      const timer = setInterval(() => {
        time--
        if (time >= 0) {
          this.setState({
            expireTime: time,
          })
        } else {
          clearInterval(timer)
          this.setState({
            expireTime: time,
            inOneMinute: false,
          })
        }
      }, 1000)
    })
  }
  // 登录
  handleLogin = () => {
    const { password, email, code } = this.state.formData
    const data = {
      mail: email,
      password: password,
      code,
    }
    userLogin(data).then(res => {
      console.error('登录成功', res)
      if (res.error === 1) {
        message.info(res.data)
        return
      }
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
    const { inOneMinute, expireTime, isShowMessage, favorUrlMaps, favorUrls } = this.state
    return (
      <div className='create-window-wrapper'>
        {/* TODO 邮箱校验 */}
        {isShowMessage && <Alert message='请先输入邮箱' type='error' />}
        {/* 快捷按钮 */}
        {/* <Button onClick={this.getShortCut}>获取快捷选项</Button> */}
        <Form
          labelCol={{
            span: 5,
          }}
        >
          <Form.Item label='邮箱' name='email' rules={[{ required: true, message: '请输入邮箱' }]}>
            <Space.Compact>
              <Input placeholder='请输入邮箱' type='text' onChange={e => this.changeFiled('email', e.target.value)} />
              <Button type='primary' onClick={this.getCode}>
                {inOneMinute ? `${expireTime}s后获取` : '获取验证码'}
              </Button>
            </Space.Compact>
          </Form.Item>

          <Form.Item label='验证码' name='code' rules={[{ required: true, message: '请输入验证码' }]}>
            <Input placeholder='请输入验证码' count='6' type='text' onChange={e => this.changeFiled('code', e.target.value)} />
          </Form.Item>
          <Form.Item label='密码' name='password' rules={[{ required: true, message: '请输入密码' }]}>
            <Input placeholder='请输入密码' type='password' onChange={e => this.changeFiled('password', e.target.value)} />
          </Form.Item>

          <Form.Item className='flex-x-center'>
            <Button size='large' type='primary' onClick={this.handleLogin}>
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default LoginPop
