import { expect, it } from 'vitest'
import { http, HttpResponse, delay } from 'msw'
import { createTestStore } from '../render'
import { server, endpoint } from '../mocks/server'
import { success } from '../mocks/fixtures'
import { sellerOrder, orderPagination, orderUpdate } from '../mocks/orders'
import { fetchOrders, fetchOrder, updateOrderStatusThunk } from '../../src/features/orderSlice'

it('ignores an older order page arriving after the latest request', async () => {
  server.use(http.get(endpoint('/seller/orders'), async ({ request }) => {
    const page = Number(new URL(request.url).searchParams.get('page'))
    await delay(page === 1 ? 100 : 10)
    return HttpResponse.json(success({ orders: [{ ...sellerOrder, id: page }], pagination: { ...orderPagination, page } }))
  }))
  const store = createTestStore()
  await Promise.all([store.dispatch(fetchOrders({ page: 1 })), store.dispatch(fetchOrders({ page: 2 }))])
  expect(store.getState().orders.list[0].id).toBe(2)
  expect(store.getState().orders.pagination.page).toBe(2)
})
it('keeps complete unfiltered details when entering from a filtered list', async () => {
  const store = createTestStore()
  await store.dispatch(fetchOrders({ itemStatus: 'pending' }))
  expect(store.getState().orders.list[0].items).toHaveLength(1)
  await store.dispatch(fetchOrder(42))
  expect(store.getState().orders.detail.items).toHaveLength(2)
})
it('updates only the target item in the list and detail and preserves payment status', async () => {
  const store = createTestStore()
  await store.dispatch(fetchOrders())
  await store.dispatch(fetchOrder(42))
  await store.dispatch(updateOrderStatusThunk({ orderItemId: 7, itemStatus: 'cancelled' }))
  const state = store.getState().orders
  expect(state.list[0].items[0].itemStatus).toBe('cancelled')
  expect(state.detail.items[0].itemStatus).toBe('cancelled')
  expect(state.detail.items[1].itemStatus).toBe('ready_for_pickup')
  expect(state.detail.paymentStatus).toBe('paid')
  expect(state.detail.deliveryAddress).toEqual(sellerOrder.deliveryAddress)
  expect(state.detail.items[0].updatedAt).toBe(orderUpdate().updatedAt)
})
it('keeps the original status on failure and exposes the API message', async () => {
  server.use(http.patch(endpoint('/seller/orders/7/status'), () => HttpResponse.json({ success: false, error: { code: 'CONFLICT', message: 'This item was already picked up.' } }, { status: 409 })))
  const store = createTestStore()
  await store.dispatch(fetchOrders())
  await store.dispatch(fetchOrder(42))
  await store.dispatch(updateOrderStatusThunk({ orderItemId: 7, itemStatus: 'ready_for_pickup' }))
  expect(store.getState().orders.detail.items[0].itemStatus).toBe('pending')
  expect(store.getState().orders.updatingItemId).toBeNull()
  expect(store.getState().orders.updateError).toMatchObject({ itemId: 7, message: 'This item was already picked up.' })
})
it('blocks duplicate mutations while an update is in flight', async () => {
  let updates = 0
  server.use(http.patch(endpoint('/seller/orders/7/status'), async () => { updates += 1; await delay(100); return HttpResponse.json(success(orderUpdate())) }))
  const store = createTestStore()
  await Promise.all([
    store.dispatch(updateOrderStatusThunk({ orderItemId: 7, itemStatus: 'ready_for_pickup' })),
    store.dispatch(updateOrderStatusThunk({ orderItemId: 7, itemStatus: 'ready_for_pickup' })),
  ])
  expect(updates).toBe(1)
})
it('does not let an older list response revert a successful status change', async () => {
  const store = createTestStore(undefined, { list: [sellerOrder], detail: sellerOrder })
  server.use(http.get(endpoint('/seller/orders'), async () => { await delay(100); return HttpResponse.json(success({ orders: [sellerOrder], pagination: orderPagination })) }))
  const listing = store.dispatch(fetchOrders())
  await store.dispatch(updateOrderStatusThunk({ orderItemId: 7, itemStatus: 'ready_for_pickup' }))
  await listing
  expect(store.getState().orders.list[0].items[0].itemStatus).toBe('ready_for_pickup')
})
