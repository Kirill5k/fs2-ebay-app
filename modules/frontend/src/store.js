import {configureStore} from '@reduxjs/toolkit'
import stockReducer from './stock/slice'
import dealsReducer from './deals/slice'

export default configureStore({
  reducer: {
    stock: stockReducer,
    deals: dealsReducer
  },
})