import { Outlet, useLocation } from "react-router-dom"
function Entry() {
  // 获取当前路由location
  const location = useLocation()

  return <Outlet />
}

export default Entry
