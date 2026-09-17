import PropTypes from 'prop-types'
import { DISPUTE_STATUS_LABELS } from '../../utils/disputes'

const COLORS = {
  open: { background: '#fff4e8', color: '#9c3c00' },
  in_review: { background: '#eff8ff', color: '#175cd3' },
  escalated: { background: '#f4f3ff', color: '#5925dc' },
  resolved: { background: '#ecfdf3', color: '#067647' },
  rejected: { background: '#fef3f2', color: '#b42318' },
  closed: { background: '#f2f4f7', color: '#344054' },
}

export default function DisputeStatusBadge({ status }) {
  const colors = COLORS[status] || COLORS.closed
  return <span className="dispute-status" style={colors}>
    {DISPUTE_STATUS_LABELS[status] || status?.replaceAll('_', ' ') || 'Unknown'}
  </span>
}
DisputeStatusBadge.propTypes = { status: PropTypes.string }
