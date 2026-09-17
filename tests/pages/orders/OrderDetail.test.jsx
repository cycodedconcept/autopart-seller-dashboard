import { expect, it } from 'vitest'
import { screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { http, HttpResponse, delay } from 'msw'
import OrderDetail from '../../../src/pages/orders/OrderDetail'
import Orders from '../../../src/pages/orders/Orders'
import { renderScreen } from '../../render'
import { server, endpoint } from '../../mocks/server'
import { sellerOrder, orderItem, orderPagination, orderUpdate } from '../../mocks/orders'
import { success } from '../../mocks/fixtures'

const renderDetail = () => renderScreen(<OrderDetail />, { path: '/orders/42', route: '/orders/:id' })

it('loads directly with every seller item, exact prices, real payment and delivery data', async () => {
  renderDetail()
  expect(screen.getByRole('status', { name: 'Loading order details' })).toBeVisible()
  expect(await screen.findByRole('heading', { name: 'Order #42' })).toBeVisible()
  expect(screen.getByRole('article', { name: 'Mazda radiator' })).toHaveTextContent('₦85,000.01')
  expect(screen.getByRole('article', { name: 'Brake pads' })).toHaveTextContent('₦21,250.01')
  expect(screen.getByText('10 Test Street, Ikeja, Lagos')).toBeVisible()
  expect(screen.getByText('₦127,500.03')).toBeVisible()
  expect(within(screen.getByRole('region', { name: 'Payment' })).getByText('paid')).toBeVisible()
  expect(screen.getByText('Ready for courier pickup.')).toBeVisible()
  expect(screen.getAllByRole('img')).toHaveLength(2)
  expect(screen.queryByText('Shipped')).not.toBeInTheDocument()
})
it('marks an item ready with the item ID, disables duplicate submits and refreshes the current list query', async () => {
  const reads = []
  let status = 'pending'
  let writes = 0
  server.use(
    http.get(endpoint('/seller/orders'), ({ request }) => {
      reads.push(Object.fromEntries(new URL(request.url).searchParams))
      return HttpResponse.json(success({ orders: [{ ...sellerOrder, items: [{ ...orderItem, itemStatus: status }] }], pagination: orderPagination }))
    }),
    http.patch(endpoint('/seller/orders/7/status'), async ({ request }) => {
      writes += 1
      expect(await request.json()).toEqual({ itemStatus: 'ready_for_pickup' })
      await delay(100)
      status = 'ready_for_pickup'
      return HttpResponse.json(success(orderUpdate()))
    }),
  )
  const { store } = renderDetail()
  const ready = await screen.findByRole('button', { name: 'Mark as Ready for Pickup' })
  await userEvent.click(ready)
  expect(screen.getByRole('button', { name: 'Updating…' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Cancel item' })).toBeDisabled()
  expect(await screen.findByText('Item marked as ready for pickup.')).toBeVisible()
  expect(screen.getByText('Ready for courier pickup.')).toBeVisible()
  await waitFor(() => expect(reads).toHaveLength(2))
  expect(reads[1]).toEqual({ page: '1', limit: '10' })
  await waitFor(() => expect(store.getState().orders.list[0].items[0].itemStatus).toBe('ready_for_pickup'))
  expect(writes).toBe(1)
})
it('requires a named confirmation for cancellation and leaves sibling items unchanged', async () => {
  let writes = 0
  server.use(http.patch(endpoint('/seller/orders/7/status'), async ({ request }) => {
    expect(await request.json()).toEqual({ itemStatus: 'cancelled' }); writes += 1
    return HttpResponse.json(success(orderUpdate('cancelled')))
  }))
  const { store } = renderDetail()
  await userEvent.click(await screen.findByRole('button', { name: 'Cancel item' }))
  expect(screen.getByRole('dialog', { name: 'Cancel Mazda radiator?' })).toBeVisible()
  expect(writes).toBe(0)
  await userEvent.click(screen.getByRole('button', { name: 'Keep item' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(writes).toBe(0)
  await userEvent.click(screen.getByRole('button', { name: 'Cancel item' }))
  await userEvent.click(screen.getByRole('button', { name: 'Confirm cancellation' }))
  expect(await screen.findByText('Order item cancelled.')).toBeVisible()
  expect(within(screen.getByRole('article', { name: 'Mazda radiator' })).getByText('Cancelled')).toBeVisible()
  expect(store.getState().orders.detail.items[1].itemStatus).toBe('ready_for_pickup')
  expect(within(screen.getByRole('region', { name: 'Payment' })).getByText('paid')).toBeVisible()
  expect(writes).toBe(1)
})
it('displays the API failure, retains the status and allows retry', async () => {
  server.use(http.patch(endpoint('/seller/orders/7/status'), () => HttpResponse.json({ success: false, error: { code: 'CONFLICT', message: 'Seller can only manage paid order items.' } }, { status: 409 })))
  renderDetail()
  await userEvent.click(await screen.findByRole('button', { name: 'Mark as Ready for Pickup' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Seller can only manage paid order items.')
  expect(within(screen.getByRole('article', { name: 'Mazda radiator' })).getByText('Pending')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Mark as Ready for Pickup' })).toBeEnabled()
  server.use(http.patch(endpoint('/seller/orders/7/status'), () => HttpResponse.json(success(orderUpdate()))))
  await userEvent.click(screen.getByRole('button', { name: 'Mark as Ready for Pickup' }))
  expect(await screen.findByText('Item marked as ready for pickup.')).toBeVisible()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})
it.each([
  ['unpaid order', { paymentStatus: 'pending' }, {}],
  ['cancelled order', { status: 'cancelled' }, {}],
  ['delivered order', { status: 'delivered' }, {}],
  ['ready item', {}, { itemStatus: 'ready_for_pickup' }],
  ['picked up item', {}, { itemStatus: 'picked_up' }],
  ['delivered item', {}, { itemStatus: 'delivered' }],
  ['cancelled item', {}, { itemStatus: 'cancelled' }],
])('does not offer invalid status changes for a %s', async (_, parent, item) => {
  server.use(http.get(endpoint('/seller/orders'), () => HttpResponse.json(success({ orders: [{ ...sellerOrder, ...parent, items: [{ ...orderItem, ...item }] }], pagination: orderPagination }))))
  renderDetail()
  await screen.findByRole('heading', { name: 'Order #42' })
  expect(screen.queryByRole('button', { name: 'Mark as Ready for Pickup' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Cancel item' })).not.toBeInTheDocument()
})
it('supports a filtered list → full detail → pickup → refreshed filtered list flow', async () => {
  let status = 'pending'
  const queries = []
  server.use(http.get(endpoint('/seller/orders'), ({ request }) => {
    const query = Object.fromEntries(new URL(request.url).searchParams); queries.push(query)
    const items = [{ ...orderItem, itemStatus: status }, sellerOrder.items[1]].filter(item => !query.itemStatus || item.itemStatus === query.itemStatus)
    return HttpResponse.json(success({ orders: items.length ? [{ ...sellerOrder, items }] : [], pagination: { ...orderPagination, total: items.length ? 1 : 0, totalPages: items.length ? 1 : 0 } }))
  }), http.patch(endpoint('/seller/orders/7/status'), () => { status = 'ready_for_pickup'; return HttpResponse.json(success(orderUpdate())) }))
  renderScreen(<Routes><Route path="/orders" element={<Orders />} /><Route path="/orders/:id" element={<OrderDetail />} /></Routes>, { path: '/orders?itemStatus=pending', route: '*' })
  await userEvent.click(await screen.findByRole('link', { name: 'Manage Mazda radiator' }))
  expect(await screen.findByRole('heading', { name: 'Brake pads' })).toBeVisible()
  await userEvent.click(screen.getByRole('button', { name: 'Mark as Ready for Pickup' }))
  await screen.findByText('Item marked as ready for pickup.')
  await userEvent.click(screen.getByRole('link', { name: 'Back to orders' }))
  expect(await screen.findByText('No orders with this item status')).toBeVisible()
  expect(queries.at(-1).itemStatus).toBe('pending')
  await userEvent.selectOptions(screen.getByLabelText('Item status'), 'ready_for_pickup')
  expect(await screen.findByText('Mazda radiator')).toBeVisible()
  expect(within(screen.getByRole('table')).getAllByText('Ready for Pickup')).toHaveLength(2)
})
it('shows missing orders and retryable detail errors', async () => {
  server.use(http.get(endpoint('/seller/orders'), () => HttpResponse.json({ success: false, error: { message: 'Cannot load order.' } }, { status: 503 })))
  renderDetail()
  expect(await screen.findByRole('alert')).toHaveTextContent('Cannot load order.')
  server.use(http.get(endpoint('/seller/orders'), () => HttpResponse.json(success({ orders: [], pagination: { ...orderPagination, total: 0, totalPages: 0 } }))))
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(await screen.findByRole('heading', { name: 'Order not found' })).toBeVisible()
})
