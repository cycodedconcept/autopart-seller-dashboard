import { createSlice } from '@reduxjs/toolkit'
import { initialTransactions } from '../utils/mockData'

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    list: initialTransactions,
    selectedTransaction: null,
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
      if (transaction) {
        transaction.status = status
      }
    },
    setSelectedTransaction: (state, action) => {
      state.selectedTransaction = state.list.find(t => t.id === action.payload) || null
    }
  }
})

export const { addTransaction, updateTransactionStatus, setSelectedTransaction } = transactionSlice.actions
export default transactionSlice.reducer
