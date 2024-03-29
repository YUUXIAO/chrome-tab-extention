import axios from 'axios'
import { get, post, put } from './http'
const _API = {
  login: '/login',
  createTag: '/createTag', // 创建标签
  sendMail: '/sendMail',
  favor: '/favor',
  userInfo: '/userinfo',
  later: '/later',
  todoKeys: '/todoKeys',
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
// 获取用户信息
export const getUserInfo = payload => {
  return get(_API.userInfo, payload)
}

// 收藏/取消收藏网址
export const urlCollect = payload => {
  return get(_API.favor, payload)
}

// 稍后再看
export const getLater = () => {
  return get(_API.later)
}
export const setLater = payload => {
  return post(_API.later, payload)
}

export const updateLater = payload => {
  return put(_API.later, payload)
}
export const deleteLater = payload => {
  return axios.delete(_API.later, { params: payload })
}

// 稍后再看
export const getTodoKeys = () => {
  return get(_API.todoKeys)
}
export const setTodoKeys = payload => {
  return post(_API.todoKeys, payload)
}

export const updateTodoKeys = payload => {
  return put(_API.todoKeys, payload)
}
export const deleteTodoKeys = payload => {
  return axios.delete(_API.todoKeys, { params: payload })
}
// 获取用户标签
export const getUrlTags = () => {
  return get(_API.createTag)
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
