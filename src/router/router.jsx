import { createHashRouter } from 'react-router-dom'
import PopupHome from "@/popup/pages/Home"
// TODO 动态导入

const routerConfigs = createHashRouter  ([
  {
    path: "/",
    element:<PopupHome />
  },
  {
    path: "/home",
    element: <PopupHome />
  }
])

export default routerConfigs
