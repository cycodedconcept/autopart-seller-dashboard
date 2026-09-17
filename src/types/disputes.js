import PropTypes from 'prop-types'
import { ApiErrorType, PaginationType } from './products'

const id = PropTypes.oneOfType([PropTypes.number, PropTypes.string])

export const DisputeType = PropTypes.shape({
  id: id.isRequired,
  orderId: id.isRequired,
  sellerId: id,
  raisedBy: PropTypes.string.isRequired,
  reason: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string,
  resolvedAt: PropTypes.string,
  closedAt: PropTypes.string,
})

export const DisputeAttachmentType = PropTypes.shape({
  id: id.isRequired,
  filename: PropTypes.string.isRequired,
  uploadedAt: PropTypes.string,
  url: PropTypes.string,
})

export const DisputeEvidenceType = PropTypes.shape({
  summary: PropTypes.string,
  attachments: PropTypes.arrayOf(DisputeAttachmentType).isRequired,
})

export const DisputeTimelineEventType = PropTypes.shape({
  id: id.isRequired,
  event: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  actor: PropTypes.shape({ id, type: PropTypes.string.isRequired }).isRequired,
  detail: PropTypes.object,
})

export const DisputeDetailType = PropTypes.shape({
  dispute: DisputeType.isRequired,
  evidence: PropTypes.shape({ buyer: DisputeEvidenceType.isRequired, seller: DisputeEvidenceType.isRequired }).isRequired,
  sla: PropTypes.shape({ deadlineAt: PropTypes.string, remainingMinutes: PropTypes.number, breached: PropTypes.bool.isRequired }).isRequired,
  timeline: PropTypes.arrayOf(DisputeTimelineEventType).isRequired,
  ruling: PropTypes.shape({
    id: id.isRequired,
    decision: PropTypes.string.isRequired,
    partialAmountKobo: PropTypes.number,
    requireReverseLogistics: PropTypes.bool,
    createdAt: PropTypes.string,
  }),
})

export const DisputeListResponseType = PropTypes.shape({
  disputes: PropTypes.arrayOf(DisputeType).isRequired,
  pagination: PaginationType.isRequired,
  filters: PropTypes.shape({ status: PropTypes.string, dateFrom: PropTypes.string, dateTo: PropTypes.string }),
})

export const DisputeErrorType = ApiErrorType
