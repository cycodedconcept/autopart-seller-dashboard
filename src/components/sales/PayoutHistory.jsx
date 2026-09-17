import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatNaira, koboToNaira } from '../../config/constant'
import { PAYOUT_STATUS_LABELS, formatPayoutDate } from '../../utils/sales'
import { ErrorNotice } from '../products/CatalogState'
import PayoutStatusBadge from './PayoutStatusBadge'
import SalesLoading from './SalesLoading'

export default function PayoutHistory({ status, page, limit, onQuery, onRetry }) {
  const { payouts, payoutPagination: pagination, payoutsLoading: loading, payoutsError: error } = useSelector(state => state.transactions)
  const totalPages = Math.max(1, pagination?.totalPages || 1)
  return <section aria-labelledby="payout-history-title">
    <div className="sales-section-heading"><div><h2 id="payout-history-title">Payout history</h2><p>Track payout requests across all dates.</p></div>
      <div className="catalog-field"><label htmlFor="payout-status">Payout status</label>
        <select id="payout-status" value={status} onChange={event => onQuery({ status: event.target.value, page: 1 })}>
          <option value="">All statuses</option>{Object.entries(PAYOUT_STATUS_LABELS).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select></div></div>
    {error ? <ErrorNotice message={error.message} onRetry={onRetry} /> : loading ? <SalesLoading label="Loading payout history" />
      : !payouts.length ? <div className="catalog-empty"><h3>{status ? 'No payouts with this status' : 'No payouts yet'}</h3><p>Your payout requests will appear here.</p></div>
        : <div className="catalog-table-wrap"><table className="catalog-table sales-payout-table">
          <caption className="sr-only">Seller payout history</caption>
          <thead><tr><th>Payout</th><th>Requested</th><th>Amount</th><th>Items</th><th>Bank reference</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{payouts.map(payout => <tr key={payout.id}>
            <td>#{payout.id}</td><td>{formatPayoutDate(payout.requestedAt || payout.createdAt)}</td>
            <td>{formatNaira(koboToNaira(payout.amountKobo))}</td><td>{payout.itemCount}</td>
            <td className="sales-bank-cell">{payout.bankAccountRef}</td><td><PayoutStatusBadge status={payout.status} /></td>
            <td><Link className="catalog-button secondary" to={'/sales/payouts/' + payout.id} aria-label={'View payout ' + payout.id}>Details</Link></td>
          </tr>)}</tbody>
        </table></div>}
    {!error && <nav aria-label="Payout pagination" className="catalog-pagination"><span>{pagination?.total ?? 0} payouts · Page {page} of {totalPages}</span>
      <label>Payouts per page <select value={limit} disabled={loading} onChange={event => onQuery({ limit: Number(event.target.value), page: 1 })}>
        {[10, 25, 50].map(value => <option value={value} key={value}>{value}</option>)}</select></label>
      <div className="catalog-actions"><button className="catalog-button secondary" disabled={loading || page <= 1} onClick={() => onQuery({ page: page - 1 })}>Previous</button>
        <button className="catalog-button secondary" disabled={loading || page >= totalPages} onClick={() => onQuery({ page: page + 1 })}>Next</button></div>
    </nav>}
  </section>
}
PayoutHistory.propTypes = { status: PropTypes.string.isRequired, page: PropTypes.number.isRequired, limit: PropTypes.number.isRequired, onQuery: PropTypes.func.isRequired, onRetry: PropTypes.func.isRequired }
