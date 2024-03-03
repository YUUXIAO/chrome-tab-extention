// import { useState } from "react"
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.less'
import { Popover } from 'antd'
import floatLogo from '@/assests/images/logo.png'
import QuickMenuPop from './components/quickMenuPop.jsx'

const qucikMenus = [
  {
    name: '快速网页',
    id: 'websits',
  },
  {
    name: '快速打开一组',
    id: 'group',
  },
  {
    name: 'TODO LIST',
    id: 'todo',
  },
]

function ContentIndex() {
  const [isQuickVisible, setIsQuickVisible] = useState(false)

  const openQuickModal = visble => {
    // e.stopPropagation()
    setIsQuickVisible(visble)
  }

  return (
    <div id='content-container'>
      <div className='float-image'>
        <Popover
          placement='left'
          content={
            <>
              {qucikMenus.map(item => {
                return (
                  <div key={item.id} className='quick-item'>
                    {item.name}
                  </div>
                )
              })}
            </>
          }
          title='快捷方式'
        >
          <img alt='' src={floatLogo} className='img' onClick={() => openQuickModal(true)}></img>
        </Popover>
      </div>
      {/* 快捷弹窗 */}
      {/* <QuickMenuPop
        isVisible={isQuickVisible}
        toggleModal={() => openQuickModal(false)}
      /> */}
    </div>
  )
}

// TODO mock 要打开
// 创建id为CRX-container的div
// const app = document.createElement("div")
// app.id = "content-container"
// // 将刚创建的div插入body最后
// document.body.appendChild(app)
// const root = ReactDOM.createRoot(document.getElementById("content-container"))
// root.render(<ContentIndex />)

export default ContentIndex
