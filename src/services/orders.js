import api from '../utils/axios'

export const listOrders = async ({ itemStatus = '', page = 1, limit = 10 } = {}, { signal } = {}) => {
  const response = await api.get('/seller/orders', {
    params: { ...(itemStatus ? { itemStatus } : {}), page, limit }, signal,
  })
  return response.data
}

// No seller detail endpoint exists. Use the unfiltered paginated seller list;
// a status-filtered response omits other items. Legacy ORD- links use item IDs.
export const getSellerOrder = async (id, { signal } = {}) => {
  const legacyItemId = /^ORD-(\d+)$/.exec(String(id))?.[1]
  const numericId = Number(legacyItemId || id)
  if (!Number.isSafeInteger(numericId) || numericId <= 0) return null
  let page = 1
  let totalPages = 1
  do {
    const result = await listOrders({ page, limit: 50 }, { signal })
    const order = result.orders.find(candidate => legacyItemId
      ? candidate.items.some(item => Number(item.id) === numericId)
      : Number(candidate.id) === numericId)
    if (order) return order
    totalPages = result.pagination.totalPages
    page += 1
  } while (page <= totalPages)
  return null
}

export const updateOrderItemStatus = async (orderItemId, itemStatus) => {
  const response = await api.patch(`/seller/orders/${encodeURIComponent(orderItemId)}/status`, { itemStatus })
  return response.data
}
