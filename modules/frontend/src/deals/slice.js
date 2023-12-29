import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import DealsClient from './client'
import {endOfToday, startOfToday} from '../common/functions/dates'

export const getTodayDeals =
    createAsyncThunk('deals/today', DealsClient.getSummariesForToday)

export const getDeals =
    createAsyncThunk('deals/by-date', DealsClient.getSummaries)

const initialState = {
  dateRange: {
    from: startOfToday(),
    to: endOfToday()
  },
  status: 'idle',
  error: null,
  todayItems: {
    unrecognized: {total: 0, items: []},
    profitable: {total: 0, items: []},
    rest: {total: 0, items: []}
  },
  items: {
    unrecognized: {total: 0, items: []},
    profitable: {total: 0, items: []},
    rest: {total: 0, items: []}
  }
}

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload
    }
  },
  extraReducers: builder => {
    builder
        .addCase(getTodayDeals.pending, (state) => {
          state.error = null
          state.status = 'loading'
        })
        .addCase(getTodayDeals.fulfilled, (state, action) => {
          state.status = 'succeeded'
          state.items = action.payload
          state.todayItems = action.payload
        })
        .addCase(getTodayDeals.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message
        })
        .addCase(getDeals.pending, (state) => {
          state.error = null
          state.status = 'loading'
        })
        .addCase(getDeals.fulfilled, (state, action) => {
          state.dateRange = {
            from: action.meta.arg.from,
            to: action.meta.arg.to
          }
          state.status = 'succeeded'
          state.items = action.payload
        })
        .addCase(getDeals.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message
        })
  }
})

export default dealsSlice.reducer
