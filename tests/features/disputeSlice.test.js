import { expect, it } from 'vitest'
import { delay, http, HttpResponse } from 'msw'
import { createTestStore } from '../render'
import { endpoint, server } from '../mocks/server'
import { success } from '../mocks/fixtures'
import { dispute, disputeDetail, disputePagination, respondedDisputeDetail } from '../mocks/disputes'
import { fetchDispute, fetchDisputes, respondToDispute } from '../../src/features/disputeSlice'

it('keeps the latest dispute page when responses arrive out of order', async () => {
  server.use(http.get(endpoint('/seller/disputes'), async ({ request }) => {
    const page = Number(new URL(request.url).searchParams.get('page'))
    await delay(page === 1 ? 100 : 10)
    return HttpResponse.json(success({ disputes: [{ ...dispute, id: page }], pagination: { ...disputePagination, page }, filters: {} }))
  }))
  const store = createTestStore()
  await Promise.all([store.dispatch(fetchDisputes({ page: 1 })), store.dispatch(fetchDisputes({ page: 2 }))])
  expect(store.getState().disputes.list[0].id).toBe(2)
})

it('loads detail and replaces it with the server response after responding', async () => {
  const store = createTestStore(undefined, undefined, undefined, { list: [dispute] })
  await store.dispatch(fetchDispute(1))
  expect(store.getState().disputes.detail).toEqual(disputeDetail)
  await store.dispatch(respondToDispute({ id: 1, message: 'The brake light was checked before dispatch.', files: [] }))
  const state = store.getState().disputes
  expect(state.detail).toEqual(respondedDisputeDetail)
  expect(state.list[0].updatedAt).toBe(respondedDisputeDetail.dispute.updatedAt)
  expect(state.responseSuccess).toBe(true)
})

it('preserves API field errors from a rejected response', async () => {
  server.use(http.post(endpoint('/seller/disputes/1/respond'), () => HttpResponse.json({ success: false, error: {
    code: 'VALIDATION_ERROR', message: 'Check your response.', errors: { message: ['Response needs more detail.'] },
  } }, { status: 422 })))
  const store = createTestStore()
  await store.dispatch(respondToDispute({ id: 1, message: 'A long enough response message.', files: [] }))
  expect(store.getState().disputes.responseError).toMatchObject({ message: 'Check your response.', fieldErrors: { message: 'Response needs more detail.' } })
})
