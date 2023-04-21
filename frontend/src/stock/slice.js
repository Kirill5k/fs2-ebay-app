import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {distinct} from "../common/collections";
import StockClient from './client'

export const getStock = createAsyncThunk('stock/get', StockClient.getAll)

const initialFilters = {
  kinds: [],
  retailers: [],
  brands: [],
  sizes: [],
  price: {
    min: 0,
    max: 5000,
  },
  discount: {
    min: 0,
    max: 100
  }
}

const initialState = {
  status: 'idle',
  error: null,
  items: [],
  selectedItems: [],
  filters: initialFilters,
  selectedFilters: initialFilters
}

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    filter: (state, action) => {
      const filters = {...action.payload}
      state.selectedFilters = filters
      state.selectedItems = state.items.filter(i => {
        const currentDiscount = i.price.discount || 0
        const currentPrice = i.price.buy || 0

        const byRetailer = filters.retailers.length > 0 ? filters.retailers.includes(i.listingDetails.seller) : true
        const byBrand = filters.brands.length > 0 ? filters.brands.includes(i.itemDetails.brand) : true
        const bySize = filters.sizes.length > 0 ? filters.sizes.includes(i.itemDetails.size) : true
        const byDiscount = currentDiscount >= filters.discount.min && currentDiscount < filters.discount.max
        const byPrice = currentPrice >= filters.price.min && currentPrice < filters.price.max
        const byKind = filters.kinds.length > 0 ? filters.kinds.includes(i.itemDetails.kind) : true

        return byRetailer && byBrand && bySize && byDiscount && byPrice && byKind
      })
    }
  },
  extraReducers: builder => {
    builder
        .addCase(getStock.pending, (state, action) => {
          state.error = null
          state.status = 'loading'
        })
        .addCase(getStock.fulfilled, (state, action) => {
          state.status = 'succeeded'
          state.items = action.payload
          state.selectedItems = action.payload
          state.filters.kinds = distinct(action.payload.map(i => i.itemDetails.kind))
          state.filters.brands = distinct(action.payload.map(i => i.itemDetails.brand))
          state.filters.sizes = distinct(action.payload.map(i => i.itemDetails.size))
          state.filters.retailers = distinct(action.payload.map(i => i.listingDetails.seller))
        })
        .addCase(getStock.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message
        })
  }
})

export const { filter } = stockSlice.actions
export default stockSlice.reducer

