import { it, expect, vi } from 'vitest'
import { screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse, delay } from 'msw'
import Products from '../../../src/pages/products/Products'
import { renderScreen } from '../../render'
import { server, endpoint } from '../../mocks/server'
import { listItem, pagination, success } from '../../mocks/fixtures'

it('shows loading then populated rows with naira and part numbers', async () => {
  server.use(http.get(endpoint('/seller/products'), async () => { await delay(100); return HttpResponse.json(success({ products: [listItem], pagination })) }))
  renderScreen(<Products />)
  expect(screen.getByRole('status', { name: 'Loading products' })).toBeVisible()
  expect(await screen.findByText('Mazda radiator')).toBeVisible()
  expect(screen.getByText('₦85,000.01')).toBeVisible()
  expect(screen.getByText(listItem.partNumber)).toBeVisible()
})
it('shows the empty state only after loading completes', async () => {
  server.use(http.get(endpoint('/seller/products'), () => HttpResponse.json(success({ products: [], pagination: { ...pagination, total: 0, totalPages: 0 } }))))
  renderScreen(<Products />)
  expect(screen.queryByText('No products yet')).not.toBeInTheDocument()
  expect(await screen.findByText('No products yet')).toBeVisible()
})
it('shows a request error and retries successfully', async () => {
  server.use(http.get(endpoint('/seller/products'), () => HttpResponse.json({ success: false, error: { message: 'Catalog unavailable.' } }, { status: 503 })))
  renderScreen(<Products />)
  expect(await screen.findByRole('alert')).toHaveTextContent('Catalog unavailable.')
  expect(screen.queryByText('No products yet')).not.toBeInTheDocument()
  server.resetHandlers()
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(await screen.findByText('Mazda radiator')).toBeVisible()
})
it('requires named confirmation, removes the row, then refetches server totals', async () => {
  let deleted = false
  const reads = vi.fn()
  const deletes = vi.fn()
  server.use(
    http.get(endpoint('/seller/products'), ({ request }) => { reads(); expect(new URL(request.url).searchParams.get('status')).toBe('active'); return HttpResponse.json(success({ products: deleted ? [] : [listItem], pagination: { ...pagination, total: deleted ? 0 : 1 } })) }),
    http.delete(endpoint('/seller/products/4010'), () => { deletes(); deleted = true; return HttpResponse.json(success({ ...listItem, status: 'inactive' })) }),
  )
  renderScreen(<Products />)
  await userEvent.click(await screen.findByRole('button', { name: 'Delete Mazda radiator' }))
  expect(deletes).not.toHaveBeenCalled()
  const dialog = screen.getByRole('dialog', { name: 'Remove Mazda radiator?' })
  await userEvent.click(within(dialog).getByRole('button', { name: 'Remove product' }))
  expect(await screen.findByText('Product removed.')).toBeVisible()
  await waitFor(() => expect(reads).toHaveBeenCalledTimes(2))
  expect(await screen.findByText('No products yet')).toBeVisible()
  expect(screen.queryByRole('button', { name: 'Delete Mazda radiator' })).not.toBeInTheDocument()
})
it('keeps the row on delete failure and allows cancellation without a request', async () => {
  const deletes = vi.fn()
  server.use(http.delete(endpoint('/seller/products/4010'), () => { deletes(); return HttpResponse.json({ success: false, error: { message: 'Could not remove product.' } }, { status: 500 }) }))
  renderScreen(<Products />)
  await userEvent.click(await screen.findByRole('button', { name: 'Delete Mazda radiator' }))
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(deletes).not.toHaveBeenCalled()
  await userEvent.click(screen.getByRole('button', { name: 'Delete Mazda radiator' }))
  await userEvent.click(screen.getByRole('button', { name: 'Remove product' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Could not remove product.')
  expect(screen.getByText('Mazda radiator')).toBeVisible()
})
it('changes the server query when moving between pages', async () => {
  const pages = []
  server.use(http.get(endpoint('/seller/products'), ({ request }) => {
    const page = Number(new URL(request.url).searchParams.get('page')); pages.push(page)
    return HttpResponse.json(success({ products: [listItem], pagination: { page, limit: 10, total: 11, totalPages: 2 } }))
  }))
  renderScreen(<Products />)
  await screen.findByText('Mazda radiator')
  await userEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() => expect(pages).toEqual([1, 2]))
})
