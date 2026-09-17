export const PAYOUT_STATUS_LABELS = { requested: 'Requested', approved: 'Approved', paid: 'Paid', rejected: 'Rejected' }

const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value)
  && !Number.isNaN(new Date(value + 'T00:00:00Z').getTime())
  && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value

export const validateSalesRange = ({ dateFrom = '', dateTo = '' } = {}) => {
  if (!dateFrom && !dateTo) return {}
  const errors = {}
  if (!validDate(dateFrom)) errors.dateFrom = 'Enter a valid start date.'
  if (!validDate(dateTo)) errors.dateTo = 'Enter a valid end date.'
  if (!Object.keys(errors).length && dateFrom > dateTo) errors.dateTo = 'End date must be on or after start date.'
  return errors
}

export const validateBankAccountRef = value => {
  const length = String(value ?? '').trim().length
  return length < 3 || length > 255 ? 'Enter a bank account reference between 3 and 255 characters.' : ''
}

// Date-only reporting boundaries must not shift when viewed outside UTC.
export const formatSalesDay = value => {
  if (!validDate(value || '')) return 'Not available'
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(0)
  date.setFullYear(year, month - 1, day)
  date.setHours(12, 0, 0, 0)
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export const formatPayoutDate = value => {
  if (!value) return 'Not available'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}
