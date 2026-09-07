import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/axios'

const mapApiCustomer = (c, idx) => ({
  refNumber: c.buyerId || c.id || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
  name: c.fullName || 'Customer',
  email: c.email || '',
  phone: c.phone || '',
  avatar: c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.fullName || 'C')}&background=FF7101&color=fff&bold=true`,
  totalOrders: Number(c.totalOrders) || 0,
  totalItems: Number(c.totalItems) || 0,
  totalSpent: Math.floor((Number(c.totalSpentKobo) || 0) / 100),
  dateJoined: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
  status: 'Active',
})

export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/seller/customers')
    return res
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    list: [],
    selectedCustomer: null,
    loading: false,
    error: null,
    pagination: null,
  },
  reducers: {
    addCustomer: (state, action) => {
      state.list.unshift({
        refNumber: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        dateJoined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        avatar: action.payload.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80",
        status: 'Active',
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false
        const data = action.payload.data || {}
        const customers = data.topCustomers || data.customers || (Array.isArray(data) ? data : [])
        state.list = customers.map(mapApiCustomer)
        state.pagination = data.pagination || null
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { addCustomer, updateCustomer, toggleCustomerStatus, setSelectedCustomer } = customerSlice.actions
export default customerSlice.reducer
