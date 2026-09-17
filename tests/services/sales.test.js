import { expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server, endpoint } from '../mocks/server'
import { success } from '../mocks/fixtures'
import { salesSummary, payout, payoutPagination } from '../mocks/sales'
import { getSalesSummary, listPayouts, createPayoutRequest, getPayout } from '../../src/services/sales'

it('fetches the default summary with bearer auth, no dates or body, and unwraps data', async () => {
  server.use(http.get(endpoint('/seller/sales'), ({ request }) => {
    expect(request.headers.get('Authorization')).toBe('Bearer test-seller-token')
    expect(new URL(request.url).search).toBe('')
    expect(request.body).toBeNull()
    return HttpResponse.json(success(salesSummary))
  }))
  expect(await getSalesSummary()).toEqual(salesSummary)
})
it('sends paired date-only boundaries without changing timezone or truncating kobo', async () => {
  const range = { dateFrom: '2026-07-01', dateTo: '2026-07-07' }
  server.use(http.get(endpoint('/seller/sales'), ({ request }) => {
    expect(Object.fromEntries(new URL(request.url).searchParams)).toEqual(range)
    return HttpResponse.json(success({ ...salesSummary, period: range }))
  }))
  expect((await getSalesSummary(range)).sales.netSalesKobo).toBe(11000003)
})
it.each([
  { dateFrom: '2026-07-01' }, { dateTo: '2026-07-01' },
  { dateFrom: '2026-07-07', dateTo: '2026-07-01' },
  { dateFrom: '2026-02-30', dateTo: '2026-03-01' },
])('rejects invalid date boundaries before sending a request: %j', async range => {
  server.use(http.get(endpoint('/seller/sales'), () => { throw new Error('Invalid range sent to network') }))
  await expect(getSalesSummary(range)).rejects.toHaveProperty('fieldErrors')
})
it('gets payout history with status and pagination and no copied Postman GET body', async () => {
  server.use(http.get(endpoint('/seller/payouts'), ({ request }) => {
    expect(request.headers.get('Authorization')).toBe('Bearer test-seller-token')
    expect(Object.fromEntries(new URL(request.url).searchParams)).toEqual({ status: 'approved', page: '2', limit: '25' })
    expect(request.body).toBeNull()
    return HttpResponse.json(success({ payouts: [payout], pagination: payoutPagination }))
  }))
  expect(await listPayouts({ status: 'approved', page: 2, limit: 25 })).toEqual({ payouts: [payout], pagination: payoutPagination })
})
it('omits an empty status filter for all payouts', async () => {
  server.use(http.get(endpoint('/seller/payouts'), ({ request }) => {
    expect(Object.fromEntries(new URL(request.url).searchParams)).toEqual({ page: '1', limit: '10' })
    return HttpResponse.json(success({ payouts: [], pagination: payoutPagination }))
  }))
  await listPayouts()
})
it('posts only the trimmed bank account reference with seller auth and JSON', async () => {
  server.use(http.post(endpoint('/seller/payouts'), async ({ request }) => {
    expect(request.headers.get('Authorization')).toBe('Bearer test-seller-token')
    expect(request.headers.get('Content-Type')).toContain('application/json')
    expect(await request.json()).toEqual({ bankAccountRef: 'BANK-TEST123' })
    return HttpResponse.json(success(payout), { status: 201 })
  }))
  expect(await createPayoutRequest('  BANK-TEST123  ')).toEqual(payout)
})
it.each([200, 409, 422])('preserves error messages and fields from HTTP %s', async status => {
  server.use(http.post(endpoint('/seller/payouts'), () => HttpResponse.json({ success: false, error: {
    code: 'VALIDATION_ERROR', message: 'Payout could not be requested.', errors: { bankAccountRef: ['Invalid bank account reference.'] },
  } }, { status })))
  await expect(createPayoutRequest('BANK-TEST123')).rejects.toMatchObject({
    message: 'Payout could not be requested.', fieldErrors: { bankAccountRef: 'Invalid bank account reference.' },
  })
})
it('looks up direct payout links across unfiltered history pages', async () => {
  const pages = []
  server.use(http.get(endpoint('/seller/payouts'), ({ request }) => {
    const params = new URL(request.url).searchParams
    expect(params.has('status')).toBe(false)
    expect(params.get('limit')).toBe('50')
    const page = Number(params.get('page')); pages.push(page)
    return HttpResponse.json(success({ payouts: page === 2 ? [payout] : [], pagination: { page, limit: 50, total: 51, totalPages: 2 } }))
  }))
  expect(await getPayout(77)).toEqual(payout)
  expect(pages).toEqual([1, 2])
})
it('supports legacy payout IDs and returns null for absent or invalid IDs', async () => {
  expect(await getPayout('PO-0077')).toEqual(payout)
  expect(await getPayout(999)).toBeNull()
  expect(await getPayout('bad-id')).toBeNull()
})
