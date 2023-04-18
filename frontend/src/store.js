import { configureStore } from '@reduxjs/toolkit'
import stockReducer from './stock/slice'

export default configureStore({
  reducer: {
    stock: stockReducer
  },
})