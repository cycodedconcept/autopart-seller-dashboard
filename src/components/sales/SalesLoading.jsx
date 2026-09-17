import PropTypes from 'prop-types'

export default function SalesLoading({ label }) {
  return <div role="status" aria-label={label} className="catalog-skeletons">
    <span className="sr-only">{label}…</span>
    {[0, 1, 2].map(row => <div className="catalog-skeleton-row" key={row} />)}
  </div>
}
SalesLoading.propTypes = { label: PropTypes.string.isRequired }
