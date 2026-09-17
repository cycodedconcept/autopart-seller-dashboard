import { API_ORIGIN } from '../config/constant'

export const PRODUCT_PLACEHOLDER = '/product-placeholder.svg'

export const productImageUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) return PRODUCT_PLACEHOLDER
  if (value === PRODUCT_PLACEHOLDER) return value
  if (/^https?:\/\//i.test(value)) return value
  return `${API_ORIGIN}/${value.replace(/^\/+/, '')}`
}
