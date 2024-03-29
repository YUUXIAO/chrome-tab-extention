import { getDeepKeys, hasToken } from '@/utils.js'
// 用户模块

const initState = {
  isLogin: false,
  loginWindowId: null,
  aa: 1,
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

  // 获取到用户信息
  if (action.type === 'get_user') {
    return {
      ...state,
      userInfo: Object.assign({}, state.userInfo, action.payload),
      collectUrls: action.payload.collectUrls || [],
      isLogin: Boolean(action.payload?.mail) || false,
    }
  }
  // 获取到登录窗口信息
  if (action.type === 'get_loginWindow') {
    return {
      ...state,
      loginWindowId: action.payload,
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
