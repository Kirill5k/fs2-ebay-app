import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import DealsClient from './client'

export const getTodayDeals =
    createAsyncThunk('deals/today', DealsClient.getSummariesForToday)

const initialState = {
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
  extraReducers: builder => {
    builder
        .addCase(getTodayDeals.pending, (state, action) => {
          state.error = null
          state.status = 'loading'
        })
        .addCase(getTodayDeals.fulfilled, (state, action) => {
          state.status = 'succeeded'
          state.items = action.payload
          state.todayItems = action.payload
        })
        .addCase(getTodayDeals.rejected, (state, action) => {
          console.log(action.error)
          state.status = 'failed'
          state.error = action.error.message
        })
  }
})

export default dealsSlice.reducer
