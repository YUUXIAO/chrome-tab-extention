import React from 'react'
import { Button, message, Radio, Select, Input, Space, Collapse } from 'antd'
const { Option } = Select

class TodoList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLabel: '标签1',
      showLabelModal: false,
      addLabelVal: '',
      enterVal: '1',
      todoList: [
        {
          name: '标签1',
          todos: [],
        },
      ],
    }
  }
  inputChange = val => {
    this.setState({
      enterVal: val.target.value,
    })
  }
  onEnter = val => {
    const value = val.target.value
    const { todoList, currentLabel } = this.state
    const labelTodos = todoList.find(i => i.name === currentLabel)
    const hasSome = labelTodos.todos.some(i => i.text === value)
    if (!val) {
      message.warning('不能提交空白待办~')
      return
    }
    if (!hasSome) {
      labelTodos.todos.push({
        checked: false,
        text: value,
      })
    } else {
      message.warning('该分类下已有重复待办~')
    }
    this.setState({
      todoList: todoList,
    })
  }
  onLabelChange = val => {
    this.setState({
      currentLabel: val,
    })
  }

  radioChang = (val, option) => {
    option.checked = val
  }
  onLabelInput = val => {
    this.setState({
      addLabelVal: val.target.value,
    })
  }
  // 添加标签
  addLabel = () => {
    // const instance = modal.su
    // let val = this.refs.labelRef.value
    const { addLabelVal, todoList } = this.state
    if (!addLabelVal) {
      message.warning('不能提交空白标签~')
      return
    }
    const hasSameLabel = todoList.find(i => i.name === addLabelVal)
    if (!hasSameLabel) {
      const todoOpt = {
        name: addLabelVal,
        todos: [],
      }
      todoList.push(todoOpt)
      this.setState({ todoList, addLabelVal: '' })
    } else {
      message.warning('已有重复标签~')
    }
  }

  render() {
    const { todoList, currentLabel, showLabelModal } = this.state
    return (
      <div className='todo-wrapper'>
        <Space.Compact style={{ width: '100%' }}>
          <Input onChange={this.onLabelInput} value={this.state.addLabelVal} placeholder='请输入标签名' />
          <Button type='primary' onClick={this.addLabel}>
            添加标签
          </Button>
        </Space.Compact>
        <div className='flex-x-start'>
          <Select placeholder='请选择' onChange={this.onLabelChange} className='w200' defaultValue={todoList[0].name}>
            {todoList.map(label => {
              return <Option value={label.name}>{label.name}</Option>
            })}
          </Select>
          <Input placeholder='请输入' allowClear onChange={this.inputChange} onPressEnter={this.onEnter} />
        </div>
        {/* TODO 列表 */}
        {todoList.map((item, index) => {
          return (
            <Collapse
              bordered
              dataSource={todoList}
              key={index}
              items={[
                {
                  key: index,
                  label: item.name,
                  children: item.todos.map(i => {
                    return (
                      <Radio onChange={val => this.radioChang(val, i)} value={i.checked} key={i.text}>
                        {i.text}
                      </Radio>
                    )
                  }),
                },
              ]}
            ></Collapse>
          )
        })}
      </div>
    )
  }
}

export default TodoList
