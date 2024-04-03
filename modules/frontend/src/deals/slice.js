import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import DealsClient from './client'
import {endOfToday, startOfToday} from '../common/functions/dates'
import Status from '../common/status'

export const getTodayDeals =
    createAsyncThunk('deals/today', DealsClient.getSummariesForToday)

export const getDeals =
    createAsyncThunk('deals/by-date', DealsClient.getSummaries)

const initialState = {
  dateRange: {
    from: startOfToday(),
    to: endOfToday()
  },
  status: Status.IDLE,
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
          state.status = Status.LOADING
        })
        .addCase(getTodayDeals.fulfilled, (state, action) => {
          state.status = Status.SUCCEEDED
          state.items = action.payload
          state.todayItems = action.payload
        })
        .addCase(getTodayDeals.rejected, (state, action) => {
          state.status = Status.FAILED
          state.error = action.error.message
        })
        .addCase(getDeals.pending, (state) => {
          state.error = null
          state.status = Status.LOADING
        })
        .addCase(getDeals.fulfilled, (state, action) => {
          state.dateRange = {
            from: action.meta.arg.from,
            to: action.meta.arg.to
          }
          state.status = Status.SUCCEEDED
          state.items = action.payload
        })
        .addCase(getDeals.rejected, (state, action) => {
          state.status = Status.FAILED
          state.error = action.error.message
        })
  }
})

export default dealsSlice.reducer
