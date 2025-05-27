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

export type DealsState = {
  deals: any[]
  stock: any[]
  stockFilters: StockFilters
  stockSort: StockSort
  dealsFilters: DealsFilters
}

export type DealsActions = {}

export type DealsStore = DealsState & DealsActions

export const defaultState: DealsStore = {
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
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  },
}

export const initDefaultState = (): DealsState => {
  return {
    ...defaultState,
  }
}

export const createDealsStore = (initState: DealsState = defaultState) => {
  return createStore<DealsStore>()((set) => ({
    ...initState,
  }))
}
