import { configureStore } from '@reduxjs/toolkit'
import productReducer from '../features/productSlice'
import orderReducer from '../features/orderSlice'
import customerReducer from '../features/customerSlice'
import transactionReducer from '../features/transactionSlice'

export const store = configureStore({
  reducer: {
    products: productReducer,
    orders: orderReducer,
    customers: customerReducer,
    transactions: transactionReducer,
  },
})