import React from 'react'
import { Form, Button, Modal, Switch, Checkbox, Tabs, List, Space, Alert, Input, Cascader } from 'antd'

import Store from '@/store/index'
import TabUtils from '@/extentionUtils/tabUtils.js'
import { createUrlTag, getUrlTags } from '@/api/user'
import { CopyOutlined, PlusOutlined } from '@ant-design/icons'
import storageUtils from '@/extentionUtils/storage.js'

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
        isNewWindow: false,
        collect: [],
      }, // 表单信息
      isLogin: Store.getState().user.isLogin,
      favorUrlMaps: Store.getState().user.allBookmarks, // 书签收藏
    }
  }

  // 获取快捷链接
  changeFiled = (filed, value, options) => {
    const { formData, enterurls } = this.state

    if (typeof filed === 'number') {
      // 索引值
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
    const { formData, enterurls = [], isLogin } = this.state
    await this.formRef.current.validateFields()
    const { name, isNewWindow } = this.formRef.current.getFieldsValue()
    // 合并手输域名和选项的
    let enterurlmap = []
    const hasEnter = enterurls.filter(i => Boolean(i.trim()))
    if (hasEnter?.length) {
      enterurlmap = enterurls.map(i => {
        return { title: '手动添加网址', url: i }
      })
    }

    const urls = Array.from(new Set([...enterurlmap, ...(formData.collect || [])])).filter(i => i)
    if (urls.length < 1) {
      this.setState({
        isShowMessage: true,
        errorMessage: '至少输入一个网址',
      })
    }
    const params = {
      urls,
      isNewWindow,
      createTime: Date.now(),
      name,
    }
    if (isLogin) {
      createUrlTag(params)
        .then(() => {
          this.props.initpage()
          this.props.cancel()
        })
        .catch(err => {
          this.setState({
            isShowMessage: true,
            errorMessage: err?.data?.msg || err.data.data,
          })
        })
    } else {
      params['_id'] = Date.now()
      await storageUtils.StorageArray.setItem('urlGroups', params)
      this.props.initpage()
      this.props.cancel()
    }
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
          {isShowMessage && <Alert className='mb10' closable message={errorMessage} type='error' onClose={this.alertClose} />}

          <Form
            labelCol={{
              span: 5,
            }}
            validateTrigger={['onBlur', 'onChange']}
            ref={this.formRef}
          >
            <Form.Item label='名称' name='name' rules={[{ required: true, message: '请输入名称' }]}>
              <Input placeholder='请输入名称' type='text' onChange={e => this.changeFiled('name', e.target.value)} />
            </Form.Item>
            {enterurls.map((url, idx) => {
              return (
                <Form.Item label='域名' key={idx}>
                  <Space.Compact>
                    <Input placeholder='请输入域名' type='text' value={url} onChange={e => this.changeFiled(idx, e.target.value)} />
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
                onChange={(value, opt) => this.changeFiled('collect', value, opt)}
                placeholder='选择收藏网址'
                showSearch
                options={favorUrlMaps}
                mode='multiple'
              />
            </Form.Item>
            <Form.Item label='是否新窗口开启' name='isNewWindow'>
              <Switch></Switch>
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
      isLogin: Store.getState().user.isLogin,
    }
  }
  componentDidMount() {
    this.getUserGroups()
  }

  // 获取所有网页组
  getUserGroups = async () => {
    const { isLogin } = this.state
    if (isLogin) {
      getUrlTags().then(res => {
        const allUrlTags = res?.data || []
        this.setState({
          allUrlTags,
          activeTag: allUrlTags[0]?._id || '',
          currentTagUrls: allUrlTags[0]?.urls || [],
        })
      })
    } else {
      const result = await storageUtils.StorageArray.getItem('urlGroups')
      this.setState({
        allUrlTags: result,
        activeTag: result[0]?._id || '',
        currentTagUrls: result[0]?.urls || [],
      })
    }
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

  checkboxChange = (e, tag) => {
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
    const { openIds, allUrlTags } = this.state
    let combineCreateUrls = [] // 合并的数据
    let signleWindow = [] // 单独的窗口打开
    openIds.forEach(id => {
      const result = allUrlTags.find(i => i._id === id)
      if (result) {
        const { isNewWindow = false } = result
        const urls = result.urls.map(i => i?.url || '')
        if (isNewWindow) {
          signleWindow = [...signleWindow, { urls }]
        } else {
          combineCreateUrls = [...combineCreateUrls, ...urls]
        }
      }
    })
    // 单窗口打开
    if (signleWindow?.length) {
      signleWindow.forEach(win => {
        const createData = {
          url: win.urls,
        }
        TabUtils.createNewWindow(createData)
      })
    }
    // 合并其他数据
    if (combineCreateUrls?.length) {
      const createData = {
        url: combineCreateUrls,
      }
      TabUtils.createNewWindow(createData)
    }
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
          {Boolean(allUrlTags?.length) && (
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
          )}
          <List
            dataSource={currentTagUrls}
            renderItem={item => (
              <List.Item className='url-one'>
                <List.Item.Meta
                  title={<div className='title app-oneline'>{item?.title || item}</div>}
                  description={<div className='url app-oneline'>{item?.url || '手动添加网址'}</div>}
                />
              </List.Item>
            )}
          />
        </div>
        {/* 创建标签组 */}
        {isShowCreate && <CreateModal open={isShowCreate} cancel={() => this.showCreateModal(false)} initpage={this.getUserGroups}></CreateModal>}
      </div>
    )
  }
}

export default UrlsGroupPage
