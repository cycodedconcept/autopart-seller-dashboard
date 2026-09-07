import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/axios'

const mapApiProduct = (p) => {
  const yearRange = p.compatibility?.length
    ? `${p.compatibility[0].yearFrom}-${p.compatibility[0].yearTo}`
    : ''
  return {
    id: p.id,
    name: p.title,
    price: Math.floor(p.priceKobo / 100),
    category: p.category?.name || '',
    location: p.location || '',
    units: p.stockQty || 0,
    compatibility: p.compatibility?.length
      ? p.compatibility.map(c => `${c.make} ${c.model} ${c.yearFrom}-${c.yearTo}`).join(', ')
      : 'Universal',
    sku: p.partNumber || '',
    condition: p.condition || 'New',
    brand: p.seller?.businessName || '',
    status: p.stockQty > 0 ? (p.stockQty <= 15 ? 'Low Stock' : 'In Stock') : 'Out of Stock',
    sold: p.soldCount || p.salesCount || 0,
    reviews: p.seller?.rating || 0,
    year: yearRange,
    image: p.primaryImageUrl || 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=400',
    images: p.photos?.map(ph => ph.url) || [p.primaryImageUrl].filter(Boolean),
    description: p.description || '',
    vehicles: p.compatibility?.map(c => `${c.make} ${c.model} ${c.yearFrom}-${c.yearTo}`) || [],
    warranty: p.warranty || '',
  }
}

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/seller/products')
    return res
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const createProduct = createAsyncThunk('products/createProduct', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/seller/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const updateProductThunk = createAsyncThunk('products/updateProduct', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/seller/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const deleteProductThunk = createAsyncThunk('products/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/seller/products/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const fetchInventory = createAsyncThunk('products/fetchInventory', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/seller/inventory', { params })
    return res
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const bulkUploadProducts = createAsyncThunk('products/bulkUpload', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/seller/inventory/bulk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    selectedProduct: null,
    loading: false,
    error: null,
    pagination: null,
    inventory: [],
    inventorySummary: null,
  },
  reducers: {
    addProduct: (state, action) => {
      state.list.push({
        id: `prod-${Date.now()}`,
        ...action.payload,
        status: action.payload.units > 0 ? (action.payload.units <= 15 ? 'Low Stock' : 'In Stock') : 'Out of Stock',
      })
    },
    updateProduct: (state, action) => {
      const index = state.list.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = {
          ...state.list[index],
          ...action.payload,
          status: action.payload.units > 0 ? (action.payload.units <= 15 ? 'Low Stock' : 'In Stock') : 'Out of Stock',
        }
      }
    },
    deleteProduct: (state, action) => {
      state.list = state.list.filter(p => p.id !== action.payload)
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = state.list.find(p => p.id === action.payload) || null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        const products = action.payload.data.products || []
        state.list = products.map(mapApiProduct)
        state.pagination = action.payload.data.pagination || null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createProduct.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        const p = action.payload.data
        state.list.unshift(mapApiProduct(p))
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateProductThunk.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.loading = false
        const p = action.payload.data
        const idx = state.list.findIndex(item => item.id === p.id)
        if (idx !== -1) state.list[idx] = mapApiProduct(p)
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteProductThunk.pending, (state) => { state.loading = true; state.error = null })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.loading = false
        state.list = state.list.filter(item => item.id !== action.payload)
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchInventory.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false
        const d = action.payload.data || {}
        state.inventory = d.inventory || []
        state.inventorySummary = d.summary || null
        state.pagination = d.pagination || null
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { addProduct, updateProduct, deleteProduct, setSelectedProduct } = productSlice.actions
export default productSlice.reducer
