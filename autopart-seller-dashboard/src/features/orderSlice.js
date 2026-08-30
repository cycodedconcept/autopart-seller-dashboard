import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/axios'

const API_TO_UI = {
  pending: 'Pending',
  ready_for_pickup: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const toUiStatus = (s) => API_TO_UI[s] || (s ? s[0].toUpperCase() + s.slice(1) : 'Pending')

const formatDate = (iso, withTime = false) => {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + (withTime ? `, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}` : '')
}

const addressOf = (deliveryAddress) => {
  if (!deliveryAddress) return ''
  return [deliveryAddress.address, deliveryAddress.city, deliveryAddress.state]
    .filter(Boolean)
    .join(', ')
}

/* Each API "order" contains items[]; the seller acts per order line item.
   Flatten into rows keyed by the order item id (the id used by PATCH /seller/orders/:id/status). */
const mapApiOrder = (o) => {
  const items = o.items || []
  return items.length > 0
    ? items.map(item => ({
        id: `ORD-${String(item.id).padStart(6, '0')}`,
        customerName: o.deliveryAddress?.name || 'Customer',
        email: o.deliveryAddress?.email || o.buyer?.email || '',
        avatar: 'https://picsum.photos/80/80?random=300',
        purchaseDate: formatDate(item.createdAt || o.createdAt),
        itemName: item.title,
        amount: Math.floor(item.lineTotalKobo / 100),
        paymentMethod: o.paymentMethod || 'N/A',
        status: toUiStatus(item.itemStatus || o.status),
        shippingAddress: addressOf(o.deliveryAddress),
        phone: o.deliveryAddress?.phone || '',
        carrier: '',
        trackingId: '',
        orderDate: formatDate(item.createdAt || o.createdAt),
        items: [{
          id: item.id,
          name: item.title,
          sku: item.partNumber || '—',
          qty: item.quantity,
          price: Math.floor(item.unitPriceKobo / 100),
        }],
        subtotal: Math.floor(item.lineTotalKobo / 100),
        shippingCost: 0,
        tax: 0,
        total: Math.floor(item.lineTotalKobo / 100),
        notes: '',
        timeline: [
          { status: 'Order Placed', date: formatDate(item.createdAt || o.createdAt, true), completed: true },
          { status: 'Processing', date: 'Pending', completed: false },
          { status: 'Shipped', date: 'Pending', completed: false },
          { status: 'Delivered', date: 'Pending', completed: false },
        ],
      }))
    : []
}

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/seller/orders')
    return res
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const updateOrderStatusThunk = createAsyncThunk('orders/updateOrderStatus', async ({ orderId, itemStatus }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/seller/orders/${orderId}/status`, { itemStatus })
    return res
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    selectedOrder: null,
    stats: null,
    loading: false,
    error: null,
    pagination: null,
  },
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = state.list.find(o => o.id === action.payload) || null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        const data = action.payload.data || action.payload || {}
        const orders = data.orders || (Array.isArray(data) ? data : [])
        state.list = orders.flatMap(mapApiOrder)
        state.pagination = data.pagination || null
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateOrderStatusThunk.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.loading = false
        const updated = action.payload.data
        const idx = state.list.findIndex(o => o.id === `ORD-${String(updated.id).padStart(6, '0')}`)
        if (idx !== -1) {
          const row = state.list[idx]
          row.status = toUiStatus(updated.itemStatus)
          row.items[0].id = updated.id
          const step = row.timeline.find(t => t.status === row.status)
          if (step) {
            step.completed = true
            step.date = formatDate(updated.updatedAt, true)
          } else {
            row.timeline.push({ status: row.status, date: formatDate(updated.updatedAt, true), completed: true })
          }
          if (state.selectedOrder && state.selectedOrder.id === row.id) {
            state.selectedOrder = { ...state.selectedOrder, ...row }
          }
        }
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setSelectedOrder } = orderSlice.actions
export default orderSlice.reducer