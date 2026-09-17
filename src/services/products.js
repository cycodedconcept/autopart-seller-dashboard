import api from '../utils/axios'
import { nairaToKobo } from '../config/constant'
import { productImageUrl } from '../utils/productImages'
import { validatePhoto, validateCsv } from '../utils/productValidation'

const unwrap = (response) => response.data

export const listProducts = async ({ page = 1, limit = 10 } = {}) =>
  unwrap(await api.get('/seller/products', { params: { status: 'active', page, limit } }))

// The documented public detail endpoint returns the full shape for active products.
// Seller mutations continue to enforce ownership on the server.
export const getProduct = async (id) => unwrap(await api.get(`/products/${encodeURIComponent(id)}`))
export const createProduct = async (formData) => unwrap(await api.post('/seller/products', formData))
export const updateProduct = async (id, formData) => unwrap(await api.patch(`/seller/products/${encodeURIComponent(id)}`, formData))
export const deleteProduct = async (id) => unwrap(await api.delete(`/seller/products/${encodeURIComponent(id)}`))
export const getInventory = async ({ status = 'all', lowStockOnly = false, page = 1, limit = 10 } = {}) =>
  unwrap(await api.get('/seller/inventory', { params: { status, lowStockOnly, page, limit } }))
export const bulkUpload = async (file, onUploadProgress) => {
  const error = validateCsv(file)
  if (error) throw new Error(error)
  const formData = new FormData()
  formData.append('file', file)
  return unwrap(await api.post('/seller/inventory/bulk', formData, { onUploadProgress }))
}

export const buildProductFormData = async (values, { files = [], retainedPhotos = [], replacePhotos = false } = {}) => {
  if (replacePhotos && (files.length + retainedPhotos.length < 1 || files.length + retainedPhotos.length > 6)) {
    throw new Error('Keep between one and six photos.')
  }
  for (const file of files) {
    const error = validatePhoto(file)
    if (error) throw new Error(error)
  }
  const formData = new FormData()
  for (const key of ['title', 'description', 'categoryId', 'partNumber', 'condition', 'stockQty', 'location']) {
    formData.append(key, String(values[key]).trim())
  }
  formData.append('priceKobo', String(nairaToKobo(values.price)))
  formData.append('compatibility', JSON.stringify(values.compatibility.map(row => ({
    make: row.make.trim(), model: row.model.trim(), yearFrom: Number(row.yearFrom), yearTo: Number(row.yearTo),
  }))))
  if (replacePhotos) {
    // PATCH replaces every image. Re-upload retained assets before new files.
    // Asset fetches must never receive the seller token, including external URLs.
    const retainedFiles = await Promise.all(retainedPhotos.map(async (photo, index) => {
      try {
        const response = await fetch(productImageUrl(photo.url), { credentials: 'omit', signal: AbortSignal.timeout(15000) })
        if (!response.ok) throw new Error('Image request failed')
        const blob = await response.blob()
        const file = new File([blob], `retained-${index}.${blob.type.split('/')[1] || 'jpg'}`, { type: blob.type })
        if (validatePhoto(file)) throw new Error('Image is not a supported upload')
        return file
      } catch {
        throw new Error('An existing photo could not be retained. Remove it and upload the original image again before saving.')
      }
    }))
    for (const file of [...retainedFiles, ...files]) formData.append('photos', file)
  }
  return formData
}
