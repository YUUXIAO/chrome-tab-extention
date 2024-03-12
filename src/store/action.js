// 添加收藏
export const addCollect = payload => {
  return { type: 'set_collect', payload }
}

// 设置用户信息
export const setUserInfo = payload => {
  return { type: 'get_user', payload }
}

// 设置登录窗口信息
export const setLoginWindow = payload => {
  return { type: 'get_loginWindow', payload }
}

// 获取书签栏
export const saveReducer = payload => ({
  type: 'get_bookmarks',
  payload,
})
