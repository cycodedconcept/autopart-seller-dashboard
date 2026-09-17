import { expect, it } from 'vitest'
import { screen, within, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { renderScreen } from '../render'
import { server, endpoint } from '../mocks/server'
import { salesSummary, payout, payoutPagination } from '../mocks/sales'
import { success } from '../mocks/fixtures'
import Transactions from '../../src/pages/Transactions'

it('renders the server sales summary, precise kobo amounts and separately scoped payout balances', async () => {
  renderScreen(<Transactions />)
  expect(screen.getByRole('status', { name: 'Loading sales summary' })).toBeVisible()
  expect(screen.getByRole('status', { name: 'Loading payout history' })).toBeVisible()
  const sales = await screen.findByRole('region', { name: 'Sales summary' })
  expect(within(sales).getByText('₦125,000.03')).toBeVisible()
  expect(within(sales).getByText('₦15,000')).toBeVisible()
  expect(within(sales).getByText('₦110,000.03')).toBeVisible()
  expect(sales).toHaveTextContent('Commission rate: 12%')
  expect(sales).toHaveTextContent('Paid orders 24')
  expect(sales).toHaveTextContent('Items sold 39')
  const balances = screen.getByRole('region', { name: 'Payout balances' })
  expect(balances).toHaveTextContent('Across all dates')
  expect(within(balances).getByText('₦81,000.01')).toBeVisible()
  expect(within(balances).getByText('₦27,000.02')).toBeVisible()
  expect(within(balances).getByText('₦18,000.03')).toBeVisible()
  expect(within(balances).getByText('₦90,000.04')).toBeVisible()
  expect(screen.getByLabelText('Start date')).toHaveValue(salesSummary.period.dateFrom)
  const table = await screen.findByRole('table', { name: 'Seller payout history' })
  for (const status of ['Requested', 'Approved', 'Paid', 'Rejected']) expect(within(table).getByRole('cell', { name: status, exact: true })).toBeVisible()
  expect(screen.queryByText('Completed')).not.toBeInTheDocument()
  expect(screen.queryByText('Reversal')).not.toBeInTheDocument()
})
it('shows zero sales and balances as zero rather than omitting the summary', async () => {
  server.use(http.get(endpoint('/seller/sales'), () => HttpResponse.json(success({ ...salesSummary,
    commissionRatePercent: 0, sales: { totalOrders: 0, totalItems: 0, grossSalesKobo: 0, commissionKobo: 0, netSalesKobo: 0 },
    payouts: { pendingKobo: 0, requestedKobo: 0, approvedKobo: 0, paidKobo: 0 },
  }))))
  renderScreen(<Transactions />)
  expect(await screen.findByText('No paid sales in this period.')).toBeVisible()
  expect(screen.getByText('Commission rate: 0%')).toBeVisible()
  expect(within(screen.getByRole('region', { name: 'Payout balances' })).getAllByText('₦0')).toHaveLength(4)
  expect(screen.getByRole('button', { name: 'Review payout request' })).toBeDisabled()
})
it('blocks incomplete/reversed date ranges, applies valid dates to sales only, and restores the default period', async () => {
  const salesQueries = []; let historyReads = 0
  server.use(http.get(endpoint('/seller/sales'), ({ request }) => {
    const query = Object.fromEntries(new URL(request.url).searchParams); salesQueries.push(query)
    return HttpResponse.json(success({ ...salesSummary, period: query.dateFrom ? query : salesSummary.period }))
  }), http.get(endpoint('/seller/payouts'), () => { historyReads += 1; return HttpResponse.json(success({ payouts: [payout], pagination: payoutPagination })) }))
  renderScreen(<Transactions />)
  await screen.findByText('Sales summary')
  fireEvent.change(screen.getByLabelText('Start date'), { target: { value: '2026-07-07' } })
  fireEvent.change(screen.getByLabelText('End date'), { target: { value: '' } })
  await userEvent.click(screen.getByRole('button', { name: 'Apply dates' }))
  expect(screen.getByText('Enter a valid end date.')).toBeVisible()
  fireEvent.change(screen.getByLabelText('End date'), { target: { value: '2026-07-01' } })
  await userEvent.click(screen.getByRole('button', { name: 'Apply dates' }))
  expect(screen.getByText('End date must be on or after start date.')).toBeVisible()
  expect(salesQueries).toHaveLength(1)
  fireEvent.change(screen.getByLabelText('Start date'), { target: { value: '2026-07-01' } })
  fireEvent.change(screen.getByLabelText('End date'), { target: { value: '2026-07-07' } })
  await userEvent.click(screen.getByRole('button', { name: 'Apply dates' }))
  await waitFor(() => expect(salesQueries.at(-1)).toEqual({ dateFrom: '2026-07-01', dateTo: '2026-07-07' }))
  await screen.findByText('Sales summary')
  expect(historyReads).toBe(1)
  await userEvent.click(screen.getByRole('button', { name: 'Default period' }))
  await waitFor(() => expect(salesQueries.at(-1)).toEqual({}))
  expect(historyReads).toBe(1)
})
it('keeps history visible when sales fail, and retries only sales', async () => {
  server.use(http.get(endpoint('/seller/sales'), () => HttpResponse.json({ success: false, error: { message: 'Sales summary unavailable.' } }, { status: 503 })))
  renderScreen(<Transactions />)
  expect(await screen.findByRole('alert')).toHaveTextContent('Sales summary unavailable.')
  expect(await screen.findByRole('table')).toBeVisible()
  server.use(http.get(endpoint('/seller/sales'), () => HttpResponse.json(success(salesSummary))))
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(await screen.findByRole('region', { name: 'Sales summary' })).toBeVisible()
})
it('keeps the summary visible when history fails, and retries history', async () => {
  server.use(http.get(endpoint('/seller/payouts'), () => HttpResponse.json({ success: false, error: { message: 'Payout history unavailable.' } }, { status: 503 })))
  renderScreen(<Transactions />)
  expect(await screen.findByRole('alert')).toHaveTextContent('Payout history unavailable.')
  expect(await screen.findByRole('region', { name: 'Sales summary' })).toBeVisible()
  server.use(http.get(endpoint('/seller/payouts'), () => HttpResponse.json(success({ payouts: [], pagination: { ...payoutPagination, total: 0, totalPages: 0 } }))))
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(await screen.findByText('No payouts yet')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
})
it('sends payout status/page/page size to the API without changing the sales range', async () => {
  const queries = []
  server.use(http.get(endpoint('/seller/payouts'), ({ request }) => {
    const query = Object.fromEntries(new URL(request.url).searchParams); queries.push(query)
    return HttpResponse.json(success({ payouts: [payout], pagination: { ...payoutPagination, page: Number(query.page), limit: Number(query.limit), total: 70, totalPages: 7 } }))
  }))
  renderScreen(<Transactions />, { path: '/?dateFrom=2026-07-01&dateTo=2026-07-07' })
  await screen.findByRole('table')
  await userEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() => expect(queries.at(-1).page).toBe('2'))
  await screen.findByRole('table')
  await userEvent.selectOptions(screen.getByLabelText('Payout status'), 'approved')
  await waitFor(() => expect(queries.at(-1)).toEqual({ status: 'approved', page: '1', limit: '10' }))
  await screen.findByRole('table')
  await userEvent.selectOptions(screen.getByLabelText('Payouts per page'), '25')
  await waitFor(() => expect(queries.at(-1)).toEqual({ status: 'approved', page: '1', limit: '25' }))
  await screen.findByRole('table')
  await userEvent.selectOptions(screen.getByLabelText('Payout status'), '')
  await waitFor(() => expect(queries.at(-1)).toEqual({ page: '1', limit: '25' }))
  expect(screen.getByLabelText('Start date')).toHaveValue('2026-07-01')
  expect(screen.getByLabelText('End date')).toHaveValue('2026-07-07')
})
it('makes payout details reachable using the real payout ID', async () => {
  renderScreen(<Transactions />)
  expect(await screen.findByRole('link', { name: 'View payout 77' })).toHaveAttribute('href', '/sales/payouts/77')
})
