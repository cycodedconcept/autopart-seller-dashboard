import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import { Scale } from 'lucide-react'
import { fetchDisputes } from '../../features/disputeSlice'
import { ErrorNotice } from '../../components/products/CatalogState'
import DisputeStatusBadge from '../../components/disputes/DisputeStatusBadge'
import { DISPUTE_STATUSES, DISPUTE_STATUS_LABELS, disputeReasonLabel, formatDisputeDate } from '../../utils/disputes'
import '../../styles/disputes.css'

const dateParam = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') ? value : ''

export default function Disputes() {
  const dispatch = useDispatch()
  const { list, loading, error, pagination } = useSelector(state => state.disputes)
  const [params, setParams] = useSearchParams()
  const requestedPage = Number(params.get('page') || 1)
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const limit = [10, 25, 50].includes(Number(params.get('limit'))) ? Number(params.get('limit')) : 10
  const status = ['all', ...DISPUTE_STATUSES].includes(params.get('status')) ? params.get('status') : 'all'
  const dateFrom = dateParam(params.get('dateFrom'))
  const dateTo = dateParam(params.get('dateTo'))
  const dateError = dateFrom && dateTo && dateFrom > dateTo ? 'From date must be on or before the to date.' : ''

  useEffect(() => {
    if (dateError) return undefined
    const request = dispatch(fetchDisputes({ status, dateFrom, dateTo, page, limit }))
    return () => request.abort()
  }, [dispatch, status, dateFrom, dateTo, page, limit, dateError])

  useEffect(() => {
    if (!loading && !error && pagination?.page === page && page > Math.max(1, pagination.totalPages)) {
      const nextPage = Math.max(1, pagination.totalPages)
      setParams({ status, ...(dateFrom ? { dateFrom } : {}), ...(dateTo ? { dateTo } : {}), page: String(nextPage), limit: String(limit) }, { replace: true })
    }
  }, [loading, error, pagination, page, status, dateFrom, dateTo, limit, setParams])

  const changeQuery = change => {
    const next = { status, dateFrom, dateTo, page, limit, ...change }
    setParams({ status: next.status, ...(next.dateFrom ? { dateFrom: next.dateFrom } : {}),
      ...(next.dateTo ? { dateTo: next.dateTo } : {}), page: String(next.page), limit: String(next.limit) })
  }
  const retry = () => dispatch(fetchDisputes({ status, dateFrom, dateTo, page, limit }))
  const pages = Math.max(1, pagination?.totalPages || 1)
  const clearFilters = () => setParams({ status: 'all', page: '1', limit: String(limit) })

  return <div className="catalog-page seller-disputes">
    <header className="catalog-header"><div><h1>Disputes</h1><p>Review customer claims, evidence, deadlines and decisions.</p></div></header>
    <section className="dispute-toolbar" aria-label="Dispute filters">
      <div className="catalog-field"><label htmlFor="dispute-status">Status</label>
        <select id="dispute-status" value={status} onChange={event => changeQuery({ status: event.target.value, page: 1 })}>
          <option value="all">All statuses</option>
          {DISPUTE_STATUSES.map(value => <option value={value} key={value}>{DISPUTE_STATUS_LABELS[value]}</option>)}
        </select>
      </div>
      <div className="catalog-field"><label htmlFor="dispute-date-from">From</label>
        <input id="dispute-date-from" type="date" value={dateFrom} onChange={event => changeQuery({ dateFrom: event.target.value, page: 1 })} />
      </div>
      <div className="catalog-field"><label htmlFor="dispute-date-to">To</label>
        <input id="dispute-date-to" type="date" value={dateTo} onChange={event => changeQuery({ dateTo: event.target.value, page: 1 })} />
      </div>
      {(status !== 'all' || dateFrom || dateTo) && <button type="button" className="catalog-button secondary" onClick={clearFilters}>Clear filters</button>}
    </section>
    {dateError && <div className="catalog-error" role="alert">{dateError}</div>}
    {error ? <ErrorNotice message={error.message} onRetry={retry} />
      : loading ? <div role="status" aria-label="Loading disputes" className="catalog-skeletons"><span className="sr-only">Loading disputes…</span>
        {[0, 1, 2, 3].map(row => <div key={row} className="catalog-skeleton-row" />)}</div>
        : !list.length ? <div className="catalog-empty"><Scale size={38} aria-hidden="true" />
          <h2>{status !== 'all' || dateFrom || dateTo ? 'No disputes match these filters' : 'No disputes yet'}</h2>
          <p>{status !== 'all' || dateFrom || dateTo ? 'Try a different status or date range.' : 'Customer disputes involving your products will appear here.'}</p>
          {(status !== 'all' || dateFrom || dateTo) && <button className="catalog-button secondary" onClick={clearFilters}>Clear filters</button>}
        </div>
          : <div className="catalog-table-wrap"><table className="catalog-table dispute-table">
            <caption className="sr-only">Seller disputes</caption>
            <thead><tr><th>Dispute</th><th>Order</th><th>Reason</th><th>Opened</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{list.map(dispute => <tr key={dispute.id}>
              <td><div className="dispute-description"><strong>#{dispute.id}</strong><span>{dispute.description}</span></div></td>
              <td><Link to={`/orders/${dispute.orderId}`}>#{dispute.orderId}</Link></td>
              <td>{disputeReasonLabel(dispute.reason)}</td>
              <td>{formatDisputeDate(dispute.createdAt)}</td>
              <td><DisputeStatusBadge status={dispute.status} /></td>
              <td><Link className="catalog-button secondary" to={`/disputes/${dispute.id}`}>View dispute</Link></td>
            </tr>)}</tbody>
          </table></div>}
    {!error && !dateError && <nav aria-label="Dispute pagination" className="catalog-pagination">
      <span>{pagination?.total ?? 0} disputes · Page {page} of {pages}</span>
      <label>Disputes per page <select value={limit} disabled={loading} onChange={event => changeQuery({ limit: Number(event.target.value), page: 1 })}>
        {[10, 25, 50].map(value => <option value={value} key={value}>{value}</option>)}</select></label>
      <div className="catalog-actions">
        <button className="catalog-button secondary" disabled={loading || page <= 1} onClick={() => changeQuery({ page: page - 1 })}>Previous</button>
        <button className="catalog-button secondary" disabled={loading || page >= pages} onClick={() => changeQuery({ page: page + 1 })}>Next</button>
      </div>
    </nav>}
  </div>
}
