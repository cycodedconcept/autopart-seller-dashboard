import { expect, it } from 'vitest'
import { canSellerRespond, disputeReasonLabel, formatSla, validateDisputeFiles } from '../../src/utils/disputes'

it('labels reasons and formats an SLA without recomputing the server deadline', () => {
  expect(disputeReasonLabel('wrong_item_sent')).toBe('Wrong item sent')
  expect(formatSla({ remainingMinutes: 1505, breached: false })).toBe('1d 1h remaining')
  expect(formatSla({ remainingMinutes: -4, breached: true })).toBe('Response deadline passed')
})

it('matches the backend seller response rules', () => {
  expect(canSellerRespond({ dispute: { status: 'open' }, timeline: [] })).toBe(true)
  expect(canSellerRespond({ dispute: { status: 'in_review' }, timeline: [{ event: 'info_requested', detail: { requestedFrom: 'seller' } }] })).toBe(true)
  expect(canSellerRespond({ dispute: { status: 'in_review' }, timeline: [{ event: 'info_requested', detail: { requestedFrom: 'buyer' } }] })).toBe(false)
  expect(canSellerRespond({ dispute: { status: 'resolved' }, timeline: [] })).toBe(false)
})

it('validates dispute image count, type and size', () => {
  expect(validateDisputeFiles([new File(['x'], 'photo.png', { type: 'image/png' })])).toBe('')
  expect(validateDisputeFiles([new File(['x'], 'file.pdf', { type: 'application/pdf' })])).toContain('JPEG, PNG or WebP')
  expect(validateDisputeFiles([new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' })])).toContain('5 MB or smaller')
})
