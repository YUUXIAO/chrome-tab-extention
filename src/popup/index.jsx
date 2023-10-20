import { RouterProvider } from "react-router-dom"
import routers from "@/router/router.jsx"

function Entry() {
  return <RouterProvider router={routers}></RouterProvider>
}

export default Entry
