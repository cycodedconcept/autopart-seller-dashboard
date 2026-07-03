import { createSlice } from '@reduxjs/toolkit'
import { initialCustomers } from '../utils/mockData'

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    list: initialCustomers,
    selectedCustomer: null,
  },
  reducers: {
    addCustomer: (state, action) => {
      state.list.unshift({
        refNumber: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        dateJoined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        avatar: action.payload.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80",
        ...action.payload,
      })
    },
    updateCustomer: (state, action) => {
      const index = state.list.findIndex(c => c.refNumber === action.payload.refNumber)
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload }
      }
    },
    toggleCustomerStatus: (state, action) => {
      const customer = state.list.find(c => c.refNumber === action.payload)
      if (customer) {
        customer.status = customer.status === 'Active' ? 'Inactive' : 'Active'
      }
    },
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = state.list.find(c => c.refNumber === action.payload) || null
    }
  }
})

export const { addCustomer, updateCustomer, toggleCustomerStatus, setSelectedCustomer } = customerSlice.actions
export default customerSlice.reducer
