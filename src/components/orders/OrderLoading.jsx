import PropTypes from 'prop-types'

export default function OrderLoading({ detail = false }) {
  const label = detail ? 'Loading order details' : 'Loading orders'
  return <div role="status" aria-label={label} className="catalog-skeletons">
    <span className="sr-only">{label}…</span>
    {[0, 1, 2, 3].map(row => <div key={row} className="catalog-skeleton-row" />)}
  </div>
}
OrderLoading.propTypes = { detail: PropTypes.bool }
