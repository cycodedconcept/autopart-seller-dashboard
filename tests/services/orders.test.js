import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server, endpoint } from '../mocks/server'
import { success } from '../mocks/fixtures'
import { sellerOrder, orderPagination, orderUpdate } from '../mocks/orders'
import { listOrders, getSellerOrder, updateOrderItemStatus } from '../../src/services/orders'

describe('seller order services', () => {
  it('lists orders with existing bearer auth, default pagination and no empty status filter', async () => {
    server.use(http.get(endpoint('/seller/orders'), ({ request }) => {
      expect(request.headers.get('Authorization')).toBe('Bearer test-seller-token')
      expect(Object.fromEntries(new URL(request.url).searchParams)).toEqual({ page: '1', limit: '10' })
      return HttpResponse.json(success({ orders: [sellerOrder], pagination: orderPagination }))
    }))
    expect(await listOrders()).toEqual({ orders: [sellerOrder], pagination: orderPagination })
  })
  it('sends the canonical ready_for_pickup filter and pagination to the API', async () => {
    server.use(http.get(endpoint('/seller/orders'), ({ request }) => {
      expect(Object.fromEntries(new URL(request.url).searchParams)).toEqual({ itemStatus: 'ready_for_pickup', page: '3', limit: '25' })
      return HttpResponse.json(success({ orders: [], pagination: orderPagination }))
    }))
    await listOrders({ itemStatus: 'ready_for_pickup', page: 3, limit: 25 })
  })
  it.each(['ready_for_pickup', 'cancelled'])('PATCHes the item ID with a JSON %s status and unwraps data', async itemStatus => {
    server.use(http.patch(endpoint('/seller/orders/7/status'), async ({ request }) => {
      expect(request.headers.get('Authorization')).toBe('Bearer test-seller-token')
      expect(request.headers.get('Content-Type')).toContain('application/json')
      expect(await request.json()).toEqual({ itemStatus })
      return HttpResponse.json(success(orderUpdate(itemStatus)))
    }))
    expect(await updateOrderItemStatus(7, itemStatus)).toEqual(orderUpdate(itemStatus))
  })
  it.each([200, 409, 422])('preserves API errors including fields with HTTP %s', async status => {
    server.use(http.patch(endpoint('/seller/orders/7/status'), () => HttpResponse.json({ success: false, error: {
      code: 'CONFLICT', message: 'This seller order item status change is not allowed.', errors: { itemStatus: ['Choose an allowed status.'] },
    } }, { status })))
    await expect(updateOrderItemStatus(7, 'ready_for_pickup')).rejects.toMatchObject({
      code: 'CONFLICT', message: 'This seller order item status change is not allowed.', fieldErrors: { itemStatus: 'Choose an allowed status.' },
    })
  })
  it('loads a direct detail link beyond the first page using only the seller list', async () => {
    const pages = []
    server.use(http.get(endpoint('/seller/orders'), ({ request }) => {
      const params = new URL(request.url).searchParams
      expect(params.has('itemStatus')).toBe(false)
      expect(params.get('limit')).toBe('50')
      const page = Number(params.get('page')); pages.push(page)
      return HttpResponse.json(success({ orders: page === 2 ? [sellerOrder] : [], pagination: { page, limit: 50, total: 51, totalPages: 2 } }))
    }))
    expect(await getSellerOrder(42)).toEqual(sellerOrder)
    expect(pages).toEqual([1, 2])
  })
  it('resolves existing ORD- item links to the parent order', async () => expect(await getSellerOrder('ORD-000007')).toEqual(sellerOrder))
  it('returns not found after exhausting the server pages', async () => expect(await getSellerOrder(999)).toBeNull())
  it('rejects invalid IDs without a network request', async () => {
    server.use(http.get(endpoint('/seller/orders'), () => { throw new Error('Unexpected network request') }))
    expect(await getSellerOrder('invalid')).toBeNull()
    expect(await getSellerOrder(-1)).toBeNull()
  })
})
