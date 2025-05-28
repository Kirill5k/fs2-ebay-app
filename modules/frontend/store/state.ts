import {createStore} from 'zustand/vanilla'
import {startOfDay, endOfDay, format} from 'date-fns'

interface DealsFilters {
  from: Date
  to: Date
}

interface StockFilters {
  kind: string | undefined
  retailer: string | undefined
  brand: string | undefined
  minPrice: string | undefined
  maxPrice: string | undefined
  size: string | undefined
}

interface StockSort {
  by: string
  asc: boolean
}

type DealsState = {
  deals: any[]
  stock: any[]
  stockFilters: StockFilters
  stockSort: StockSort
  dealsFilters: DealsFilters
}

type DealsActions = {
  fetchDeals: () => Promise<void>
  fetchStock: () => Promise<void>
}

export type DealsStore = DealsState & DealsActions

const now = new Date()

const defaultState: DealsState = {
  deals: [],
  stock: [],
  stockFilters: {
    kind: undefined,
    retailer: undefined,
    brand: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    size: undefined,
  },
  stockSort: {by: 'price', asc: true},
  dealsFilters: {
    from: startOfDay(now),
    to: endOfDay(now),
  },
}

export const createDealsStore = (initState: DealsState = defaultState) => {
  return createStore<DealsStore>()((set, get) => ({
    ...initState,

    fetchDeals: async () => {
      const { dealsFilters } = get()
      const from = format(dealsFilters.from, `yyyy-MM-dd'T'HH:mm:ss`)
      const to = format(dealsFilters.to, `yyyy-MM-dd'T'HH:mm:ss`)
      try {
        const response = await fetch(`/api/resellable-items?from=${from}&to=${to}`)
        const deals = await response.json()
        set({deals})
      } catch (error) {
        console.error('Failed to fetch deals:', error)
      }
    },

    fetchStock: async () => {
      try {
        const response = await fetch('/api/stock')
        const stock = await response.json()
        set({stock})
      } catch (error) {
        console.error('Failed to fetch stock:', error)
      }
    },
  }))
}
