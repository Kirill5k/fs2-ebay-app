import { defaultRequestParams, reject } from '../common/functions/http'

const StockClient = {
  getAll: () => fetch('/api/stock', defaultRequestParams)
      .then(res => res.status === 200 ? res.json() : reject(res))
}

export default StockClient