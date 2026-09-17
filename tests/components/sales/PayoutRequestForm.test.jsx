import { expect, it } from 'vitest'
import { screen, within, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server, endpoint } from '../../mocks/server'
import { salesSummary, payout, payoutPagination } from '../../mocks/sales'
import { success } from '../../mocks/fixtures'
import { renderScreen } from '../../render'
import PayoutRequestForm from '../../../src/components/sales/PayoutRequestForm'

const renderForm = (transactions = {}) => renderScreen(<PayoutRequestForm />, { transactions: { sales: salesSummary, ...transactions } })
const review = async () => {
  await userEvent.type(screen.getByLabelText('Bank account reference'), '  BANK-TEST123  ')
  await userEvent.click(screen.getByRole('button', { name: 'Review payout request' }))
}
it('blocks invalid bank references before opening confirmation or calling the API', async () => {
  let writes = 0
  server.use(http.post(endpoint('/seller/payouts'), () => { writes += 1; return HttpResponse.json(success(payout)) }))
  renderForm()
  await userEvent.click(screen.getByRole('button', { name: 'Review payout request' }))
  expect(screen.getByText('Enter a bank account reference between 3 and 255 characters.')).toBeVisible()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  // Set the overlong boundary directly instead of scheduling 256 keystrokes.
  fireEvent.change(screen.getByLabelText('Bank account reference'), { target: { value: 'x'.repeat(256) } })
  await userEvent.click(screen.getByRole('button', { name: 'Review payout request' }))
  expect(screen.getByLabelText('Bank account reference')).toHaveAttribute('aria-invalid', 'true')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(writes).toBe(0)
})
it('requires review of the reference and balance and allows returning without a POST', async () => {
  let writes = 0
  server.use(http.post(endpoint('/seller/payouts'), () => { writes += 1; return HttpResponse.json(success(payout)) }))
  renderForm()
  await review()
  const dialog = screen.getByRole('dialog', { name: 'Review payout request' })
  expect(dialog).toHaveTextContent('BANK-TEST123')
  expect(dialog).toHaveTextContent('₦81,000.01')
  expect(dialog).toHaveTextContent('final amount is calculated when you submit')
  expect(writes).toBe(0)
  await userEvent.click(within(dialog).getByRole('button', { name: 'Go back' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(writes).toBe(0)
})
it('sends only the reference, disables duplicate submits, displays the actual result, and refreshes both resources', async () => {
  let salesReads = 0; let historyReads = 0; let writes = 0
  let finishRequest
  let requestBody
  const responseReady = new Promise(resolve => { finishRequest = resolve })
  server.use(http.post(endpoint('/seller/payouts'), async ({ request }) => {
    writes += 1; requestBody = await request.json()
    await responseReady
    return HttpResponse.json(success({ ...payout, id: 88, amountKobo: 8200003 }), { status: 201 })
  }), http.get(endpoint('/seller/sales'), () => { salesReads += 1; return HttpResponse.json(success({ ...salesSummary, payouts: { ...salesSummary.payouts, pendingKobo: 0 } })) }),
  http.get(endpoint('/seller/payouts'), () => { historyReads += 1; return HttpResponse.json(success({ payouts: [], pagination: payoutPagination })) }))
  renderForm()
  await review()
  try {
    await userEvent.click(screen.getByRole('button', { name: 'Confirm payout request' }))
    const submitting = screen.getByRole('button', { name: 'Submitting…' })
    expect(submitting).toBeDisabled()
    expect(screen.getByLabelText('Bank account reference')).toBeDisabled()
    await userEvent.click(submitting)
    await waitFor(() => expect(requestBody).toEqual({ bankAccountRef: 'BANK-TEST123' }))
    expect(writes).toBe(1)
  } finally { finishRequest() }
  expect(await screen.findByText('Payout #88 requested.')).toBeVisible()
  expect(screen.getByRole('status')).toHaveTextContent('₦82,000.03')
  expect(screen.getByRole('link', { name: 'View payout' })).toHaveAttribute('href', '/sales/payouts/88')
  await waitFor(() => expect([salesReads, historyReads]).toEqual([1, 1]))
  expect(screen.getByRole('button', { name: 'Review payout request' })).toBeDisabled()
  expect(writes).toBe(1)
})
it('shows API field errors and permits correction and retry', async () => {
  server.use(http.post(endpoint('/seller/payouts'), () => HttpResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Check your payout account.', errors: { bankAccountRef: ['Account reference is not accepted.'] } } }, { status: 422 })))
  renderForm()
  await review()
  await userEvent.click(screen.getByRole('button', { name: 'Confirm payout request' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Check your payout account.')
  expect(screen.getByText('Account reference is not accepted.')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Review payout request' })).toBeEnabled()
  await userEvent.clear(screen.getByLabelText('Bank account reference'))
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})
it('reports a no-eligible-sales conflict without showing a success result', async () => {
  server.use(http.post(endpoint('/seller/payouts'), () => HttpResponse.json({ success: false, error: { code: 'CONFLICT', message: 'No completed sales are currently available for payout.' } }, { status: 409 })))
  renderForm()
  await review()
  await userEvent.click(screen.getByRole('button', { name: 'Confirm payout request' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('No completed sales are currently available for payout.')
  expect(screen.queryByRole('link', { name: 'View payout' })).not.toBeInTheDocument()
})
it('keeps creation success visible when the following refresh fails', async () => {
  server.use(http.get(endpoint('/seller/sales'), () => HttpResponse.json({ success: false, error: { message: 'Refresh unavailable.' } }, { status: 503 })))
  const { store } = renderForm()
  await review()
  await userEvent.click(screen.getByRole('button', { name: 'Confirm payout request' }))
  expect(await screen.findByText('Payout #78 requested.')).toBeVisible()
  await waitFor(() => expect(store.getState().transactions.salesError?.message).toBe('Refresh unavailable.'))
  expect(screen.getByRole('link', { name: 'View payout' })).toBeVisible()
  expect(store.getState().transactions.requestError).toBeNull()
})
it.each([
  { sales: null }, { salesLoading: true }, { salesError: { message: 'Unavailable' } },
  { sales: { ...salesSummary, payouts: { ...salesSummary.payouts, pendingKobo: 0 } } },
])('disables requesting when balances are unavailable or zero', state => {
  renderForm(state)
  expect(screen.getByRole('button', { name: 'Review payout request' })).toBeDisabled()
})
