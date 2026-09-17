import { it, expect, vi } from 'vitest'
import { screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse, delay } from 'msw'
import Inventory from '../../src/pages/Inventory'
import { renderScreen } from '../render'
import { server, endpoint } from '../mocks/server'
import { inventoryItem, summary, pagination, success } from '../mocks/fixtures'

it('renders server summary cards and uses stock flags instead of calculating badges', async () => {
  server.use(http.get(endpoint('/seller/inventory'), () => HttpResponse.json(success({ inventory: [{ ...inventoryItem, stockQty: 99, isLowStock: true }], summary, pagination }))))
  renderScreen(<Inventory />)
  await screen.findByText('Mazda radiator')
  expect(screen.getByText('Total listings').parentElement).toHaveTextContent('7')
  expect(screen.getByText('Active listings').parentElement).toHaveTextContent('5')
  expect(screen.getByText('Inactive listings').parentElement).toHaveTextContent('2')
  expect(screen.getByText('Units in stock').parentElement).toHaveTextContent('96')
  const row = screen.getByText('Mazda radiator').closest('tr')
  expect(within(row).getByText('99')).toBeVisible()
  expect(within(row).getByText('Low stock')).toBeVisible()
})
it('uses isOutOfStock even when stockQty disagrees', async () => {
  server.use(http.get(endpoint('/seller/inventory'), () => HttpResponse.json(success({ inventory: [{ ...inventoryItem, stockQty: 99, isOutOfStock: true }], summary, pagination }))))
  renderScreen(<Inventory />)
  const row = (await screen.findByText('Mazda radiator')).closest('tr')
  expect(within(row).getByText('Out of stock')).toBeVisible()
})
it('sends status, low-stock and page filters to the API and resets page on filter change', async () => {
  const queries = []
  server.use(http.get(endpoint('/seller/inventory'), ({ request }) => {
    const params = Object.fromEntries(new URL(request.url).searchParams); queries.push(params)
    return HttpResponse.json(success({ inventory: [inventoryItem], summary, pagination: { ...pagination, page: Number(params.page), total: 25, totalPages: 3 } }))
  }))
  renderScreen(<Inventory />)
  await screen.findByText('Mazda radiator')
  await userEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() => expect(queries.at(-1).page).toBe('2'))
  await userEvent.selectOptions(screen.getByLabelText('Listing status'), 'inactive')
  await waitFor(() => expect(queries.at(-1)).toEqual({ status: 'inactive', lowStockOnly: 'false', page: '1', limit: '10' }))
  await userEvent.click(screen.getByRole('checkbox', { name: 'Low stock only' }))
  await waitFor(() => expect(queries.at(-1).lowStockOnly).toBe('true'))
})
it('keeps inactive inventory visible without linking to an unavailable public detail', async () => {
  server.use(http.get(endpoint('/seller/inventory'), () => HttpResponse.json(success({ inventory: [{ ...inventoryItem, status: 'inactive' }], summary, pagination }))))
  renderScreen(<Inventory />)
  expect(await screen.findByText('Mazda radiator')).toBeVisible()
  expect(screen.queryByRole('link', { name: 'Mazda radiator' })).not.toBeInTheDocument()
})
it('rejects non-CSV uploads', async () => {
  renderScreen(<Inventory />)
  const user = userEvent.setup({ applyAccept: false })
  await user.upload(screen.getByLabelText('Inventory CSV'), new File(['image'], 'image.png', { type: 'image/png' }))
  expect(screen.getByRole('alert')).toHaveTextContent('Choose a CSV file.')
  expect(screen.getByRole('button', { name: 'Upload CSV' })).toBeDisabled()
})
it('shows upload progress, created count and refreshes inventory', async () => {
  const reads = vi.fn()
  server.use(http.get(endpoint('/seller/inventory'), () => { reads(); return HttpResponse.json(success({ inventory: [inventoryItem], summary, pagination })) }),
    http.post(endpoint('/seller/inventory/bulk'), async () => { await delay(100); return HttpResponse.json(success({ createdCount: 2, lowStockThreshold: 5, products: [inventoryItem] })) }))
  renderScreen(<Inventory />)
  await screen.findByText('Mazda radiator')
  await userEvent.upload(screen.getByLabelText('Inventory CSV'), new File(['title\nRadiator'], 'inventory.csv', { type: 'text/csv' }))
  await userEvent.click(screen.getByRole('button', { name: 'Upload CSV' }))
  expect(screen.getByRole('progressbar', { name: 'CSV upload progress' })).toBeVisible()
  expect(await screen.findByText('2 products created.')).toBeVisible()
  await waitFor(() => expect(reads).toHaveBeenCalledTimes(2))
  expect(screen.getByRole('link', { name: 'Download CSV template' })).toHaveAttribute('download')
})
it('shows the actual CSV validation failure without reporting a success count', async () => {
  server.use(http.post(endpoint('/seller/inventory/bulk'), () => HttpResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'CSV row 2: categoryId is required.' } }, { status: 422 })))
  renderScreen(<Inventory />)
  await userEvent.upload(screen.getByLabelText('Inventory CSV'), new File(['bad'], 'bad.csv', { type: 'text/csv' }))
  await userEvent.click(screen.getByRole('button', { name: 'Upload CSV' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('CSV row 2: categoryId is required.')
  expect(screen.queryByText(/products created\./)).not.toBeInTheDocument()
})
it('shows loading, empty and retryable error states', async () => {
  server.use(http.get(endpoint('/seller/inventory'), () => HttpResponse.json({ success: false, error: { message: 'Inventory unavailable.' } }, { status: 503 })))
  renderScreen(<Inventory />)
  expect(screen.getByRole('status', { name: 'Loading products' })).toBeVisible()
  expect(await screen.findByRole('alert')).toHaveTextContent('Inventory unavailable.')
  server.use(http.get(endpoint('/seller/inventory'), () => HttpResponse.json(success({ inventory: [], summary, pagination: { ...pagination, total: 0 } }))))
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(await screen.findByText('No inventory found')).toBeVisible()
})
