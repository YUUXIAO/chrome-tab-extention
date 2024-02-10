import { get, post } from './http'
const _API = {
  login: '/login',
  createTag: '/createTag', // 创建标签
  sendMail: '/sendMail',
}

export const userLogin = payload => {
  return post(_API.login, payload)
}
export const sendMail = payload => {
  return get(_API.sendMail, payload)
}

export const createUrlTag = payload => {
  return post(_API.createTag, payload)
}

// 获取用户的收藏
export const mockUserCollect = [
  {
    title: '【待定】v2.39.16【保单管理】续保加保引导 -迭代-深蓝保小程序-TAPD平台',
    url: 'https://www.tapd.cn/40331672/prong/iterations/card_view?q=08e5996de2682c4fc499a531a743f7af',
  },
  {
    title: '插件 API | Vite 官方中文文档',
    url: 'https://cn.vitejs.dev/guide/api-plugin.html#universal-hooks',
  },
]
