import { createHashRouter } from 'react-router-dom'
import PopupHome from '@/popup/pages/Home'
import HistoryPage from '@/popup/pages/HistoryPage'
import Entry from '@/popup/pages/Entry'
// import Contnet from '@/content/index.jsx'
import LaterPage from '@/popup/pages/LaterPage'
import TodoKeysPage from '@/popup/pages/TodoKeysPage'
import UrlsGroupPage from '@/popup/pages/UrlsGroupPage'
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
      {
        path: 'urlGroup',
        name: '网页组',
        element: <UrlsGroupPage />,
      },
      {
        path: 'todoKeys',
        name: '关键词记事本',
        element: <TodoKeysPage />,
      },
      {
        path: 'history',
        name: '历史记录',
        element: <HistoryPage />,
      },
    ],
  },
])

export default routerConfigs
