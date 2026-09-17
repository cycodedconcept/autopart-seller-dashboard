import PropTypes from 'prop-types'
import { PAYOUT_STATUS_LABELS } from '../../utils/sales'

export default function PayoutStatusBadge({ status }) {
  return <span className={'sales-payout-badge ' + (Object.hasOwn(PAYOUT_STATUS_LABELS, status) ? status : '')}>
    {PAYOUT_STATUS_LABELS[status] || 'Unknown'}
  </span>
}
PayoutStatusBadge.propTypes = { status: PropTypes.string.isRequired }
