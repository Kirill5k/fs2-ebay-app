import { defaultRequestParams, reject } from '../common/functions/http'

const today = () => new Date().toISOString().slice(0, 10)

const DealsClient = {
  getSummaries: (from, to) => fetch(`/api/video-games/summary?from=${from}&to=${to}`, defaultRequestParams)
      .then(res => res.status === 200 ? res.json() : reject(res)),
  getSummariesForToday: () => fetch(`/api/video-games/summary?from=${today()}`, defaultRequestParams)
      .then(res => res.status === 200 ? res.json() : reject(res)),
}

export default DealsClient