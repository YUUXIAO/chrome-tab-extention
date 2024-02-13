import React from 'react'
import { Form, Button, Space, Modal, Alert, Input } from 'antd'
import Store from '@/store/index'
import { isExtentionEnv } from '@/utils.js'

import { userLogin, sendMail } from '@/api/user'

class LoginPop extends React.Component {
  formRef = React.createRef()
  constructor(props) {
    super(props)
    this.state = {
      inOneMinute: false,
      expireTime: 60,
      isShowMessage: false,
      errorMessage: '请先输入邮箱',
      formData: {
        email: '',
        code: '',
        password: '',
      }, // 表单信息
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
        errorMessage: '请先输入邮箱',
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
  handleLogin = async () => {
    await this.formRef.current.validateFields()
    const { password, email, code } = this.state.formData
    const data = {
      mail: email,
      password: password,
      code,
    }
    userLogin(data)
      .then(res => {
        console.error('登录成功', res)
        this.props.setPopVisible('isShowLogin', false)

        const { token, userId } = res
        if (isExtentionEnv()) {
          chrome.storage.sync.set({ token: token })
        } else {
          localStorage.setItem('token', token)
        }

        // 保存用户信息到store
        Store.dispatch({
          type: 'get_user',
          payload: {
            token,
            userId,
            ...data,
          },
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          isShowMessage: true,
          errorMessage: err.data,
        })
        // Message.error(err.data)
      })
  }
  alertClose = () => {
    this.setState({
      isShowMessage: false,
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
    const { inOneMinute, errorMessage, expireTime, isShowMessage } = this.state
    return (
      <Modal
        footer={null}
        title='用户登录'
        centered
        width={600}
        open={this.props.open}
        onCancel={() => this.props.setPopVisible('isShowLogin', false)}
      >
        <div className='create-window-wrapper'>
          {isShowMessage && <Alert closable message={errorMessage} type='error' onClose={this.alertClose} />}
          <Form
            labelCol={{
              span: 5,
            }}
            validateTrigger={['onBlur', 'onChange']}
            ref={this.formRef}
          >
            <Form.Item
              label='邮箱'
              name='email'
              rules={[
                { required: true, message: '请输入邮箱' },
                {
                  pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                  message: '邮箱格式不正确',
                },
              ]}
            >
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
      </Modal>
    )
  }
}

export default LoginPop
