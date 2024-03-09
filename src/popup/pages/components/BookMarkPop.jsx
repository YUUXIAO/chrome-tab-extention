import React, { useState, useEffect } from 'react'
import bookMarksUtils from '@/extentionUtils/bookmarks.js'
import { Modal, Form, Input, Checkbox, Select } from 'antd'

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}

const getAllDirs = (data, originDirs = []) => {
  const dirs = originDirs || []
  if (!data.length) return []
  data.forEach(item => {
    if (item?.children) {
      dirs.push({
        parentId: item.parentId,
        title: item.title,
        id: item.id,
      })
      getAllDirs(item.children, dirs)
    }
  })
  return dirs
}
function BookMarkPop(props) {
  const [bookMarksDir, setBookMarksDir] = useState()
  const [defaultId, setDefaultId] = useState()
  const [form] = Form.useForm()

  useEffect(() => {
    bookMarksUtils.getAllBookMarks().then(res => {
      const result = getAllDirs(res[0].children)
      setDefaultId(result[0]?.id || '')
      form.setFieldsValue({ dir: result[0]?.id })
      setBookMarksDir(result)
    })
  }, [form])

  const changeCheck = e => {
    const val = e.target.checked
    form.setFieldValue({ check: val })
  }

  const submit = val => {
    const { dir, notBookmark } = form.getFieldsValue()
    if (notBookmark) {
      props.createBookMarks(null)
    } else {
      // 需要创建书签
      let bookmarks = {
        parentId: dir,
        title: props.tabData.title,
        url: props.tabData.url,
      }
      bookMarksUtils.createBookMarks(bookmarks).then(res => {
        props.createBookMarks(res.id)
      })
    }
  }

  return (
    <div id='booksmarket-pop'>
      <Modal title='添加书签' form={form} open={props.isVisible} onCancel={() => props.toggleModal(false)} onOk={submit}>
        <Form form={form} initialValues={{ notBookmark: false }} {...layout}>
          <Form.Item label='名称：'>
            <div className='app-oneline'>{props.tabData.title}</div>
            <div className='app-oneline' style={{ fontSize: '12px', color: '#aaa' }}>
              {props.tabData.url}
            </div>
          </Form.Item>
          <Form.Item label='文件夹：' name='dir'>
            <Select options={bookMarksDir} placeholder='选择文件夹' fieldNames={{ label: 'title', value: 'id' }} />
          </Form.Item>
          <Form.Item name='notBookmark' valuePropName='checked'>
            <Checkbox onChange={changeCheck}>不需要写入书签文件</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BookMarkPop
