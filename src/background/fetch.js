const BASE_URL = 'http://127.0.0.1:3000'
// const PROD_BASE_URL = 'http://120.24.190.164:8181'

export const fetchGet = url => {
  return fetch(url)
}

export const fetchPost = (url, token, payload) => {
  return fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}
