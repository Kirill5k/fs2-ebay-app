export const defaultRequestParams = {
  headers: {
    'Content-Type': 'application/json'
  },
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'include'
}

export const reject = (res) => res.json().then(e => {
  // eslint-disable-next-line
  return Promise.reject({ message: e.message, status: res.status })
})
