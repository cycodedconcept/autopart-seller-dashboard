export const DISPUTE_STATUSES = ['open', 'in_review', 'escalated', 'resolved', 'rejected', 'closed']

export const DISPUTE_STATUS_LABELS = {
  open: 'Open',
  in_review: 'In review',
  escalated: 'Escalated',
  resolved: 'Resolved',
  rejected: 'Rejected',
  closed: 'Closed',
}

export const DISPUTE_REASON_LABELS = {
  item_not_as_described: 'Item not as described',
  item_not_received: 'Item not received',
  damaged_on_arrival: 'Damaged on arrival',
  wrong_item_sent: 'Wrong item sent',
  counterfeit_suspected: 'Counterfeit suspected',
  other: 'Other',
}

export const DISPUTE_EVENT_LABELS = {
  opened: 'Dispute opened',
  info_requested: 'Information requested',
  buyer_responded: 'Buyer responded',
  seller_responded: 'You responded',
  escalated: 'Dispute escalated',
  ruled: 'Ruling issued',
  resolved: 'Dispute resolved',
  closed: 'Dispute closed',
}

export const DISPUTE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const DISPUTE_MAX_FILES = 5
export const DISPUTE_MAX_FILE_BYTES = 5 * 1024 * 1024

export const formatDisputeDate = value => {
  if (!value) return 'Not available'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

export const disputeReasonLabel = reason => DISPUTE_REASON_LABELS[reason]
  || reason?.replaceAll('_', ' ')
  || 'Reason not provided'

export const canSellerRespond = detail => {
  const status = detail?.dispute?.status
  if (!['open', 'in_review'].includes(status)) return false
  const request = detail.timeline?.filter(item => item.event === 'info_requested').at(-1)
  return !request || ['seller', 'both'].includes(request.detail?.requestedFrom)
}

export const sellerResponseBlockReason = detail => {
  if (canSellerRespond(detail)) return ''
  if (!['open', 'in_review'].includes(detail?.dispute?.status)) return 'This dispute no longer accepts seller responses.'
  return 'The current information request is addressed to the buyer.'
}

export const formatSla = sla => {
  if (!sla) return 'Not available'
  if (sla.breached) return 'Response deadline passed'
  const minutes = Math.max(0, Number(sla.remainingMinutes) || 0)
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const remainder = minutes % 60
  if (days) return `${days}d ${hours}h remaining`
  if (hours) return `${hours}h ${remainder}m remaining`
  return `${remainder}m remaining`
}

export const validateDisputeFiles = files => {
  if (files.length > DISPUTE_MAX_FILES) return `Choose no more than ${DISPUTE_MAX_FILES} images.`
  const wrongType = files.find(file => !DISPUTE_IMAGE_TYPES.includes(file.type))
  if (wrongType) return `${wrongType.name} must be a JPEG, PNG or WebP image.`
  const tooLarge = files.find(file => file.size > DISPUTE_MAX_FILE_BYTES)
  if (tooLarge) return `${tooLarge.name} must be 5 MB or smaller.`
  return ''
}
