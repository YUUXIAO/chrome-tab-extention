import { mockUserCollect } from "@/api/user"

// 用户模块

const initState = {
  favorUrlMaps: [], // tab信息LIST
  favorUrls: new Set(mockUserCollect.map((i) => i.url)) // 收藏的网址
}

// 定义一个纯函数reducer，专门用来操作state中的数据,要返回一个新的state
const reducers = (state = initState, action) => {
  // 添加收藏
  if (action.type === "favor_add") {
    console.error("acticon", action)
    console.error(state.favorUrls)
    let listData = []
    if (Array.isArray(action.payload)) {
      listData = [...state.favorUrlMaps, ...action.payload]
      action.payload.forEach((i) => {
        state.favorUrls.add(i.url)
      })
    } else {
      listData.push(action.payload)
      state.favorUrls.add(action.payload.url)
    }
    console.error("listData", listData)
    return {
      ...state,
      favorUrlMaps: listData,
      favorUrls: state.favorUrls
    }
  }
  // 删除收藏
  if (action.type === "favor_reduce") {
    const { url } = action.payload
    state.favorUrls.delete(url)
    return {
      ...state,
      favorUrlMaps: state.favorUrlMaps.filter((i) => i.url !== url),
      favorUrls: state.favorUrls
    }
  }
  return state
}

export default reducers
