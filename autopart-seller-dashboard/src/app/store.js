import { configureStore } from '@reduxjs/toolkit'
import productReducer from '../features/productSlice'
import orderReducer from '../features/orderSlice'
import customerReducer from '../features/customerSlice'
import transactionReducer from '../features/transactionSlice'
import authReducer from '../features/authSlice'
import dashboardReducer from '../features/dashboardSlice'

export const store = configureStore({
  reducer: {
    products: productReducer,
    orders: orderReducer,
    customers: customerReducer,
    transactions: transactionReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
  },
})