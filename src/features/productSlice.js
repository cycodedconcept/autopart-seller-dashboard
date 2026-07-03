import { createSlice } from '@reduxjs/toolkit'
import { initialProducts } from '../utils/mockData'

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: initialProducts,
    selectedProduct: null,
  },
  reducers: {
    addProduct: (state, action) => {
      state.list.push({
        id: `prod-${Date.now()}`,
        ...action.payload,
        status: action.payload.units > 0 ? (action.payload.units <= 15 ? 'Low Stock' : 'In Stock') : 'Out of Stock'
      })
    },
    updateProduct: (state, action) => {
      const index = state.list.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = {
          ...state.list[index],
          ...action.payload,
          status: action.payload.units > 0 ? (action.payload.units <= 15 ? 'Low Stock' : 'In Stock') : 'Out of Stock'
        }
      }
    },
    deleteProduct: (state, action) => {
      state.list = state.list.filter(p => p.id !== action.payload)
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = state.list.find(p => p.id === action.payload) || null
    }
  }
})

export const { addProduct, updateProduct, deleteProduct, setSelectedProduct } = productSlice.actions
export default productSlice.reducer
