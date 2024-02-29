import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons'

import './entry.less'

const pageNames = {
  '/popup/later': '稍后再看',
  '/popup/urlGroup': '网页组',
  '/popup/todoKeys': '关键词记事本',
}

function Entry() {
  const location = useLocation()
  const navigator = useNavigate()

  const pageBack = () => {
    navigator('/')
  }
  return (
    <div className='sub-popup'>
      <div className='header flex-x-start'>
        <div className='back flex-center'>
          <LeftOutlined onClick={pageBack} />
        </div>
        <div className='flex-center flex'>{pageNames[location.pathname]}</div>
      </div>
      <div className='content'>
        <Outlet />
      </div>
    </div>
  )
}

export default Entry
