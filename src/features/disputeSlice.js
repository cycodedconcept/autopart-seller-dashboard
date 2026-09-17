import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as disputes from '../services/disputes'
import { serializeApiError } from '../utils/apiError'

export const fetchDisputes = createAsyncThunk('disputes/fetchDisputes', async (query, { rejectWithValue, signal }) => {
  try { return await disputes.listSellerDisputes(query, { signal }) }
  catch (error) { return rejectWithValue(serializeApiError(error)) }
})

export const fetchDispute = createAsyncThunk('disputes/fetchDispute', async (id, { rejectWithValue, signal }) => {
  try { return await disputes.getSellerDispute(id, { signal }) }
  catch (error) { return rejectWithValue(serializeApiError(error)) }
})

export const respondToDispute = createAsyncThunk('disputes/respondToDispute', async ({ id, message, files }, { rejectWithValue }) => {
  try { return await disputes.respondToSellerDispute(id, { message, files }) }
  catch (error) { return rejectWithValue(serializeApiError(error)) }
}, { condition: (_, { getState }) => !getState().disputes.responding })

const initialState = {
  list: [], pagination: null, filters: null,
  query: { status: 'all', dateFrom: '', dateTo: '', page: 1, limit: 10 },
  loading: false, error: null, requestId: null,
  detail: null, detailLoading: false, detailError: null, detailRequestId: null,
  responding: false, responseError: null, responseSuccess: false,
}

const disputeSlice = createSlice({
  name: 'disputes',
  initialState,
  reducers: {
    clearResponseFeedback(state) { state.responseError = null; state.responseSuccess = false },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDisputes.pending, (state, action) => {
        state.loading = true; state.error = null; state.requestId = action.meta.requestId
        state.query = { ...initialState.query, ...action.meta.arg }
      })
      .addCase(fetchDisputes.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.loading = false; state.requestId = null
        state.list = action.payload.disputes; state.pagination = action.payload.pagination; state.filters = action.payload.filters
      })
      .addCase(fetchDisputes.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.loading = false; state.requestId = null
        if (!action.meta.aborted) state.error = action.payload || { message: action.error.message }
      })
      .addCase(fetchDispute.pending, (state, action) => {
        state.detail = null; state.detailLoading = true; state.detailError = null
        state.responseError = null; state.responseSuccess = false; state.detailRequestId = action.meta.requestId
      })
      .addCase(fetchDispute.fulfilled, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return
        state.detailLoading = false; state.detailRequestId = null; state.detail = action.payload
      })
      .addCase(fetchDispute.rejected, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return
        state.detailLoading = false; state.detailRequestId = null
        if (!action.meta.aborted) state.detailError = action.payload || { message: action.error.message }
      })
      .addCase(respondToDispute.pending, state => {
        state.responding = true; state.responseError = null; state.responseSuccess = false
      })
      .addCase(respondToDispute.fulfilled, (state, action) => {
        state.responding = false; state.responseSuccess = true; state.detail = action.payload
        const index = state.list.findIndex(item => String(item.id) === String(action.payload.dispute.id))
        if (index !== -1) state.list[index] = action.payload.dispute
      })
      .addCase(respondToDispute.rejected, (state, action) => {
        state.responding = false
        state.responseError = action.payload || { message: action.error.message }
      })
  },
})

export const { clearResponseFeedback } = disputeSlice.actions
export default disputeSlice.reducer
