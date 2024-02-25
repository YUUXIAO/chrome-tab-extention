import React from 'react'
import { Form, Button, Modal, Checkbox, Tag, Space, Alert, Input, Cascader } from 'antd'

import Store from '@/store/index'
import TabUtils from '@/extentionUtils/tabUtils.js'
import { createUrlTag, getUrlTags } from '@/api/user'
import { FastBackwardFilled } from '@ant-design/icons'

class CreateModal extends React.Component {
  formRef = React.createRef()
  constructor(props) {
    super(props)
    this.state = {
      enterurls: [''], // 手动输入网址
      isShowMessage: false,
      errorMessage: '',
      formData: {
        collect: [],
      }, // 表单信息
      favorUrlMaps: Store.getState().user.allBookmarks, // 书签收藏
    }
  }
  componentDidMount() {}

  // 获取快捷链接
  changeFiled1 = (filed, value, options) => {
    const { formData, enterurls } = this.state
    if (typeof filed === 'number') {
      // enterurls[filed] = value

      const a = enterurls.map((url, idx) => {
        if (idx === filed) return value
        return url
      })
      this.setState({
        enterurls: a,
      })
    } else {
      // 收藏
      if (filed === 'collect') {
        formData[filed] = options.map(opt => {
          const val = opt[opt.length - 1]
          return {
            title: val.title,
            url: val.url,
          }
        })
      } else {
        formData[filed] = value
      }
      this.setState({
        formData: formData,
      })
    }
  }

  addEnterUrl = () => {
    const { enterurls } = this.state
    this.setState({
      enterurls: [...enterurls, ''],
    })
  }

  createNewTag = async () => {
    const { formData, enterurls = [] } = this.state
    await this.formRef.current.validateFields()

    const urls = Array.from(new Set([...enterurls, ...(formData.collect || [])])).filter(i => i)
    if (urls.length < 1) {
      this.setState({
        isShowMessage: true,
        errorMessage: '至少输入一个网址',
      })
    }
    const params = {
      urls,
      name: formData.name,
    }
    createUrlTag(params)
      .then(res => {
        alert('存网址标签成功')
      })
      .catch(err => {
        this.setState({
          isShowMessage: true,
          errorMessage: err.msg,
        })
      })
  }

  alertClose = () => {
    this.setState({
      isShowMessage: false,
    })
  }
  render() {
    const { isShowMessage, errorMessage, favorUrlMaps, enterurls } = this.state

    return (
      <Modal footer={null} title='查看/创建网页组' centered width={600} open={this.props.open} onCancel={this.props.cancel}>
        <div className='create-window-wrapper'>
          {isShowMessage && <Alert closable message={errorMessage} type='error' onClose={this.alertClose} />}

          <Form
            labelCol={{
              span: 5,
            }}
            validateTrigger={['onBlur', 'onChange']}
            ref={this.formRef}
          >
            <Form.Item label='名称' name='name' rules={[{ required: true, message: '请输入名称' }]}>
              <Input placeholder='请输入名称' type='text' onChange={e => this.changeFiled1('name', e.target.value)} />
            </Form.Item>
            {this.state.enterurls}
            {enterurls.map((url, idx) => {
              return (
                <Form.Item label='域名' key={idx}>
                  <Space.Compact>
                    <Input placeholder='请输入域名' type='text' value={url} onChange={e => this.changeFiled1(idx, e.target.value)} />
                    {idx === enterurls.length - 1 && (
                      <Button onClick={this.addEnterUrl} type='primary'>
                        添加
                      </Button>
                    )}
                  </Space.Compact>
                </Form.Item>
              )
            })}
            <Form.Item label='从收藏批量获取' name='collect'>
              <Cascader
                style={{ width: '100%' }}
                fieldNames={{
                  label: 'title',
                  value: 'id',
                  children: 'children',
                }}
                showCheckedStrategy='SHOW_CHILD'
                multiple
                onChange={(value, opt) => this.changeFiled1('collect', value, opt)}
                placeholder='选择收藏网址'
                showSearch
                options={favorUrlMaps}
                mode='multiple'
              />
              {/* dropdownMenuColumnStyle={{ width: '400px' }} */}
            </Form.Item>
            <Form.Item className='flex-x-center'>
              <Button size='large' type='primary' onClick={this.createNewTag}>
                确定
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    )
  }
}

class UrlsGroupPop extends React.Component {
  formRef = React.createRef()
  constructor(props) {
    super(props)
    this.state = {
      allUrlTags: [],
      isShowCheckbox: false,
      isShowCreate: false,
      openIds: [],
    }
  }
  componentDidMount() {
    this.getUserGroups()
  }

  getUserGroups = () => {
    getUrlTags().then(res => {
      console.error('获取到所有标签', res)
      const allUrlTags = res?.data || []
      this.setState({
        allUrlTags,
      })
    })
  }

  showCreateModal = visible => {
    this.setState({
      isShowCreate: visible,
    })
  }
  openTag = visible => {
    this.setState({
      isShowCheckbox: visible,
    })
  }

  // tagClick = (e, tag) => {
  //   e.stopPropagation()
  // }

  checkboxChange = (e, tag) => {
    console.error('多选', e, tag)
    let { openIds } = this.state
    const checked = e.target.checked
    if (checked) {
      openIds.push(tag._id)
    } else {
      openIds = openIds.filter(i => i !== tag._id)
    }
    this.setState({ openIds })
  }

  // 批量打开窗口
  confirmOpen = () => {
    console.error('批量打开窗口', this.state.openIds)
    const { openIds, allUrlTags } = this.state
    let createUrls = []
    openIds.forEach(id => {
      const result = allUrlTags.find(i => i._id === id)

      if (result) {
        const urls = result.urls.map(i => i.url)
        createUrls = [...createUrls, ...urls]
      }
    })

    const createData = {
      url: createUrls,
    }
    console.error('需要创建的URLs', createUrls)
    TabUtils.createNewWindow(createData, function (data) {
      console.error('创建成功', data)
    })
  }

  render() {
    const { isShowCreate, allUrlTags, isShowCheckbox } = this.state
    const colors = ['red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan']
    return (
      <div>
        <Modal
          footer={null}
          title='创建网页组'
          centered
          width={600}
          open={this.props.open}
          onCancel={() => this.props.setPopVisible('isShowUrlsGroup', false)}
        >
          <div className='create-window-wrapper'>
            <div className='mt10 mb10'>
              <Button type='primary' onClick={() => this.showCreateModal(true)}>
                创建标签组
              </Button>
              <Button type='primary' onClick={() => this.openTag(true)} className='ml10'>
                批量打开标签组
              </Button>
              {isShowCheckbox && (
                <Button type='error' onClick={() => this.openTag(false)}>
                  取消
                </Button>
              )}
              {isShowCheckbox && (
                <Button type='primary' onClick={this.confirmOpen}>
                  确定
                </Button>
              )}
            </div>
            <Space size={[0, 8]} wrap>
              {allUrlTags.map((item, index) => {
                return (
                  <div>
                    {isShowCheckbox && (
                      <Checkbox size='small' className='mr10' key={item._id} onChange={e => this.checkboxChange(e, item)}>
                        <Tag className='pointer' key={index} color={colors[index % 7]}>
                          {item.name}
                        </Tag>
                      </Checkbox>
                    )}
                    {!isShowCheckbox && (
                      <Tag className='pointer' key={item._id} color={colors[index % 7]}>
                        {item.name}
                      </Tag>
                    )}
                  </div>
                )
              })}
            </Space>
          </div>
        </Modal>
        {/* 创建标签组 */}
        {isShowCreate && <CreateModal open={isShowCreate} cancel={() => this.showCreateModal(FastBackwardFilled)}></CreateModal>}
      </div>
    )
  }
}

export default UrlsGroupPop
