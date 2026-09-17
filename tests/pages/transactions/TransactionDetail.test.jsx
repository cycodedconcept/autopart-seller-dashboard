import { expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server, endpoint } from '../../mocks/server'
import { payout, payoutPagination } from '../../mocks/sales'
import { success } from '../../mocks/fixtures'
import { renderScreen } from '../../render'
import TransactionDetail from '../../../src/pages/transactions/TransactionDetail'

vi.mock('html2pdf.js', () => ({ default: vi.fn(() => { throw new Error('PDF unavailable') }) }))
const renderDetail = (path = '/sales/payouts/77', route = '/sales/payouts/:id') => renderScreen(<TransactionDetail />, { path, route })

it('loads payout details directly with exact amounts, reference and no invented settlement', async () => {
  renderDetail()
  expect(screen.getByRole('status', { name: 'Loading payout details' })).toBeVisible()
  const details = await screen.findByRole('article', { name: 'Payout details' })
  expect(within(details).getByText('Requested', { selector: 'span' })).toBeVisible()
  expect(within(details).getByText('₦92,000.01')).toBeVisible()
  expect(within(details).getByText('₦11,000')).toBeVisible()
  expect(details).toHaveTextContent('₦81,000.01')
  expect(details).toHaveTextContent('BANK-TEST123')
  expect(details).toHaveTextContent('Not settled')
  expect(screen.queryByText('RECEIPT')).not.toBeInTheDocument()
})
it('keeps approved payouts distinct from paid payouts and supports legacy links', async () => {
  renderDetail('/transactions/PO-0076', '/transactions/:id')
  const details = await screen.findByRole('article', { name: 'Payout details' })
  expect(details).toHaveTextContent('Approved and awaiting settlement.')
  expect(details).toHaveTextContent('Not settled')
  expect(screen.queryByText('Completed')).not.toBeInTheDocument()
})
it('shows an actual settlement date for paid payouts', async () => {
  renderDetail('/sales/payouts/75')
  const details = await screen.findByRole('article', { name: 'Payout details' })
  expect(details).toHaveTextContent('Paid payout')
  expect(within(details).getByText('Paid')).toBeVisible()
  expect(screen.queryByText('Not settled')).not.toBeInTheDocument()
})
it('shows the supplied rejection reason without treating rejection as a reversal', async () => {
  renderDetail('/sales/payouts/74')
  expect(await screen.findByText('Check the bank account reference.')).toBeVisible()
  expect(screen.queryByText('Reversal')).not.toBeInTheDocument()
})
it('handles retrieval errors and not-found results with retry and a return link', async () => {
  server.use(http.get(endpoint('/seller/payouts'), () => HttpResponse.json({ success: false, error: { message: 'Payout unavailable.' } }, { status: 503 })))
  renderDetail()
  expect(await screen.findByRole('alert')).toHaveTextContent('Payout unavailable.')
  server.use(http.get(endpoint('/seller/payouts'), () => HttpResponse.json(success({ payouts: [], pagination: { ...payoutPagination, total: 0, totalPages: 0 } }))))
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(await screen.findByText('Payout not found')).toBeVisible()
  expect(screen.getByRole('link', { name: 'Back to sales & payouts' })).toHaveAttribute('href', '/sales?page=1&limit=10')
})
it('prints and reports PDF export errors gracefully', async () => {
  const print = vi.spyOn(window, 'print').mockImplementation(() => {})
  renderDetail()
  await screen.findByRole('article', { name: 'Payout details' })
  await userEvent.click(screen.getByRole('button', { name: 'Print' }))
  expect(print).toHaveBeenCalledOnce()
  await userEvent.click(screen.getByRole('button', { name: 'Download PDF' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Could not export the payout details.')
})
it('handles absent approval/rejection metadata from older responses', async () => {
  server.use(http.get(endpoint('/seller/payouts'), () => HttpResponse.json(success({ payouts: [{ ...payout, status: 'rejected', rejectionReason: null, approvedAt: null }], pagination: payoutPagination }))))
  renderDetail()
  expect(await screen.findByText('This payout request was rejected. No reason was provided.')).toBeVisible()
})
