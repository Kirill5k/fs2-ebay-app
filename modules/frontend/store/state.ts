import {createStore} from 'zustand/vanilla'
import {startOfDay, endOfDay} from 'date-fns'

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

type DealsActions = {}

export type DealsStore = DealsState & DealsActions

const now = new Date()

const defaultState: DealsStore = {
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
  return createStore<DealsStore>()((set) => ({
    ...initState,
  }))
}
