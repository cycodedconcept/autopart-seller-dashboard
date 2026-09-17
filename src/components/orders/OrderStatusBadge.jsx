import PropTypes from 'prop-types'
import { ITEM_STATUS_COLORS, ITEM_STATUS_LABELS } from '../../config/constant'

export default function OrderStatusBadge({ status }) {
  const colors = ITEM_STATUS_COLORS[status] || { bg: '#F2F4F7', fg: '#344054' }
  return <span className="order-item-badge" style={{ background: colors.bg, color: colors.fg }}>
    {ITEM_STATUS_LABELS[status] || status?.replaceAll('_', ' ') || 'Unknown'}
  </span>
}
OrderStatusBadge.propTypes = { status: PropTypes.string }
