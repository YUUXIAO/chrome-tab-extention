import React from "react"
import { Form, Input } from "antd"

// TODO
// 1、选择历史链接快捷选中
// 2、一键批量打开【收藏、标签】
// 3、快捷恢复（注入页面icon）
class CreateNewWindow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: {} // 表单信息
    }
  }

  render() {
    const { formData } = this.state
    return (
      <div className="create-window-wrapper">
        <Form>
          <Form.Item label="表单1" name="filed1" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default CreateNewWindow
