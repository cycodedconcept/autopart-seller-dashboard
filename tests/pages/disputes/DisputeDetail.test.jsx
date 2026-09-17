import { expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import DisputeDetail from '../../../src/pages/disputes/DisputeDetail'
import { renderScreen } from '../../render'
import { endpoint, server } from '../../mocks/server'
import { success } from '../../mocks/fixtures'
import { disputeDetail, respondedDisputeDetail } from '../../mocks/disputes'

const renderDetail = () => renderScreen(<DisputeDetail />, { path: '/disputes/1', route: '/disputes/:id' })

it('renders the claim, SLA, authenticated evidence and timeline', async () => {
  renderDetail()
  expect(screen.getByRole('status', { name: 'Loading dispute details' })).toBeVisible()
  expect(await screen.findByRole('heading', { name: 'Dispute #1' })).toBeVisible()
  expect(screen.getByText('Wrong item sent')).toBeVisible()
  expect(screen.getByText('2h 5m remaining')).toBeVisible()
  expect(screen.getByText('Dispute opened')).toBeVisible()
  await waitFor(() => expect(screen.getByRole('link', { name: 'Open buyer-evidence.png' })).toHaveAttribute('href', 'blob:test-photo'))
  expect(screen.getByRole('link', { name: '#42' })).toHaveAttribute('href', '/orders/42')
})

it('validates the response, submits multipart evidence and shows the updated response', async () => {
  let writes = 0
  server.use(http.post(endpoint('/seller/disputes/1/respond'), async ({ request }) => {
    const body = await request.formData()
    expect(body.get('message')).toBe('The product was inspected before dispatch.')
    expect(body.getAll('evidence')).toHaveLength(1)
    writes += 1
    return HttpResponse.json(success(respondedDisputeDetail))
  }))
  renderDetail()
  const field = await screen.findByLabelText('Your response')
  await userEvent.type(field, 'Too short')
  await userEvent.click(screen.getByRole('button', { name: 'Submit response' }))
  expect(screen.getByText('Enter at least 20 characters.')).toBeVisible()
  expect(writes).toBe(0)
  await userEvent.clear(field)
  await userEvent.type(field, 'The product was inspected before dispatch.')
  const file = new File(['image'], 'packing.png', { type: 'image/png' })
  await userEvent.upload(screen.getByLabelText('Add evidence'), file)
  expect(screen.getByAltText('New photo: packing.png')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Submit response' }))
  expect(await screen.findByText('Your dispute response was submitted.')).toBeVisible()
  expect(screen.getAllByText(respondedDisputeDetail.evidence.seller.summary)).toHaveLength(2)
  expect(writes).toBe(1)
})

it('rejects unsupported and oversized evidence before submission', async () => {
  renderDetail()
  const picker = await screen.findByLabelText('Add evidence')
  await userEvent.upload(picker, new File(['document'], 'notes.pdf', { type: 'application/pdf' }), { applyAccept: false })
  expect(screen.getByText('notes.pdf must be a JPEG, PNG or WebP image.')).toBeVisible()
  const large = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' })
  await userEvent.upload(picker, large)
  expect(screen.getByText('large.png must be 5 MB or smaller.')).toBeVisible()
})

it('shows API field errors and allows another attempt', async () => {
  server.use(http.post(endpoint('/seller/disputes/1/respond'), () => HttpResponse.json({ success: false, error: {
    code: 'VALIDATION_ERROR', message: 'Check the response.', errors: { message: ['Add the requested dispatch details.'] },
  } }, { status: 422 })))
  renderDetail()
  await userEvent.type(await screen.findByLabelText('Your response'), 'This response is long enough to submit.')
  await userEvent.click(screen.getByRole('button', { name: 'Submit response' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Check the response.')
  expect(screen.getByText('Add the requested dispatch details.')).toBeVisible()
})

it('renders a ruling and prevents responses after resolution', async () => {
  const resolved = {
    ...disputeDetail,
    dispute: { ...disputeDetail.dispute, status: 'resolved' },
    sla: { ...disputeDetail.sla, breached: true },
    ruling: { id: 8, decision: 'partial_refund', partialAmountKobo: 250000, requireReverseLogistics: true, createdAt: '2026-09-17T08:00:00.000Z' },
  }
  server.use(http.get(endpoint('/seller/disputes/1'), () => HttpResponse.json(success(resolved))))
  renderDetail()
  expect(await screen.findByText('Responses unavailable')).toBeVisible()
  expect(screen.getByText('₦2,500')).toBeVisible()
  expect(screen.getByText('Response deadline passed')).toBeVisible()
  expect(screen.queryByRole('button', { name: 'Submit response' })).not.toBeInTheDocument()
  expect(screen.getByText('Return required').parentElement).toHaveTextContent('Yes')
})

it('shows retryable load errors and a missing state', async () => {
  server.use(http.get(endpoint('/seller/disputes/1'), () => HttpResponse.json({ success: false, error: { message: 'Cannot load dispute.' } }, { status: 503 })))
  renderDetail()
  expect(await screen.findByRole('alert')).toHaveTextContent('Cannot load dispute.')
  server.use(http.get(endpoint('/seller/disputes/1'), () => HttpResponse.json(success(null))))
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(await screen.findByRole('heading', { name: 'Dispute not found' })).toBeVisible()
})
