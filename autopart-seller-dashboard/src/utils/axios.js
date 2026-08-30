import axios from 'axios'
import { API_URL } from '../config/constant'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const extractError = (data) => {
  // Handle validation errors with field details
  if (data?.errors && typeof data.errors === 'object') {
    const msgs = Object.entries(data.errors).map(([field, msgs]) => {
      const fieldMsgs = Array.isArray(msgs) ? msgs : [msgs]
      return `${field}: ${fieldMsgs.join(', ')}`
    })
    if (msgs.length) return msgs.join(' | ')
  }
  
  if (data?.error?.errors && typeof data.error.errors === 'object') {
    const msgs = Object.entries(data.error.errors).map(([field, msgs]) => {
      const fieldMsgs = Array.isArray(msgs) ? msgs : [msgs]
      return `${field}: ${fieldMsgs.join(', ')}`
    })
    if (msgs.length) return msgs.join(' | ')
  }
  
  if (data?.success === false && typeof data?.error?.message === 'string') return data.error.message
  if (data?.error && typeof data.error === 'string') return data.error
  if (typeof data?.message === 'string') return data.message
  if (data?.error && typeof data.error === 'object') {
    if (typeof data.error.message === 'string') return data.error.message
    try { return JSON.stringify(data.error) } catch (_e) { /* noop */ }
  }
  return null
}

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''
    // Don't hijack auth failures: let Login/SignUp surface the real error.
    const isAuthRequest = url.includes('/auth/') || url.includes('/seller/register')
    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('sellerProfile')
      window.location.href = '/login'
    }
    const message = extractError(error.response?.data) || error.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default api
