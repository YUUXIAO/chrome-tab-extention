// import { useState } from "react"
import React, { useState } from "react"
import ReactDOM from "react-dom/client"
import "./index.less"
import floatLogo from "@/assests/images/logo.png"
import QuickMenuPop from "./components/quickMenuPop.jsx"

function ContentIndex() {
  console.error("chromr Tabs 注入页面content代码------")

  const [isQuickVisible, setIsQuickVisible] = useState(false)

  const openQuickModal = (visble) => {
    console.error("11", visble)
    // e.stopPropagation()
    setIsQuickVisible(visble)
  }

  return (
    <div id="content-container">
      <div className="float-image">
        {/* <img
          alt=""
          src={floatLogo}
          className="img"
          onClick={() => openQuickModal(true)}
        ></img> */}
      </div>
      {/* 快捷弹窗 */}
      <QuickMenuPop
        isVisible={isQuickVisible}
        toggleModal={() => openQuickModal(false)}
      />
    </div>
  )
}

// TODO build 要打开
// 创建id为CRX-container的div
const app = document.createElement("div")
app.id = "content-container"
// 将刚创建的div插入body最后
document.body.appendChild(app)
const root = ReactDOM.createRoot(document.getElementById("content-container"))
root.render(<ContentIndex />)

// export default ContentIndex
