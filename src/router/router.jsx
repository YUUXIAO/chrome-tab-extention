import { createBrowserRouter } from "react-router-dom"
import PopupHome from "@/popup/pages/Home"
// TODO 动态导入

const routerConfigs = createBrowserRouter([
  {
    path: "/",
    element: "空白"
  },
  {
    path: "/home",
    element: <PopupHome />
  }
])

export default routerConfigs
