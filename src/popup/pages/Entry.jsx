import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons'

import './entry.less'

const pageNames = {
  '/popup/later': '稍后再看',
}

function Entry() {
  const location = useLocation()
  const navigator = useNavigate()
  console.error('入口文件', navigator)

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
