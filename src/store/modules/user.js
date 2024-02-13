import { mockUserCollect } from '@/api/user'
import { getDeepKeys } from '@/utils.js'

// 用户模块

const initState = {
  userInfo: {}, // 用户信息
  favorUrlMaps: [], // tab信息LIST
  allBookmarks: [], // 所有书签
  collectUrls: [], // 收藏的网址
}

// 定义一个纯函数reducer，专门用来操作state中的数据,要返回一个新的state
const reducers = (state = initState, action) => {
  // 收藏网址
  if (action.type === 'set_collect') {
    return {
      ...state,
      collectUrls: action.payload,
    }
  }
  // 添加收藏
  // if (action.type === 'favor_add') {
  //   console.error('acticon', action)
  //   console.error(state.favorUrls)
  //   let listData = []
  //   if (Array.isArray(action.payload)) {
  //     listData = [...state.favorUrlMaps, ...action.payload]
  //     action.payload.forEach(i => {
  //       state.favorUrls.add(i.url)
  //     })
  //   } else {
  //     listData.push(action.payload)
  //     state.favorUrls.add(action.payload.url)
  //   }
  //   return {
  //     ...state,
  //     favorUrlMaps: listData,
  //     favorUrls: state.favorUrls,
  //   }
  // }
  // 删除收藏
  // if (action.type === 'favor_reduce') {
  //   const { url } = action.payload
  //   state.favorUrls.delete(url)
  //   return {
  //     ...state,
  //     favorUrlMaps: state.favorUrlMaps.filter(i => i.url !== url),
  //     favorUrls: state.favorUrls,
  //   }
  // }

  // 获取到用户信息
  if (action.type === 'get_user') {
    return {
      ...state,
      userInfo: Object.assign({}, state.userInfo, action.payload),
      collectUrls: action.payload.collectUrls || [],
    }
  }

  // 获取书签栏
  if (action.type === 'get_bookmarks') {
    return {
      ...state,
      allBookmarks: action.payload,
      allBookmarksUrls: getDeepKeys(action.payload, 'url'),
    }
  }
  return state
}

export default reducers
