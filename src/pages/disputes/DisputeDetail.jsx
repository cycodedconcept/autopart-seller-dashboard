import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock3 } from 'lucide-react'
import { clearResponseFeedback, fetchDispute, respondToDispute } from '../../features/disputeSlice'
import { ErrorNotice } from '../../components/products/CatalogState'
import DisputeStatusBadge from '../../components/disputes/DisputeStatusBadge'
import DisputeEvidence from '../../components/disputes/DisputeEvidence'
import DisputeResponseForm from '../../components/disputes/DisputeResponseForm'
import { canSellerRespond, DISPUTE_EVENT_LABELS, disputeReasonLabel, formatDisputeDate, formatSla, sellerResponseBlockReason } from '../../utils/disputes'
import { formatNaira, koboToNaira } from '../../config/constant'
import { DisputeTimelineEventType } from '../../types/disputes'
import '../../styles/disputes.css'

const actorLabel = event => event.actor?.type === 'admin' ? 'Admin' : event.event === 'seller_responded' ? 'Seller' : event.event === 'buyer_responded' || event.event === 'opened' ? 'Buyer' : 'System'

function TimelineDetail({ event }) {
  const detail = event.detail || {}
  if (detail.message) return <p>{detail.message}</p>
  if (event.event === 'info_requested') return <p>Requested from {detail.requestedFrom?.replaceAll('_', ' ') || 'a dispute participant'}.</p>
  if (event.event === 'ruled') return <p>Decision: {detail.decision?.replaceAll('_', ' ') || 'See ruling'}{Number.isSafeInteger(detail.partialAmountKobo) ? ` · ${formatNaira(koboToNaira(detail.partialAmountKobo))}` : ''}</p>
  if (event.event === 'opened') return <p>Raised by {detail.raisedBy || 'buyer'}.</p>
  return null
}

export default function DisputeDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { detail, detailLoading, detailError, query, responding, responseError, responseSuccess } = useSelector(state => state.disputes)

  useEffect(() => {
    const request = dispatch(fetchDispute(id))
    return () => request.abort()
  }, [dispatch, id])

  const backQuery = new URLSearchParams({ status: query.status || 'all',
    ...(query.dateFrom ? { dateFrom: query.dateFrom } : {}), ...(query.dateTo ? { dateTo: query.dateTo } : {}),
    page: String(query.page || 1), limit: String(query.limit || 10) })
  const submit = async values => {
    try { await dispatch(respondToDispute({ id, ...values })).unwrap(); return true }
    catch { return false }
  }

  return <div className="catalog-page seller-disputes">
    <Link className="dispute-back" to={`/disputes?${backQuery}`}><ArrowLeft size={16} />Back to disputes</Link>
    {detailLoading ? <div role="status" aria-label="Loading dispute details" className="catalog-skeletons"><span className="sr-only">Loading dispute details…</span>
      {[0, 1, 2, 3].map(row => <div key={row} className="catalog-skeleton-row" />)}</div>
      : detailError ? <ErrorNotice message={detailError.message} onRetry={() => dispatch(fetchDispute(id))} />
        : !detail ? <div className="catalog-empty"><h1>Dispute not found</h1><p>This dispute is not available in your seller account.</p></div>
          : <>
            <header className="catalog-header dispute-detail-header"><div><h1>Dispute #{detail.dispute.id}</h1>
              <p>Order <Link to={`/orders/${detail.dispute.orderId}`}>#{detail.dispute.orderId}</Link> · Opened {formatDisputeDate(detail.dispute.createdAt)}</p></div>
              <DisputeStatusBadge status={detail.dispute.status} />
            </header>
            <div className="dispute-detail-grid">
              <div>
                <section className="catalog-panel" aria-labelledby="claim-title"><h2 id="claim-title">Customer claim</h2>
                  <p className="dispute-reason">{disputeReasonLabel(detail.dispute.reason)}</p>
                  <p className="catalog-description">{detail.dispute.description}</p>
                </section>
                <section className="catalog-panel" aria-labelledby="evidence-title"><h2 id="evidence-title">Evidence</h2>
                  {['buyer', 'seller'].map(party => <div className="dispute-evidence-group" key={party}>
                    <h3>{party === 'buyer' ? 'Customer evidence' : 'Your evidence'}</h3>
                    {detail.evidence[party].summary && <p className="catalog-description">{detail.evidence[party].summary}</p>}
                    {detail.evidence[party].attachments.length ? <div className="dispute-evidence-grid">
                      {detail.evidence[party].attachments.map(attachment => <DisputeEvidence attachment={attachment} key={attachment.id} />)}
                    </div> : <p className="catalog-muted">No {party === 'buyer' ? 'customer' : 'seller'} attachments submitted.</p>}
                  </div>)}
                </section>
                {responseSuccess && <div className="catalog-success" role="status">Your dispute response was submitted.</div>}
                {canSellerRespond(detail) ? <DisputeResponseForm busy={responding} error={responseError} onSubmit={submit} onClearError={() => dispatch(clearResponseFeedback())} />
                  : <section className="catalog-panel dispute-response-closed"><h2>Responses unavailable</h2><p>{sellerResponseBlockReason(detail)}</p></section>}
              </div>
              <aside>
                <section className={`catalog-panel dispute-sla${detail.sla.breached ? ' breached' : ''}`} aria-labelledby="sla-title">
                  <Clock3 size={20} aria-hidden="true" /><div><h2 id="sla-title">Response deadline</h2><strong>{formatSla(detail.sla)}</strong>
                    <p>{formatDisputeDate(detail.sla.deadlineAt)}</p></div>
                </section>
                {detail.ruling && <section className="catalog-panel" aria-labelledby="ruling-title"><h2 id="ruling-title">Ruling</h2>
                  <dl className="dispute-facts"><div><dt>Decision</dt><dd>{detail.ruling.decision.replaceAll('_', ' ')}</dd></div>
                    {Number.isSafeInteger(detail.ruling.partialAmountKobo) && <div><dt>Partial amount</dt><dd>{formatNaira(koboToNaira(detail.ruling.partialAmountKobo))}</dd></div>}
                    <div><dt>Return required</dt><dd>{detail.ruling.requireReverseLogistics ? 'Yes' : 'No'}</dd></div>
                    <div><dt>Decided</dt><dd>{formatDisputeDate(detail.ruling.createdAt)}</dd></div></dl>
                </section>}
                <section className="catalog-panel" aria-labelledby="timeline-title"><h2 id="timeline-title">Timeline</h2>
                  <ol className="dispute-timeline">{detail.timeline.map(event => <li key={event.id}><span className="dispute-timeline-dot" aria-hidden="true" />
                    <div><strong>{DISPUTE_EVENT_LABELS[event.event] || event.event.replaceAll('_', ' ')}</strong>
                      <small>{actorLabel(event)} · {formatDisputeDate(event.timestamp)}</small><TimelineDetail event={event} /></div>
                  </li>)}</ol>
                </section>
              </aside>
            </div>
          </>}
  </div>
}

TimelineDetail.propTypes = { event: DisputeTimelineEventType.isRequired }
