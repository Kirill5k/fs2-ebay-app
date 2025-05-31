import {createStore} from 'zustand/vanilla'
import {startOfDay, endOfDay} from 'date-fns'

// Define types for the different components of ResellableItem
interface ItemDetails {
  kind: string // 'clothing', 'generic', etc.
  name: string
  brand?: string
  size?: string
}

interface ListingDetails {
  url: string
  title: string
  category: string | null
  shortDescription: string | null
  description: string | null
  image: string
  condition: string // 'NEW', 'USED', etc.
  datePosted: string // ISO string date format
  seller: string
  properties: Record<string, string> // HashMap<String, String>
}

interface Price {
  buy: number
  discount: number | null
  quantityAvailable: number
  sell: number | null
  credit: number | null
}

export interface ResellableItem {
  itemDetails: ItemDetails
  listingDetails: ListingDetails
  price: Price
  foundWith: string
}

interface ResellableItems {
  loading: boolean
  error: string | null
  items: ResellableItem[]
}

interface DealsFilters {
  from: Date
  to: Date
}

export interface StockFilters {
  kind: string[]
  retailer: string[]
  brand: string[]
  size: string[]
  minPrice: number | undefined
  maxPrice: number | undefined
  minDiscount: number | undefined
}

export interface StockSort {
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
  setStockFilters: (filters: StockFilters) => void
  setStockSort: (sort: StockSort) => void
  fetchDeals: () => Promise<void>
  fetchStock: () => Promise<void>
}

export type DealsStore = DealsState & DealsActions

const now = new Date()

const defaultState: DealsState = {
  deals: {items: [], loading: false, error: null},
  stock: {items: [], loading: false, error: null},
  stockFilters: {
    kind: [],
    retailer: [],
    brand: [],
    size: [],
    minPrice: undefined,
    maxPrice: undefined,
    minDiscount: undefined,
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

    setStockSort: (stockSort: StockSort) => set({stockSort}),
    setStockFilters: (stockFilters: StockFilters) => set({stockFilters}),

    fetchDeals: async () => {
      set({deals: {loading: true, error: null, items: []}})
      const {
        dealsFilters: {from, to},
      } = get()
      try {
        const response = await fetch(`/api/resellable-items?from=${from.toISOString()}&to=${to.toISOString()}&limit=100`)
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
