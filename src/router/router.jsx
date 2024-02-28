import { createBrowserRouter, createHashRouter } from 'react-router-dom'
import PopupHome from '@/popup/pages/Home'
import TodoList from '@/popup/pages/components/TodoList'
import Entry from '@/popup/pages/Entry'
import Contnet from '@/content/index.jsx'
import LaterPage from '@/popup/pages/LaterPage'
// import ContentHome from "@/content/index"

const routerConfigs = createHashRouter([
  {
    path: '/',
    element: <PopupHome />,
  },
  {
    path: '/popup',
    element: <Entry />,
    children: [
      {
        path: 'later',
        name: '稍后再看',
        element: <LaterPage />,
      },
    ],
  },
])

export default routerConfigs
