import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/axios'

export const fetchSales = createAsyncThunk('transactions/fetchSales', async (dateRange = {}, { rejectWithValue }) => {
  try {
    const params = {}
    if (dateRange.dateFrom) params.dateFrom = dateRange.dateFrom
    if (dateRange.dateTo) params.dateTo = dateRange.dateTo
    const res = await api.get('/seller/sales', { params })
    return res
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const fetchPayouts = createAsyncThunk('transactions/fetchPayouts', async (filters = {}, { rejectWithValue }) => {
  try {
    const params = {}
    if (filters.status) params.status = filters.status
    if (filters.page) params.page = filters.page
    if (filters.limit) params.limit = filters.limit
    const res = await api.get('/seller/payouts', { params })
    return res
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const requestPayout = createAsyncThunk('transactions/requestPayout', async (bankAccountRef, { rejectWithValue }) => {
  try {
    const res = await api.post('/seller/payouts', { bankAccountRef })
    return res
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const mapPayoutRow = (p) => ({
  id: `PO-${String(p.id).padStart(4, '0')}`,
  customerName: 'Payout',
  avatar: 'https://picsum.photos/80/80?random=300',
  description: `Payout request${p.itemCount ? ` — ${p.itemCount} item${p.itemCount > 1 ? 's' : ''}` : ''}`,
  amount: Math.floor((Number(p.amountKobo) || 0) / 100),
  date: new Date(p.requestedAt || p.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, month: 'short', day: 'numeric', year: 'numeric' }),
  paymentMethod: p.bankAccountRef || 'Bank transfer',
  status: ['paid', 'approved'].includes(p.status)
    ? 'Completed'
    : p.status === 'rejected' ? 'Reversal' : 'Pending',
})

const mapSalesData = (data) => {
  if (!data) return null
  return {
    period: data.period || { dateFrom: '', dateTo: '' },
    commissionRatePercent: Number(data.commissionRatePercent) || 0,
    sales: {
      totalOrders: Number(data.sales?.totalOrders) || 0,
      totalItems: Number(data.sales?.totalItems) || 0,
      grossSales: Math.floor((Number(data.sales?.grossSalesKobo) || 0) / 100),
      commission: Math.floor((Number(data.sales?.commissionKobo) || 0) / 100),
      netSales: Math.floor((Number(data.sales?.netSalesKobo) || 0) / 100),
    },
    payouts: {
      pending: Math.floor((Number(data.payouts?.pendingKobo) || 0) / 100),
      requested: Math.floor((Number(data.payouts?.requestedKobo) || 0) / 100),
      approved: Math.floor((Number(data.payouts?.approvedKobo) || 0) / 100),
      paid: Math.floor((Number(data.payouts?.paidKobo) || 0) / 100),
    },
  }
}

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    list: [],
    selectedTransaction: null,
    sales: null,
    payouts: [],
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    addTransaction: (state, action) => {
      state.list.unshift({
        id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, month: 'short', day: 'numeric', year: 'numeric' }),
        ...action.payload,
      })
    },
    updateTransactionStatus: (state, action) => {
      const { transactionId, status } = action.payload
      const transaction = state.list.find(t => t.id === transactionId)
      if (transaction) { transaction.status = status }
    },
    setSelectedTransaction: (state, action) => {
      state.selectedTransaction = state.list.find(t => t.id === action.payload) || null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false
        state.sales = mapSalesData(action.payload.data)
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchPayouts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchPayouts.fulfilled, (state, action) => {
        state.loading = false
        const data = action.payload.data
        const payouts = data.payouts || data || []
        state.payouts = payouts
        state.list = payouts.map(mapPayoutRow)
      })
      .addCase(fetchPayouts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(requestPayout.pending, (state) => { state.loading = true; state.error = null })
      .addCase(requestPayout.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(requestPayout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { addTransaction, updateTransactionStatus, setSelectedTransaction } = transactionSlice.actions
export default transactionSlice.reducer
