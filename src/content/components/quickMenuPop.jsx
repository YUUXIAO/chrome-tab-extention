// 浮窗快捷按钮
// TODO 稍后再看

// import { useState } from "react"
import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom/client"
import { Modal } from "antd"
import "./index.less"
import floatLogo from "@/assests/images/logo.png"

function QuickMenuPop(props) {
  console.error("props", props)
  // const [isModalOpen, setIsModelOpen] = useState(false)

  // onCancel={props.toggleModal(false)}
  const handleCancel = () => {
    console.error("cancel")
  }

  const getAllTabs = async () => {
    // const ajaxArray = [
    //   ChromeUtils.getAllWindow(),
    //   ChromeUtils.getTabLists(),
    //   ChromeUtils.getCurrentWindowId()
    // ]
    // const [windows, allTabs, curWindowId] = await Promise.all(ajaxArray)
    // console.error("content-scripts 获取所有数据")
    // console.error("windows", allTabs)
    // console.error("curWindowId", curWindowId)
  }

  useEffect(() => {
    getAllTabs()
  })

  return (
    <div id="quick-menu-container">
      <Modal
        title="快捷弹窗"
        open={props.isVisible}
        onCancel={() => props.toggleModal(false)}
      >
        {/* 稍后再看 */}
        111
      </Modal>
    </div>
  )
}

export default QuickMenuPop
