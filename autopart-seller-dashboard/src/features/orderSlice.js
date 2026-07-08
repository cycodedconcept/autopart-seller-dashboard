import { createSlice } from '@reduxjs/toolkit'
import { initialOrders } from '../utils/mockData'

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: initialOrders,
    selectedOrder: null,
  },
  reducers: {
    addOrder: (state, action) => {
      state.list.unshift({
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        purchaseDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        ...action.payload,
      })
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload
      const order = state.list.find(o => o.id === orderId)
      if (order) {
        order.status = status
        const timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, month: 'short', day: 'numeric', year: 'numeric' })
        const timelineItem = order.timeline.find(t => t.status.toLowerCase() === status.toLowerCase())
        if (timelineItem) {
          timelineItem.date = timestamp
          timelineItem.completed = true
        } else {
          order.timeline.push({ status, date: timestamp, completed: true })
        }
      }
      if (state.selectedOrder && state.selectedOrder.id === orderId) {
        state.selectedOrder.status = status
      }
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = state.list.find(o => o.id === action.payload) || null
    }
  }
})

export const { addOrder, updateOrderStatus, setSelectedOrder } = orderSlice.actions
export default orderSlice.reducer
