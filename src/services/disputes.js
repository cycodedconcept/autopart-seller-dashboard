import api from '../utils/axios'
import { API_ORIGIN } from '../config/constant'

export const listSellerDisputes = async ({ status = 'all', dateFrom = '', dateTo = '', page = 1, limit = 10 } = {}, { signal } = {}) => {
  const response = await api.get('/seller/disputes', {
    params: { status, ...(dateFrom ? { dateFrom } : {}), ...(dateTo ? { dateTo } : {}), page, limit }, signal,
  })
  return response.data
}

export const getSellerDispute = async (id, { signal } = {}) => {
  const response = await api.get(`/seller/disputes/${encodeURIComponent(id)}`, { signal })
  return response.data
}

export const respondToSellerDispute = async (id, { message, files = [] }) => {
  const body = new FormData()
  body.append('message', message.trim())
  files.forEach(file => body.append('evidence', file))
  const response = await api.post(`/seller/disputes/${encodeURIComponent(id)}/respond`, body)
  return response.data
}

export const evidenceRequestUrl = value => {
  if (!value) return ''
  try {
    const parsed = new URL(value, API_ORIGIN)
    if (parsed.origin === API_ORIGIN && parsed.pathname.startsWith('/api/v1/')) {
      return `${parsed.pathname.slice('/api/v1'.length)}${parsed.search}`
    }
    return parsed.href
  } catch {
    return value
  }
}

export const getDisputeEvidence = (url, { signal } = {}) => api.get(evidenceRequestUrl(url), {
  responseType: 'blob', signal,
})
