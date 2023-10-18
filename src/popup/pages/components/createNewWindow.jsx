import React from "react"
import { Form, Button, Select, Input, Cascader } from "antd"
import Store from "@/store/index"
import { mockUserCollect } from "@/api/user"

// TODO
// 1、选择历史链接快捷选中
// 2、一键批量打开【收藏、标签】
// 3、快捷恢复（注入页面icon）
class CreateNewWindow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: {}, // 表单信息
      favorUrlMaps: Store.getState().user.favorUrlMaps, // 收藏网址信息
      favorUrls: [] // 收藏网址列表
    }
  }
  componentDidMount() {
    console.error("stroe", Store.getState())
    Store.dispatch({
      type: "favor_add",
      payload: mockUserCollect
    })

    const userStore = Store.getState().user
    Store.subscribe(() => {
      console.error("22", userStore.favorUrlMaps)
      this.setState({
        favorUrlMaps: userStore.favorUrlMaps,
        favorUrls: Array.from(userStore.favorUrls)
      })
    })
    console.error(111, this.state.favorUrlMaps)
  }
  // 获取快捷链接
  getShortCut = () => {}

  // 从收藏里面获取
  getFavorCut = () => {}
  render() {
    const { formData, favorUrlMaps, favorUrls } = this.state
    return (
      <div className="create-window-wrapper">
        {/* 快捷按钮 */}
        {/* <Button onClick={this.getShortCut}>获取快捷选项</Button> */}
        <Form
          labelCol={{
            span: 3
          }}
        >
          {/* rules={[{ required: true }]} */}
          <Form.Item label="域名" name="filed1">
            <Input placeholder="请输入域名" />
          </Form.Item>
          <Form.Item label="收藏网址">
            <Select
              style={{ width: "100%" }}
              fieldNames={{
                label: "title",
                value: "url"
              }}
              placeholder="选择收藏网址"
              showSearch
              options={favorUrlMaps}
              mode="multiple"
            />
          </Form.Item>
          <Form.Item label="一键打开">
            <Select
              style={{ width: "100%" }}
              fieldNames={{
                label: "title",
                value: "url"
              }}
              placeholder="一键打开一组标签"
              showSearch
              options={favorUrlMaps}
              mode="multiple"
            />
          </Form.Item>
          <Form.Item className="flex-x-center">
            <Button size="large" type="primary">
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default CreateNewWindow
