import React from 'react'
import { Form, Button, Select, Input, Cascader } from 'antd'
import Store from '@/store/index'
import { mockUserCollect } from '@/api/user'

class UrlsGroupPop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      enterurls: [' '], // 手动输入网址
      formData: [], // 表单信息
      favorUrlMaps: Store.getState().user.favorUrlMaps, // 收藏网址信息
    }
  }
  componentDidMount() {
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
  changeFiled1 = (filed, value) => {
    const { formData, enterurls } = this.state
    console.error('file', filed, value)
    if (typeof filed === 'number') {
      // enterurls[filed] = value

      console.error('enterurls', enterurls)
      const a = enterurls.map((url, idx) => {
        if (idx === filed) return value
        return url
      })
      console.error(a)
      this.setState({
        enterurls: a,
      })
    } else {
      formData[filed] = value
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

  createNewTag = () => {
    const { formData, enterurls } = this.state
    console.error(formData)
    console.error(enterurls)
    const urls = Array.from(new Set([...enterurls, ...formData.collect]))
    const params = {
      urls,
      name: formData.name,
    }
    // TODO 接口
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }
    const url = `http://127.0.0.1:3000/createTag`
    fetch(url, options)
      .then(response => {
        console.error('存网址标签', response)
      })
      .then(data => {
        // 处理返回的数据
      })
      .catch(error => {
        // 处理错误
      })
  }

  // 从收藏里面获取
  getFavorCut = () => {}
  render() {
    const { formData, favorUrlMaps, enterurls, favorUrls } = this.state
    return (
      <div className='create-window-wrapper'>
        {/* 快捷按钮 */}
        {/* <Button onClick={this.getShortCut}>获取快捷选项</Button> */}
        <Form
          labelCol={{
            span: 5,
          }}
        >
          <Form.Item label='名称' name='name'>
            <Input placeholder='请输入名称' type='text' onChange={e => this.changeFiled1('name', e.target.value)} />
          </Form.Item>
          {this.state.enterurls}
          {enterurls.map((url, idx) => {
            return (
              <Form.Item label='域名'>
                <Input placeholder='请输入域名' type='text' value={url} onChange={e => this.changeFiled1(idx, e.target.value)} />
                {idx === enterurls.length - 1 && <Button onClick={this.addEnterUrl}>添加</Button>}
              </Form.Item>
            )
          })}
          <Form.Item label='从收藏批量获取' name='collect'>
            <Select
              style={{ width: '100%' }}
              fieldNames={{
                label: 'title',
                value: 'url',
              }}
              onChange={value => this.changeFiled1('collect', value)}
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
    )
  }
}

export default UrlsGroupPop
