import axios from 'axios'
import { API_URL } from '../config/constant'
import { apiError } from './apiError'

export const AUTH_UNAUTHORIZED_EVENT = 'autoparts:auth-unauthorized'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  // The browser supplies the multipart boundary for uploaded files.
  if (config.data instanceof FormData) config.headers.delete('Content-Type')
  return config
})

api.interceptors.response.use(
  (response) => {
    if (response.data?.success === false) throw apiError(response.data, response.status)
    return response.data
  },
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''
    const isAuthRequest = url.includes('/auth/') || url.includes('/seller/register')
    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('sellerProfile')
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
    }
    return Promise.reject(apiError(error.response?.data, status, error.message))
  }
)

export default api
