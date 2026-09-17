import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as orders from '../services/orders'
import { serializeApiError } from '../utils/apiError'

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (query, { rejectWithValue, signal }) => {
  try { return await orders.listOrders(query, { signal }) }
  catch (error) { return rejectWithValue(serializeApiError(error)) }
})

export const refreshOrders = () => (dispatch, getState) => dispatch(fetchOrders(getState().orders.query))

export const fetchOrder = createAsyncThunk('orders/fetchOrder', async (id, { getState, rejectWithValue, signal }) => {
  // A filtered list omits other items, so it cannot fill the detail screen.
  const state = getState().orders
  const cached = state.listQuery && !state.listQuery.itemStatus && !state.loading && !state.error
    && state.list.find(order => String(order.id) === String(id))
  if (cached) return cached
  try { return await orders.getSellerOrder(id, { signal }) }
  catch (error) { return rejectWithValue(serializeApiError(error)) }
})

export const updateOrderStatusThunk = createAsyncThunk('orders/updateOrderStatus', async ({ orderItemId, itemStatus }, { rejectWithValue }) => {
  try { return await orders.updateOrderItemStatus(orderItemId, itemStatus) }
  catch (error) { return rejectWithValue(serializeApiError(error)) }
}, { condition: (_, { getState }) => getState().orders.updatingItemId == null })

const applyItemUpdate = (order, updated) => {
  if (!order || String(order.id) !== String(updated.order.id)) return
  const index = order.items.findIndex(item => String(item.id) === String(updated.id))
  if (index !== -1) {
    const { order: parent, ...item } = updated
    order.items[index] = { ...order.items[index], ...item }
    Object.assign(order, parent)
  }
}

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [], pagination: null, query: { itemStatus: '', page: 1, limit: 10 }, listQuery: null,
    loading: false, error: null, requestId: null,
    detail: null, detailLoading: false, detailError: null, detailRequestId: null,
    updatingItemId: null, updateError: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.pending, (state, action) => {
        state.loading = true; state.error = null; state.requestId = action.meta.requestId
        state.query = { itemStatus: '', page: 1, limit: 10, ...action.meta.arg }
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.loading = false; state.requestId = null
        state.list = action.payload.orders; state.pagination = action.payload.pagination
        state.listQuery = { ...state.query }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.loading = false; state.requestId = null
        if (!action.meta.aborted) state.error = action.payload || { message: action.error.message }
      })
      .addCase(fetchOrder.pending, (state, action) => {
        state.detail = null; state.detailLoading = true; state.detailError = null
        state.updateError = null; state.detailRequestId = action.meta.requestId
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return
        state.detailLoading = false; state.detail = action.payload; state.detailRequestId = null
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return
        state.detailLoading = false; state.detailRequestId = null
        if (!action.meta.aborted) state.detailError = action.payload || { message: action.error.message }
      })
      .addCase(updateOrderStatusThunk.pending, (state, action) => {
        state.updatingItemId = action.meta.arg.orderItemId; state.updateError = null
        // A list in flight may contain the old status. Refetch after success.
        state.requestId = null; state.loading = false
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.updatingItemId = null
        state.requestId = null; state.loading = false
        state.list.forEach(order => applyItemUpdate(order, action.payload))
        applyItemUpdate(state.detail, action.payload)
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.updatingItemId = null
        state.updateError = { ...(action.payload || { message: action.error.message }), itemId: action.meta.arg.orderItemId }
      })
  },
})

export default orderSlice.reducer
