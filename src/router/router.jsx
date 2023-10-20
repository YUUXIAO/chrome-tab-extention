import { createHashRouter } from "react-router-dom"
import PopupHome from "@/popup/pages/Home"
import ContentHome from "@/content/index"
// TODO 动态导入

const routerConfigs = createHashRouter([
  // {
  //   path: "/",
  //   element: <ContentHome />,
  //   children: []
  // },
  {
    path: "/",
    element: <ContentHome />,
    children: [{ path: "/aa", element: <div>11</div> }]
  }
])

export default routerConfigs
