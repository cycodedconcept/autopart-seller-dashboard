import api from '../utils/axios'
import { validateBankAccountRef, validateSalesRange } from '../utils/sales'

export const getSalesSummary = async (range = {}, { signal } = {}) => {
  const fieldErrors = validateSalesRange(range)
  if (Object.keys(fieldErrors).length) throw Object.assign(new Error(Object.values(fieldErrors)[0]), { fieldErrors })
  const params = range.dateFrom ? { dateFrom: range.dateFrom, dateTo: range.dateTo } : {}
  return (await api.get('/seller/sales', { params, signal })).data
}

export const listPayouts = async ({ status = '', page = 1, limit = 10 } = {}, { signal } = {}) =>
  (await api.get('/seller/payouts', { params: { ...(status ? { status } : {}), page, limit }, signal })).data

export const createPayoutRequest = async bankAccountRef => {
  const message = validateBankAccountRef(bankAccountRef)
  if (message) throw Object.assign(new Error(message), { fieldErrors: { bankAccountRef: message } })
  return (await api.post('/seller/payouts', { bankAccountRef: bankAccountRef.trim() })).data
}

// The seller API has no payout-by-ID route. Its history rows already contain
// the full seller payout shape. Search unfiltered pages for direct detail links.
export const getPayout = async (id, { signal } = {}) => {
  const numericId = Number(String(id).replace(/^PO-/, ''))
  if (!Number.isSafeInteger(numericId) || numericId <= 0) return null
  let page = 1
  let totalPages = 1
  do {
    const result = await listPayouts({ page, limit: 50 }, { signal })
    const payout = result.payouts.find(item => Number(item.id) === numericId)
    if (payout) return payout
    totalPages = result.pagination.totalPages
    page += 1
  } while (page <= totalPages)
  return null
}
