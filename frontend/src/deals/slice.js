import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

const initialState = {}

const dealsSlice = createSlice({
  name: 'deals',
  initialState
})

export default dealsSlice.reducer
