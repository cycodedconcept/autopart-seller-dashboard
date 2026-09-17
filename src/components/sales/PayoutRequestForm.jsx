import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { clearPayoutFeedback, refreshSalesAndPayouts, requestPayout } from '../../features/transactionSlice'
import { formatNaira, koboToNaira } from '../../config/constant'
import { validateBankAccountRef } from '../../utils/sales'
import { ErrorNotice } from '../products/CatalogState'
import PayoutStatusBadge from './PayoutStatusBadge'

export default function PayoutRequestForm() {
  const dispatch = useDispatch()
  const { sales, salesLoading, salesError, requestingPayout, requestError, createdPayout } = useSelector(state => state.transactions)
  const [bankAccountRef, setBankAccountRef] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [review, setReview] = useState(null)
  const dialog = useRef(null)
  const available = sales?.payouts.pendingKobo ?? 0
  const canRequest = !!sales && !salesError && !salesLoading && available > 0
  const error = fieldError || requestError?.fieldErrors?.bankAccountRef
  useEffect(() => {
    if (review && dialog.current && !dialog.current.open) dialog.current.showModal()
  }, [review])

  const prepare = event => {
    event.preventDefault()
    if (!canRequest || requestingPayout) return
    const nextError = validateBankAccountRef(bankAccountRef)
    setFieldError(nextError)
    if (!nextError) setReview({ bankAccountRef: bankAccountRef.trim(), available })
  }
  const submit = async () => {
    if (!canRequest || requestingPayout) return
    const action = await dispatch(requestPayout(review.bankAccountRef))
    setReview(null)
    if (requestPayout.fulfilled.match(action)) {
      setBankAccountRef('')
      dispatch(refreshSalesAndPayouts())
    }
  }

  return <section className="catalog-panel sales-request-panel" aria-labelledby="payout-request-title">
    <div><h2 id="payout-request-title">Request a payout</h2>
      <p>Request all eligible completed sales to your payout account. The sales date filter does not limit the request.</p></div>
    {createdPayout && <div className="catalog-success sales-created" role="status">
      <div><strong>Payout #{createdPayout.id} requested.</strong><p>{formatNaira(koboToNaira(createdPayout.amountKobo))} · {createdPayout.itemCount} items · {createdPayout.bankAccountRef}</p>
        <PayoutStatusBadge status={createdPayout.status} /></div>
      <Link to={'/sales/payouts/' + createdPayout.id}>View payout</Link>
    </div>}
    {requestError && <ErrorNotice message={requestError.message} />}
    <form onSubmit={prepare} noValidate>
      <div className="catalog-field"><label htmlFor="payout-bank-reference">Bank account reference</label>
        <input id="payout-bank-reference" value={bankAccountRef} placeholder="e.g. BANK-0012345678" disabled={requestingPayout}
          onChange={event => { setBankAccountRef(event.target.value); setFieldError(''); if (requestError || createdPayout) dispatch(clearPayoutFeedback()) }}
          aria-invalid={!!error} aria-describedby={error ? 'payout-bank-error' : 'payout-bank-help'} />
        <small id="payout-bank-help">Use the reference associated with your payout bank account.</small>
        {error && <span className="catalog-field-error" id="payout-bank-error">{error}</span>}
      </div>
      <button className="catalog-button" disabled={!canRequest || requestingPayout}>{requestingPayout ? 'Requesting payout…' : 'Review payout request'}</button>
    </form>
    {!salesLoading && !salesError && sales && available <= 0 && <p className="catalog-muted">No completed sales are currently available for payout.</p>}
    {review && <dialog ref={dialog} className="catalog-dialog" aria-labelledby="review-payout-title" onCancel={event => {
      if (requestingPayout) event.preventDefault(); else setReview(null)
    }}>
      <h2 id="review-payout-title">Review payout request</h2>
      <dl className="sales-review-facts"><dt>Bank account reference</dt><dd>{review.bankAccountRef}</dd>
        <dt>Currently available</dt><dd>{formatNaira(koboToNaira(review.available))}</dd></dl>
      <p>This requests all currently eligible completed sales. The final amount is calculated when you submit and may differ from the balance shown.</p>
      <div className="catalog-actions"><button autoFocus className="catalog-button secondary" disabled={requestingPayout} onClick={() => setReview(null)}>Go back</button>
        <button className="catalog-button" disabled={requestingPayout || !canRequest} onClick={submit}>{requestingPayout ? 'Submitting…' : 'Confirm payout request'}</button></div>
    </dialog>}
  </section>
}
