import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as service from '../services/products'
import { serializeApiError } from '../utils/apiError'

const request = (name, handler) => createAsyncThunk(`products/${name}`, async (arg, context) => {
  try { return await handler(arg, context) } catch (error) { return context.rejectWithValue(serializeApiError(error)) }
})
export const fetchProducts = request('fetchProducts', service.listProducts)
export const fetchProduct = request('fetchProduct', async (id, { getState }) => {
  const product = await service.getProduct(id)
  const sellerId = getState().auth?.sellerProfile?.id
  if (sellerId != null && String(product.seller.id) !== String(sellerId)) throw new Error('This product does not belong to your shop.')
  return product
})
export const createProduct = request('createProduct', service.createProduct)
export const updateProductThunk = request('updateProduct', ({ id, formData }) => service.updateProduct(id, formData))
export const deleteProductThunk = request('deleteProduct', async (id) => { await service.deleteProduct(id); return id })
export const fetchInventory = request('fetchInventory', service.getInventory)
export const bulkUploadProducts = request('bulkUpload', ({ file, onUploadProgress }) => service.bulkUpload(file, onUploadProgress))

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [], pagination: null, loading: false, error: null, listRequestId: null,
    detail: null, detailLoading: false, detailError: null, detailRequestId: null,
    inventory: [], inventorySummary: null, inventoryPagination: null,
    inventoryLoading: false, inventoryError: null, inventoryRequestId: null,
    saving: false, saveError: null, deletingId: null, deleteError: null,
    bulkLoading: false, bulkError: null, bulkResult: null,
  },
  reducers: {
    clearSaveError: (state) => { state.saveError = null },
    clearBulkResult: (state) => { state.bulkResult = null; state.bulkError = null },
  },
  extraReducers: (builder) => {
    const fetchState = (thunk, loading, error, requestId, assign) => {
      builder.addCase(thunk.pending, (state, action) => {
        state[loading] = true; state[error] = null; state[requestId] = action.meta.requestId
      }).addCase(thunk.fulfilled, (state, action) => {
        if (state[requestId] !== action.meta.requestId) return
        state[loading] = false; assign(state, action.payload)
      }).addCase(thunk.rejected, (state, action) => {
        if (state[requestId] !== action.meta.requestId) return
        state[loading] = false; state[error] = action.payload || { message: action.error.message }
      })
    }
    fetchState(fetchProducts, 'loading', 'error', 'listRequestId', (state, data) => {
      state.list = data.products; state.pagination = data.pagination
    })
    fetchState(fetchProduct, 'detailLoading', 'detailError', 'detailRequestId', (state, data) => { state.detail = data })
    fetchState(fetchInventory, 'inventoryLoading', 'inventoryError', 'inventoryRequestId', (state, data) => {
      state.inventory = data.inventory; state.inventorySummary = data.summary; state.inventoryPagination = data.pagination
    })
    for (const thunk of [createProduct, updateProductThunk]) {
      builder.addCase(thunk.pending, state => { state.saving = true; state.saveError = null })
        .addCase(thunk.fulfilled, (state, action) => {
          state.saving = false; state.detail = action.payload
          const index = state.list.findIndex(item => String(item.id) === String(action.payload.id))
          if (index >= 0) state.list[index] = action.payload
        })
        .addCase(thunk.rejected, (state, action) => { state.saving = false; state.saveError = action.payload })
    }
    builder.addCase(deleteProductThunk.pending, (state, action) => {
      state.deletingId = action.meta.arg; state.deleteError = null
    }).addCase(deleteProductThunk.fulfilled, (state, action) => {
      state.deletingId = null
      state.list = state.list.filter(item => String(item.id) !== String(action.payload))
      if (String(state.detail?.id) === String(action.payload)) state.detail = null
    }).addCase(deleteProductThunk.rejected, (state, action) => {
      state.deletingId = null; state.deleteError = action.payload
    }).addCase(bulkUploadProducts.pending, state => {
      state.bulkLoading = true; state.bulkError = null; state.bulkResult = null
    }).addCase(bulkUploadProducts.fulfilled, (state, action) => {
      state.bulkLoading = false; state.bulkResult = action.payload
    }).addCase(bulkUploadProducts.rejected, (state, action) => {
      state.bulkLoading = false; state.bulkError = action.payload
    })
  },
})
export const { clearSaveError, clearBulkResult } = productSlice.actions
export default productSlice.reducer
