import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

export const getStock = createAsyncThunk('stock/get', async () => {
  // TODO: get stock
  console.log('getting stock', Math.random())
  return [];
})

const initialState = {
  status: 'idle',
  items: []
}

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
        .addCase(getStock.pending, (state, action) => {
          state.status = 'loading'
        })
        .addCase(getStock.fulfilled, (state, action) => {
          state.status = 'succeeded'
          console.log('received stock', action)
          // Add any fetched posts to the array
          state.items = action.payload
        })
        .addCase(getStock.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message
        })
  }
})

export default stockSlice.reducer
