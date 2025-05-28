import {createStore} from 'zustand/vanilla'
import {startOfDay, endOfDay} from 'date-fns'

interface ResellableItems {
  loading: boolean
  error: string | null
  items: any[]
}

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
  deals: ResellableItems
  stock: ResellableItems
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
  deals: {items: [], loading: false, error: null},
  stock: {items: [], loading: false, error: null},
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
      set({deals: {loading: true, error: null, items: []}})
      const {
        dealsFilters: {from, to},
      } = get()
      try {
        const response = await fetch(`/api/resellable-items?from=${from.toISOString()}&to=${to.toISOString()}`)
        const items = await response.json()
        set({deals: {loading: false, error: null, items}})
      } catch (err) {
        console.error('Failed to fetch deals:', err)
        const error = err instanceof Error ? err.toString() : String(err)
        set({deals: {loading: false, error, items: []}})
      }
    },

    fetchStock: async () => {
      set({stock: {loading: true, error: null, items: []}})
      try {
        const response = await fetch('/api/stock')
        const items = await response.json()
        set({stock: {loading: false, error: null, items}})
      } catch (err) {
        console.error('Failed to fetch stock:', err)
        const error = err instanceof Error ? err.toString() : String(err)
        set({stock: {loading: false, error, items: []}})
      }
    },
  }))
}
