import { expect, it } from 'vitest'
import { http, HttpResponse, delay } from 'msw'
import { server, endpoint } from '../mocks/server'
import { salesSummary, payout, payoutPagination } from '../mocks/sales'
import { success } from '../mocks/fixtures'
import { createTestStore } from '../render'
import { fetchSales, fetchPayouts, requestPayout, fetchPayoutDetail, refreshSalesAndPayouts } from '../../src/features/transactionSlice'

it('keeps sales and payout loading/errors independent', async () => {
  server.use(http.get(endpoint('/seller/sales'), async () => { await delay(100); return HttpResponse.json(success(salesSummary)) }),
    http.get(endpoint('/seller/payouts'), () => HttpResponse.json({ success: false, error: { message: 'Payout history unavailable.' } }, { status: 503 })))
  const store = createTestStore()
  const sales = store.dispatch(fetchSales())
  await store.dispatch(fetchPayouts())
  expect(store.getState().transactions.salesLoading).toBe(true)
  expect(store.getState().transactions.payoutsLoading).toBe(false)
  await sales
  expect(store.getState().transactions.sales).toEqual(salesSummary)
  expect(store.getState().transactions.salesError).toBeNull()
  expect(store.getState().transactions.payoutsError.message).toBe('Payout history unavailable.')
})
it('ignores an older sales period arriving after a newer one', async () => {
  server.use(http.get(endpoint('/seller/sales'), async ({ request }) => {
    const range = Object.fromEntries(new URL(request.url).searchParams)
    await delay(range.dateFrom === '2026-07-01' ? 100 : 10)
    return HttpResponse.json(success({ ...salesSummary, period: range }))
  }))
  const store = createTestStore()
  await Promise.all([
    store.dispatch(fetchSales({ dateFrom: '2026-07-01', dateTo: '2026-07-07' })),
    store.dispatch(fetchSales({ dateFrom: '2026-08-01', dateTo: '2026-08-07' })),
  ])
  expect(store.getState().transactions.sales.period.dateFrom).toBe('2026-08-01')
})
it('ignores stale payout filters/pages', async () => {
  server.use(http.get(endpoint('/seller/payouts'), async ({ request }) => {
    const params = new URL(request.url).searchParams
    const page = Number(params.get('page'))
    await delay(page === 1 ? 100 : 10)
    return HttpResponse.json(success({ payouts: [{ ...payout, id: page, status: params.get('status') }], pagination: { ...payoutPagination, page } }))
  }))
  const store = createTestStore()
  await Promise.all([store.dispatch(fetchPayouts({ status: 'requested', page: 1 })), store.dispatch(fetchPayouts({ status: 'approved', page: 2 }))])
  expect(store.getState().transactions.payouts[0]).toMatchObject({ id: 2, status: 'approved' })
  expect(store.getState().transactions.payoutPagination.page).toBe(2)
})
it('blocks duplicate payout requests in flight and stores the actual returned amount', async () => {
  let writes = 0
  server.use(http.post(endpoint('/seller/payouts'), async () => { writes += 1; await delay(100); return HttpResponse.json(success({ ...payout, amountKobo: 8500003 }), { status: 201 }) }))
  const store = createTestStore()
  await Promise.all([store.dispatch(requestPayout('BANK-TEST123')), store.dispatch(requestPayout('BANK-TEST123'))])
  expect(writes).toBe(1)
  expect(store.getState().transactions.createdPayout.amountKobo).toBe(8500003)
  expect(store.getState().transactions.requestingPayout).toBe(false)
})
it('keeps balances and history on payout creation failure', async () => {
  server.use(http.post(endpoint('/seller/payouts'), () => HttpResponse.json({ success: false, error: { code: 'CONFLICT', message: 'No completed sales are currently available for payout.' } }, { status: 409 })))
  const store = createTestStore(undefined, undefined, { sales: salesSummary, payouts: [payout] })
  await store.dispatch(requestPayout('BANK-TEST123'))
  const state = store.getState().transactions
  expect(state.sales).toEqual(salesSummary)
  expect(state.payouts).toEqual([payout])
  expect(state.createdPayout).toBeNull()
  expect(state.requestError.message).toContain('No completed sales')
})
it('refreshes the current sales dates and payout filters after a successful request', async () => {
  const queries = []
  server.use(http.get(endpoint('/seller/sales'), ({ request }) => { queries.push(new URL(request.url).search); return HttpResponse.json(success(salesSummary)) }),
    http.get(endpoint('/seller/payouts'), ({ request }) => { queries.push(new URL(request.url).search); return HttpResponse.json(success({ payouts: [], pagination: payoutPagination })) }))
  const store = createTestStore(undefined, undefined, { salesQuery: { dateFrom: '2026-07-01', dateTo: '2026-07-07' }, payoutQuery: { status: 'paid', page: 2, limit: 25 } })
  await store.dispatch(requestPayout('BANK-TEST123'))
  await store.dispatch(refreshSalesAndPayouts())
  expect(queries).toEqual(expect.arrayContaining(['?dateFrom=2026-07-01&dateTo=2026-07-07', '?status=paid&page=2&limit=25']))
  expect(store.getState().transactions.createdPayout).not.toBeNull()
})
it('opens the newly requested payout from its full result without a new request', async () => {
  const store = createTestStore()
  await store.dispatch(requestPayout('BANK-TEST123'))
  server.use(http.get(endpoint('/seller/payouts'), () => { throw new Error('Cached payout should not require a network request') }))
  await store.dispatch(fetchPayoutDetail(78))
  expect(store.getState().transactions.payoutDetail.bankAccountRef).toBe('BANK-TEST123')
})
