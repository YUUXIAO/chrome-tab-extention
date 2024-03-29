import axios from 'axios'
import storageUtils from '@/extentionUtils/storage'
import Store from '@/store/index'
import { setUserInfo } from '@/store/action.js'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
axios.defaults.timeout = 10000

// 请求拦截器
axios.interceptors.request.use(
  async config => {
    return storageUtils.getStorageItem('token').then(val => {
      val && (config.headers.Authorization = `Bearer ${val}`)
      return config
    })
  },
  error => {
    return Promise.error(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200 && response.data.error === 0) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是2开头的的情况
  error => {
    if (error?.response?.status) {
      switch (error.response.status) {
        case 401:
        case 403:
          Store.dispatch(setUserInfo({}))
          break

        default:
          console.log(JSON.stringify(error.response.data.msg))
      }
      return Promise.reject(error.response)
    }
    return Promise.reject(error)
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
        reject(err)
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
        reject(err)
      })
  })
}

export function put(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .put(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
