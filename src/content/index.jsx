// import { useState } from "react"
import React from "react"
import ReactDOM from "react-dom/client"
import "./index.less"
import floatLogo from "@/assests/images/logo.png"

function ContentIndex() {
  console.error("chromr Tabs 注入页面content代码")
  return (
    <div id="content-container">
      <div>content 页岩 </div>
      {/* <div className="float-image">
        <img alt="" src={floatLogo} className="img"></img>
      </div> */}
    </div>
  )
}

// 创建id为CRX-container的div
// const app = document.createElement("div")
// app.id = "content-container"
// // 将刚创建的div插入body最后
// document.body.appendChild(app)
// const root = ReactDOM.createRoot(document.getElementById("content-container"))
// root.render(<ContentIndex />)

export default ContentIndex
