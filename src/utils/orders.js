// "confirmed" belongs to the parent order, not the seller item-status filter.
export const SELLER_ITEM_STATUSES = ['pending', 'ready_for_pickup', 'picked_up', 'delivered', 'cancelled']

export const orderActionBlockReason = (order, item) => {
  if (order.paymentStatus !== 'paid') return 'Awaiting payment before you can update this item.'
  if (['cancelled', 'delivered'].includes(order.status)) return 'This order can no longer be updated.'
  if (item.itemStatus === 'ready_for_pickup') return 'Ready for courier pickup.'
  if (item.itemStatus !== 'pending') return 'No seller actions available for this item.'
  return ''
}

export const formatOrderDate = value => {
  if (!value) return 'Not available'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

export const orderAddress = address => [address?.street, address?.city, address?.state].filter(Boolean).join(', ') || 'Not provided'

export const orderCsvCell = value => {
  const text = String(value ?? '')
  // Quote cells and prevent spreadsheet formula execution in seller exports.
  return `"${(/^[\s]*[=+\-@]/.test(text) ? `'${text}` : text).replaceAll('"', '""')}"`
}
