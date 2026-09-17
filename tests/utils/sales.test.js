import { expect, it } from 'vitest'
import { validateSalesRange, validateBankAccountRef, formatSalesDay, formatPayoutDate } from '../../src/utils/sales'

it.each([
  {}, { dateFrom: '', dateTo: '' },
  { dateFrom: '2026-07-01', dateTo: '2026-07-01' },
  { dateFrom: '2024-02-29', dateTo: '2024-03-01' },
])('allows default, same-day and valid leap-year sales ranges: %j', range => expect(validateSalesRange(range)).toEqual({}))
it('requires both dates and rejects reversed or nonexistent calendar days', () => {
  expect(validateSalesRange({ dateFrom: '2026-07-01' })).toHaveProperty('dateTo')
  expect(validateSalesRange({ dateTo: '2026-07-01' })).toHaveProperty('dateFrom')
  expect(validateSalesRange({ dateFrom: '2026-07-07', dateTo: '2026-07-01' })).toHaveProperty('dateTo')
  expect(validateSalesRange({ dateFrom: '2026-02-29', dateTo: '2026-03-01' })).toHaveProperty('dateFrom')
})
it.each(['', '  ', 'AB', 'x'.repeat(256)])('rejects invalid bank reference length', value => expect(validateBankAccountRef(value)).not.toBe(''))
it('accepts the exact trimmed bank reference boundaries', () => {
  expect(validateBankAccountRef(' ABC ')).toBe('')
  expect(validateBankAccountRef('x'.repeat(255))).toBe('')
})
it('formats date-only periods without a day shift and handles null payout dates', () => {
  expect(formatSalesDay('2026-07-01')).toBe(new Date(2026, 6, 1).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }))
  expect(formatSalesDay('2026-02-30')).toBe('Not available')
  expect(formatPayoutDate(null)).toBe('Not available')
  expect(formatPayoutDate('invalid')).toBe('Not available')
  expect(formatPayoutDate('2026-07-01T10:00:00Z')).toBe(new Date('2026-07-01T10:00:00Z').toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }))
})
