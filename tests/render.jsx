import { render } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import productReducer from '../src/features/productSlice'
import orderReducer from '../src/features/orderSlice'
import transactionReducer from '../src/features/transactionSlice'
import disputeReducer from '../src/features/disputeSlice'
import authReducer from '../src/features/authSlice'

export const createTestStore = (products, orders, transactions, disputes, auth) => configureStore({
  reducer: { products: productReducer, orders: orderReducer, transactions: transactionReducer, disputes: disputeReducer, auth: authReducer },
  preloadedState: {
    products: { ...productReducer(undefined, { type: 'init' }), ...products },
    orders: { ...orderReducer(undefined, { type: 'init' }), ...orders },
    transactions: { ...transactionReducer(undefined, { type: 'init' }), ...transactions },
    disputes: { ...disputeReducer(undefined, { type: 'init' }), ...disputes },
    auth: { ...authReducer(undefined, { type: 'init' }), ...auth },
  },
})
export function renderScreen(component, { path = '/', route = '/', products, orders, transactions, disputes, auth } = {}) {
  const store = createTestStore(products, orders, transactions, disputes, auth)
  const result = render(<Provider store={store}><MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes><Route path={route} element={component} /></Routes>
  </MemoryRouter></Provider>)
  return { ...result, store }
}
