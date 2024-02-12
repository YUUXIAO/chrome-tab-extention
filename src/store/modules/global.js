import { mockUserCollect } from '@/api/user'
import { getDeepKeys } from '@/utils.js'

// 全局模块
const initState = {
  isExtensionEnv: true, // 当前环境是插件模式
}

const reducers = (state = initState, action) => {
  // 判断环境
  // if (action.type === 'set_env') {
  //   console.error('判断环境判断环境判断环境', action.payload)
  //   return {
  //     ...state,
  //     isExtensionEnv: action.payload,
  //   }
  // }

  return state
}

export default reducers
