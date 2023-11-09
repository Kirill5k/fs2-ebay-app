export const defaultRequestParams = {
  headers: {
    'Content-Type': 'application/json'
  },
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'include'
}

/* eslint-disable */
export const reject = async res => {
  const text = await res.text()
  try {
    const e = JSON.parse(text)
    return Promise.reject({ message: e.message, status: res.status })
  } catch (err) {
    return Promise.reject({ message: 'Server not available', status: res.status })
  }
}
/* eslint-enable */
