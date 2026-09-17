import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { API_URL } from '../../src/config/constant'
import { productDetail, listItem, inventoryItem, summary, pagination, success } from './fixtures'
import { sellerOrder, orderPagination, orderUpdate } from './orders'
import { salesSummary, payout, payoutRows, payoutPagination } from './sales'
import { dispute, disputeDetail, disputePagination, respondedDisputeDetail } from './disputes'

export const endpoint = path => new URL(`${API_URL}${path}`, window.location.origin).href
export const server = setupServer(
  http.get(endpoint('/seller/disputes'), ({ request }) => {
    const params = new URL(request.url).searchParams
    const rows = params.get('status') && params.get('status') !== 'all' && params.get('status') !== dispute.status ? [] : [dispute]
    return HttpResponse.json(success({ disputes: rows, pagination: { ...disputePagination, page: Number(params.get('page') || 1), limit: Number(params.get('limit') || 10), total: rows.length, totalPages: rows.length ? 1 : 0 }, filters: { status: params.get('status') || 'all', dateFrom: params.get('dateFrom'), dateTo: params.get('dateTo') } }))
  }),
  http.get(endpoint('/seller/disputes/:id'), () => HttpResponse.json(success(disputeDetail))),
  http.post(endpoint('/seller/disputes/:id/respond'), () => HttpResponse.json(success(respondedDisputeDetail))),
  http.get(endpoint('/dispute-evidence/:filename'), () => new HttpResponse(new Blob(['image'], { type: 'image/png' }), { headers: { 'Content-Type': 'image/png' } })),
  http.get(endpoint('/seller/sales'), ({ request }) => {
    const params = new URL(request.url).searchParams
    return HttpResponse.json(success({ ...salesSummary, period: params.has('dateFrom') ? { dateFrom: params.get('dateFrom'), dateTo: params.get('dateTo') } : salesSummary.period }))
  }),
  http.get(endpoint('/seller/payouts'), ({ request }) => {
    const params = new URL(request.url).searchParams
    const rows = payoutRows.filter(row => !params.get('status') || row.status === params.get('status'))
    return HttpResponse.json(success({ payouts: rows, pagination: { ...payoutPagination, page: Number(params.get('page') || 1), limit: Number(params.get('limit') || 10), total: rows.length, totalPages: rows.length ? 1 : 0 } }))
  }),
  http.post(endpoint('/seller/payouts'), async ({ request }) => HttpResponse.json(success({ ...payout, id: 78, bankAccountRef: (await request.json()).bankAccountRef }), { status: 201 })),
  http.get(endpoint('/seller/orders'), ({ request }) => {
    const params = new URL(request.url).searchParams
    const itemStatus = params.get('itemStatus')
    const order = { ...sellerOrder, items: sellerOrder.items.filter(item => !itemStatus || item.itemStatus === itemStatus) }
    return HttpResponse.json(success({ orders: order.items.length ? [order] : [], pagination: { ...orderPagination, page: Number(params.get('page') || 1), limit: Number(params.get('limit') || 10) } }))
  }),
  http.patch(endpoint('/seller/orders/:id/status'), async ({ request }) => HttpResponse.json(success(orderUpdate((await request.json()).itemStatus)))),
  http.get(endpoint('/seller/products'), () => HttpResponse.json(success({ products: [listItem], pagination }))),
  http.get(endpoint('/products/:id'), () => HttpResponse.json(success(productDetail))),
  http.post(endpoint('/seller/products'), () => HttpResponse.json(success(productDetail), { status: 201 })),
  http.patch(endpoint('/seller/products/:id'), () => HttpResponse.json(success(productDetail))),
  http.delete(endpoint('/seller/products/:id'), () => HttpResponse.json(success({ ...productDetail, status: 'inactive' }))),
  http.get(endpoint('/seller/inventory'), () => HttpResponse.json(success({ inventory: [inventoryItem], summary, pagination }))),
  http.post(endpoint('/seller/inventory/bulk'), () => HttpResponse.json(success({ createdCount: 2, lowStockThreshold: 5, products: [inventoryItem] }), { status: 201 })),
)
