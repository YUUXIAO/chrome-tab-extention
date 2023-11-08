import React from "react"
import { Form, Button, Radio, Select, List, Input, Collapse } from "antd"
import Store from "@/store/index"
import { mockUserCollect } from "@/api/user"
const { Option } = Select

class TodoList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLabel: "标签1",
      enterVal: "1",
      todoList: [
        {
          name: "标签1",
          todos: []
        }
      ]
    }
  }
  inputChange = (val) => {
    this.setState({
      enterVal: val.target.value
    })
  }
  onEnter = (val) => {
    const value = val.target.value
    console.error("回车", value)
    const { todoList, currentLabel } = this.state
    const labelTodos = todoList.find((i) => i.name === currentLabel)
    labelTodos.todos.push({
      checked: false,
      text: value
    })
    this.setState({
      todoList: todoList
    })
  }
  onLabelChange = (val) => {
    console.error("onLabelChange", val)
    this.setState({
      currentLabel: val
    })
  }
  radioChang = (val, option) => {
    console.error("radioChang", val, option)
    option.checked = val
  }
  render() {
    const { todoList } = this.state
    return (
      <div className="todo-wrapper ">
        <div className="flex-x-start">
          <Select
            placeholder="Select a option and change input text above"
            onChange={this.onLabelChange}
            allowClear
            className="w200"
            defaultValue={todoList[0].name}
          >
            {todoList.map((label) => {
              return <Option value={label.name}>{label.name}</Option>
            })}
          </Select>
          <Input
            placeholder="请输入"
            allowClear
            onChange={this.inputChange}
            onPressEnter={this.onEnter}
          />
        </div>
        {/* TODO 列表 */}
        {todoList.map((item, index) => {
          return (
            <Collapse
              bordered
              dataSource={todoList}
              items={[
                {
                  key: index,
                  label: item.name,
                  children: item.todos.map((i) => {
                    return (
                      <Radio
                        onChange={(val) => this.radioChang(val, i)}
                        value={i.checked}
                      >
                        {i.text}
                      </Radio>
                    )
                  })
                }
              ]}
            ></Collapse>
          )
        })}
      </div>
    )
  }
}

export default TodoList
