export const fetchGet = url => {
  return fetch(url)
}

export const fetchPost = (url, token, payload) => {
  return fetch(`${import.meta.env.VITE_BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}
