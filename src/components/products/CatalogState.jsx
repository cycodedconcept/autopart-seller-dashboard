import PropTypes from 'prop-types'
import { PaginationType } from '../../types/products'

export function ErrorNotice({ message, onRetry }) {
  return <div className="catalog-error" role="alert"><span>{message}</span>
    {onRetry && <button type="button" className="catalog-button secondary" onClick={onRetry}>Retry</button>}
  </div>
}
ErrorNotice.propTypes = { message: PropTypes.string.isRequired, onRetry: PropTypes.func }

export function LoadingRows() {
  return <div role="status" aria-label="Loading products" className="catalog-skeletons">
    <span className="sr-only">Loading products…</span>
    {[0, 1, 2, 3].map(row => <div key={row} className="catalog-skeleton-row" />)}
  </div>
}

export function Pagination({ pagination, page, limit, busy, onPage, onLimit }) {
  const pages = Math.max(1, pagination?.totalPages || 1)
  return <div className="catalog-pagination">
    <span>{pagination?.total ?? 0} listings · Page {page} of {pages}</span>
    <label>Rows per page <select value={limit} onChange={event => onLimit(Number(event.target.value))} disabled={busy}>
      {[10, 25, 50].map(value => <option key={value} value={value}>{value}</option>)}
    </select></label>
    <div className="catalog-actions">
      <button className="catalog-button secondary" disabled={busy || page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
      <button className="catalog-button secondary" disabled={busy || page >= pages} onClick={() => onPage(page + 1)}>Next</button>
    </div>
  </div>
}
Pagination.propTypes = { pagination: PaginationType, page: PropTypes.number.isRequired, limit: PropTypes.number.isRequired, busy: PropTypes.bool, onPage: PropTypes.func.isRequired, onLimit: PropTypes.func.isRequired }
