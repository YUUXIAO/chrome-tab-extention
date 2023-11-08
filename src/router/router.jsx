import { createHashRouter } from "react-router-dom"
import PopupHome from "@/popup/pages/Home"
import TodoList from "@/popup/pages/components/TodoList"
import Entry from "@/popup/pages/Entry"
// import ContentHome from "@/content/index"
// TODO 动态导入

const routerConfigs = createHashRouter([
  {
    path: "/",
    // element: <Entry />,
    element: <PopupHome />,
    children: [
      {
        path: "/popup",
        element: <PopupHome />
      },
      {
        path: "/todo",
        element: <TodoList />
      }
    ]
  }
])

export default routerConfigs
