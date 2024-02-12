import axios from 'axios'
import { isExtentionEnv } from '@/utils.js'

const BASE_URL = 'http://127.0.0.1:3000'

axios.defaults.baseURL = BASE_URL
axios.defaults.timeout = 10000

// 请求拦截器
axios.interceptors.request.use(
  async config => {
    let token = ''
    if (isExtentionEnv()) {
      const tokenObj = await chrome.storage.sync.get('token')
      token = tokenObj.token
      console.error('请求拦截器-token', token)
    } else {
      token = localStorage.getItem('token') || ''
    }
    console.error(111)
    token && (config.headers.Authorization = `Bearer ${token}`)
    return config
  },
  error => {
    return Promise.error(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    console.error('响应拦截器', response)
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是2开头的的情况
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        case 401:
          alert('未登录')
          break

        // 403 token过期

        case 403:
          alert('登录过期，请重新登录')
          break

        // 404请求不存在
        case 404:
          alert('网络请求不存在')
          break
        // 其他错误，直接抛出错误提示
        default:
          alert(JSON.stringify(error.response.data.message))
      }
      return Promise.reject(error.response)
    }
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
