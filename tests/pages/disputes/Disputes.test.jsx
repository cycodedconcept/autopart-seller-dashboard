import { expect, it } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import Disputes from '../../../src/pages/disputes/Disputes'
import { renderScreen } from '../../render'
import { endpoint, server } from '../../mocks/server'
import { success } from '../../mocks/fixtures'
import { dispute, disputePagination } from '../../mocks/disputes'

it('shows loading and a populated dispute table', async () => {
  renderScreen(<Disputes />)
  expect(screen.getByRole('status', { name: 'Loading disputes' })).toBeVisible()
  expect(await screen.findByText('Wrong item sent')).toBeVisible()
  expect(screen.getByText(dispute.description)).toBeVisible()
  expect(within(screen.getByRole('table')).getByText('Open')).toBeVisible()
  expect(screen.getByRole('link', { name: 'View dispute' })).toHaveAttribute('href', '/disputes/1')
  expect(screen.getByRole('link', { name: '#42' })).toHaveAttribute('href', '/orders/42')
})

it('renders empty and retryable error states', async () => {
  server.use(http.get(endpoint('/seller/disputes'), () => HttpResponse.json(success({ disputes: [], pagination: { ...disputePagination, total: 0, totalPages: 0 }, filters: {} }))))
  const { unmount } = renderScreen(<Disputes />)
  expect(await screen.findByText('No disputes yet')).toBeVisible()
  unmount()
  server.use(http.get(endpoint('/seller/disputes'), () => HttpResponse.json({ success: false, error: { message: 'Disputes unavailable.' } }, { status: 503 })))
  renderScreen(<Disputes />)
  expect(await screen.findByRole('alert')).toHaveTextContent('Disputes unavailable.')
  server.use(http.get(endpoint('/seller/disputes'), () => HttpResponse.json(success({ disputes: [dispute], pagination: disputePagination, filters: {} }))))
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(await screen.findByText(dispute.description)).toBeVisible()
})

it('sends status, date and pagination filters to the server', async () => {
  const queries = []
  server.use(http.get(endpoint('/seller/disputes'), ({ request }) => {
    const query = Object.fromEntries(new URL(request.url).searchParams); queries.push(query)
    return HttpResponse.json(success({ disputes: [dispute], pagination: { ...disputePagination, page: Number(query.page), total: 60, totalPages: 6 }, filters: query }))
  }))
  renderScreen(<Disputes />)
  await screen.findByText(dispute.description)
  await userEvent.selectOptions(screen.getByLabelText('Status'), 'open')
  await waitFor(() => expect(queries.at(-1)).toMatchObject({ status: 'open', page: '1', limit: '10' }))
  await userEvent.type(screen.getByLabelText('From'), '2026-09-01')
  await waitFor(() => expect(queries.at(-1).dateFrom).toBe('2026-09-01'))
  await userEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() => expect(queries.at(-1).page).toBe('2'))
  await userEvent.selectOptions(screen.getByLabelText('Disputes per page'), '25')
  await waitFor(() => expect(queries.at(-1)).toMatchObject({ status: 'open', dateFrom: '2026-09-01', page: '1', limit: '25' }))
})

it('blocks an invalid date range before making another request', async () => {
  renderScreen(<Disputes />, { path: '/?dateFrom=2026-09-17&dateTo=2026-09-01' })
  expect(screen.getByRole('alert')).toHaveTextContent('From date must be on or before the to date.')
  expect(screen.queryByRole('navigation', { name: 'Dispute pagination' })).not.toBeInTheDocument()
})
