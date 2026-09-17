import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as salesApi from '../services/sales'
import { serializeApiError } from '../utils/apiError'

export const fetchSales = createAsyncThunk('transactions/fetchSales', async (range, { signal, rejectWithValue }) => {
  try { return await salesApi.getSalesSummary(range, { signal }) }
  catch (error) { return rejectWithValue(serializeApiError(error)) }
})
export const fetchPayouts = createAsyncThunk('transactions/fetchPayouts', async (query, { signal, rejectWithValue }) => {
  try { return await salesApi.listPayouts(query, { signal }) }
  catch (error) { return rejectWithValue(serializeApiError(error)) }
})
export const fetchPayoutDetail = createAsyncThunk('transactions/fetchPayoutDetail', async (id, { getState, signal, rejectWithValue }) => {
  const state = getState().transactions
  const numericId = Number(String(id).replace(/^PO-/, ''))
  const cached = [state.createdPayout, ...state.payouts].find(payout => payout && Number(payout.id) === numericId)
  if (cached) return cached
  try { return await salesApi.getPayout(id, { signal }) }
  catch (error) { return rejectWithValue(serializeApiError(error)) }
})
export const requestPayout = createAsyncThunk('transactions/requestPayout', async (bankAccountRef, { rejectWithValue }) => {
  try { return await salesApi.createPayoutRequest(bankAccountRef) }
  catch (error) { return rejectWithValue(serializeApiError(error)) }
}, { condition: (_, { getState }) => !getState().transactions.requestingPayout })

export const refreshSalesAndPayouts = () => (dispatch, getState) => {
  const { salesQuery, payoutQuery } = getState().transactions
  return Promise.all([dispatch(fetchSales(salesQuery)), dispatch(fetchPayouts(payoutQuery))])
}

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    sales: null, salesQuery: {}, salesLoading: false, salesError: null, salesRequestId: null,
    payouts: [], payoutQuery: { status: '', page: 1, limit: 10 }, payoutPagination: null,
    payoutsLoading: false, payoutsError: null, payoutsRequestId: null,
    payoutDetail: null, detailLoading: false, detailError: null, detailRequestId: null,
    requestingPayout: false, requestError: null, createdPayout: null,
  },
  reducers: {
    clearPayoutFeedback(state) { state.requestError = null; state.createdPayout = null },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSales.pending, (state, action) => {
        state.salesLoading = true; state.salesError = null; state.salesRequestId = action.meta.requestId
        state.salesQuery = action.meta.arg || {}
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        if (state.salesRequestId !== action.meta.requestId) return
        state.salesLoading = false; state.salesRequestId = null; state.sales = action.payload
      })
      .addCase(fetchSales.rejected, (state, action) => {
        if (state.salesRequestId !== action.meta.requestId) return
        state.salesLoading = false; state.salesRequestId = null
        if (!action.meta.aborted) state.salesError = action.payload || { message: action.error.message }
      })
      .addCase(fetchPayouts.pending, (state, action) => {
        state.payoutsLoading = true; state.payoutsError = null; state.payoutsRequestId = action.meta.requestId
        state.payoutQuery = { status: '', page: 1, limit: 10, ...action.meta.arg }
      })
      .addCase(fetchPayouts.fulfilled, (state, action) => {
        if (state.payoutsRequestId !== action.meta.requestId) return
        state.payoutsLoading = false; state.payoutsRequestId = null
        state.payouts = action.payload.payouts; state.payoutPagination = action.payload.pagination
      })
      .addCase(fetchPayouts.rejected, (state, action) => {
        if (state.payoutsRequestId !== action.meta.requestId) return
        state.payoutsLoading = false; state.payoutsRequestId = null
        if (!action.meta.aborted) state.payoutsError = action.payload || { message: action.error.message }
      })
      .addCase(fetchPayoutDetail.pending, (state, action) => {
        state.detailLoading = true; state.detailError = null; state.payoutDetail = null
        state.detailRequestId = action.meta.requestId
      })
      .addCase(fetchPayoutDetail.fulfilled, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return
        state.detailLoading = false; state.detailRequestId = null; state.payoutDetail = action.payload
      })
      .addCase(fetchPayoutDetail.rejected, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return
        state.detailLoading = false; state.detailRequestId = null
        if (!action.meta.aborted) state.detailError = action.payload || { message: action.error.message }
      })
      .addCase(requestPayout.pending, state => {
        state.requestingPayout = true; state.requestError = null; state.createdPayout = null
      })
      .addCase(requestPayout.fulfilled, (state, action) => {
        state.requestingPayout = false; state.createdPayout = action.payload
        // A response started before creation could show balances/history from
        // before the new request. The form refetches both after success.
        state.salesRequestId = null; state.payoutsRequestId = null
        state.salesLoading = false; state.payoutsLoading = false
      })
      .addCase(requestPayout.rejected, (state, action) => {
        state.requestingPayout = false
        state.requestError = action.payload || { message: action.error.message }
      })
  },
})

export const { clearPayoutFeedback } = transactionSlice.actions
export default transactionSlice.reducer
