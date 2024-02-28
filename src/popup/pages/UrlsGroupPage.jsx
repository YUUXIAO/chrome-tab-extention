import React from 'react'
import { Form, Button, Modal, Checkbox, Tabs, List, Tag, Space, Alert, Input, Cascader } from 'antd'

import Store from '@/store/index'
import TabUtils from '@/extentionUtils/tabUtils.js'
import { createUrlTag, getUrlTags } from '@/api/user'
import { FastBackwardFilled, CopyOutlined, PlusOutlined } from '@ant-design/icons'

import './urlsGroupPage.less'

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
  // componentDidMount() {
  //   console.error('书签收藏', Store.getState().user)
  // }

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
        console.error(options)
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
        // alert('存网址标签成功')
        this.props.initpage()
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

class UrlsGroupPage extends React.Component {
  formRef = React.createRef()
  constructor(props) {
    super(props)
    this.state = {
      allUrlTags: [],
      activeTag: '',
      isShowCheckbox: false,
      isShowCreate: false,
      openIds: [],
      currentTagUrls: [],
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
        activeTag: allUrlTags[0]?._id || '',
        currentTagUrls: allUrlTags[0]?.urls || [],
      })
    })
  }

  showCreateModal = visible => {
    this.setState({
      isShowCreate: visible,
    })
  }
  tabChange = val => {
    const { allUrlTags } = this.state
    const current = allUrlTags.find(i => i._id === val)
    this.setState({
      activeTag: val,
      currentTagUrls: current?.urls || [],
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
    TabUtils.createNewWindow(createData, function (data) {
      console.error('创建成功', data)
    })
  }

  render() {
    const { isShowCreate, currentTagUrls, activeTag, allUrlTags, isShowCheckbox } = this.state
    const colors = ['red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan']
    return (
      <div>
        {/* <Modal
          footer={null}
          title='创建网页组'
          centered
          width={600}
          open={this.props.open}
          onCancel={() => this.props.setPopVisible('isShowUrlsGroup', false)}
        > */}
        <div className='create-window-wrapper'>
          <div className=''>
            <Button icon={<PlusOutlined />} className='operation-btn' onClick={() => this.showCreateModal(true)}>
              创建标签组
            </Button>
            {!isShowCheckbox && (
              <Button className='operation-btn ml10' icon={<CopyOutlined />} onClick={() => this.openTag(true)}>
                批量打开标签组
              </Button>
            )}
            {isShowCheckbox && (
              <Button size='small' className='opt-btn' onClick={() => this.openTag(false)}>
                取消
              </Button>
            )}
            {isShowCheckbox && (
              <Button size='small' className='opt-btn ml10' onClick={this.confirmOpen}>
                确定
              </Button>
            )}
          </div>
          <Tabs
            items={allUrlTags.map((item, index) => {
              return {
                label: (
                  <div>
                    {isShowCheckbox && (
                      <Checkbox size='small' className='mr10' key={item._id} onChange={e => this.checkboxChange(e, item)}></Checkbox>
                    )}
                    {item.name}
                  </div>
                ),
                key: item._id,
              }
            })}
            activeKey={activeTag}
            onChange={this.tabChange}
          />
          <List
            dataSource={currentTagUrls}
            renderItem={item => (
              <List.Item className='url-one'>
                {/* <div className='flex-x-start title'>{item.title}</div>
                <div className='url'>{item.url}</div> */}
                <List.Item.Meta
                  // avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                  title={<div className='title app-oneline'>{item?.title || item}</div>}
                  description={<div className='url app-oneline'>{item?.url || '手动添加网址'}</div>}
                />
              </List.Item>
            )}
          />
          {/* <Space size={[0, 8]} wrap>
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
          </Space> */}
        </div>
        {/* </Modal> */}
        {/* 创建标签组 */}
        {isShowCreate && (
          <CreateModal open={isShowCreate} cancel={() => this.showCreateModal(FastBackwardFilled)} initpage={this.getUserGroups}>
            {' '}
          </CreateModal>
        )}
      </div>
    )
  }
}

export default UrlsGroupPage
