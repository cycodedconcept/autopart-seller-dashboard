import { expect, it, vi } from 'vitest'
import { screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import Orders from '../../../src/pages/orders/Orders'
import { renderScreen } from '../../render'
import { server, endpoint } from '../../mocks/server'
import { sellerOrder, orderPagination } from '../../mocks/orders'
import { success } from '../../mocks/fixtures'
import { API_ORIGIN } from '../../../src/config/constant'

it('shows loading and grouped items with real order IDs, accurate money, images and pickup status', async () => {
  renderScreen(<Orders />)
  expect(screen.getByRole('status', { name: 'Loading orders' })).toBeVisible()
  expect(await screen.findByText('Mazda radiator')).toBeVisible()
  expect(screen.getByRole('link', { name: 'Order #42' })).toHaveAttribute('href', '/orders/42')
  expect(screen.getByRole('link', { name: 'Manage Mazda radiator' })).toHaveAttribute('href', '/orders/42#item-7')
  expect(screen.getByText('₦85,000.01')).toBeVisible()
  expect(screen.getByText('₦42,500.02')).toBeVisible()
  expect(screen.getByAltText('Mazda radiator')).toHaveAttribute('src', API_ORIGIN + '/uploads/radiator.png')
  expect(screen.getByAltText('Brake pads')).toHaveAttribute('src', 'https://example.com/disc-1.png')
  expect(within(screen.getByRole('table')).getByText('Ready for Pickup')).toBeVisible()
  expect(screen.queryByText('Shipped')).not.toBeInTheDocument()
  expect(screen.getByRole('navigation', { name: 'Order pagination' })).toHaveTextContent('1 orders')
  expect(screen.getByText('Total orders').parentElement).toHaveTextContent('1')
  expect(screen.getByText('Pending items').parentElement).toHaveTextContent('On this page')
})
it('renders an empty state and disables navigation when there are no orders', async () => {
  server.use(http.get(endpoint('/seller/orders'), () => HttpResponse.json(success({ orders: [], pagination: { ...orderPagination, total: 0, totalPages: 0 } }))))
  renderScreen(<Orders />)
  expect(await screen.findByText('No orders yet')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Export this page' })).toBeDisabled()
})
it('shows an API error with retry and then renders orders', async () => {
  server.use(http.get(endpoint('/seller/orders'), () => HttpResponse.json({ success: false, error: { message: 'Orders unavailable.' } }, { status: 503 })))
  renderScreen(<Orders />)
  expect(await screen.findByRole('alert')).toHaveTextContent('Orders unavailable.')
  server.use(http.get(endpoint('/seller/orders'), () => HttpResponse.json(success({ orders: [sellerOrder], pagination: orderPagination }))))
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(await screen.findByText('Mazda radiator')).toBeVisible()
})
it('sends server page, status and limit changes, resetting the page when filters change', async () => {
  const queries = []
  server.use(http.get(endpoint('/seller/orders'), ({ request }) => {
    const query = Object.fromEntries(new URL(request.url).searchParams); queries.push(query)
    return HttpResponse.json(success({ orders: [sellerOrder], pagination: { ...orderPagination, page: Number(query.page), limit: Number(query.limit), total: 60, totalPages: 6 } }))
  }))
  renderScreen(<Orders />)
  await screen.findByText('Mazda radiator')
  await userEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() => expect(queries.at(-1).page).toBe('2'))
  await screen.findByText('Mazda radiator')
  await userEvent.selectOptions(screen.getByLabelText('Item status'), 'ready_for_pickup')
  await waitFor(() => expect(queries.at(-1)).toEqual({ itemStatus: 'ready_for_pickup', page: '1', limit: '10' }))
  await screen.findByText('Mazda radiator')
  await userEvent.selectOptions(screen.getByLabelText('Orders per page'), '25')
  await waitFor(() => expect(queries.at(-1)).toEqual({ itemStatus: 'ready_for_pickup', page: '1', limit: '25' }))
  await screen.findByText('Mazda radiator')
  await userEvent.selectOptions(screen.getByLabelText('Item status'), '')
  await waitFor(() => expect(queries.at(-1)).toEqual({ page: '1', limit: '25' }))
})
it('restores a linked filter and never offers confirmed or the misspelled status', async () => {
  renderScreen(<Orders />, { path: '/?itemStatus=ready_for_pickup&page=1&limit=25' })
  expect(await screen.findByText('Brake pads')).toBeVisible()
  expect(screen.queryByText('Mazda radiator')).not.toBeInTheDocument()
  expect(screen.getByLabelText('Item status')).toHaveValue('ready_for_pickup')
  expect(screen.queryByRole('option', { name: 'Confirmed' })).not.toBeInTheDocument()
  expect(screen.getByLabelText('Orders per page')).toHaveValue('25')
})
it('clearly scopes search and export to the current page', async () => {
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  renderScreen(<Orders />)
  await screen.findByText('Mazda radiator')
  await userEvent.type(screen.getByLabelText('Search this page'), 'BRAKE')
  expect(screen.queryByText('Mazda radiator')).not.toBeInTheDocument()
  expect(screen.getByText('Brake pads')).toBeVisible()
  await userEvent.click(screen.getByRole('button', { name: 'Export this page' }))
  const blob = URL.createObjectURL.mock.calls.at(-1)[0]
  const csv = await blob.text()
  expect(csv).toContain('Brake pads')
  expect(csv).toContain('42500.02')
  expect(csv).not.toContain('Mazda radiator')
  expect(click).toHaveBeenCalledOnce()
})
