import PropTypes from 'prop-types'
import { PaginationType } from './products'

export const SalesPeriodType = PropTypes.shape({ dateFrom: PropTypes.string.isRequired, dateTo: PropTypes.string.isRequired })
export const SalesTotalsType = PropTypes.shape({
  totalOrders: PropTypes.number.isRequired, totalItems: PropTypes.number.isRequired,
  grossSalesKobo: PropTypes.number.isRequired, commissionKobo: PropTypes.number.isRequired, netSalesKobo: PropTypes.number.isRequired,
})
export const PayoutBalancesType = PropTypes.shape({
  pendingKobo: PropTypes.number.isRequired, requestedKobo: PropTypes.number.isRequired,
  approvedKobo: PropTypes.number.isRequired, paidKobo: PropTypes.number.isRequired,
})
export const SalesSummaryType = PropTypes.shape({
  period: SalesPeriodType.isRequired, commissionRatePercent: PropTypes.number.isRequired,
  sales: SalesTotalsType.isRequired, payouts: PayoutBalancesType.isRequired,
})
export const PayoutType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  grossAmountKobo: PropTypes.number.isRequired, commissionAmountKobo: PropTypes.number.isRequired,
  amountKobo: PropTypes.number.isRequired, status: PropTypes.string.isRequired, bankAccountRef: PropTypes.string.isRequired,
  itemCount: PropTypes.number.isRequired, requestedAt: PropTypes.string, approvedAt: PropTypes.string,
  rejectionReason: PropTypes.string, settledAt: PropTypes.string, createdAt: PropTypes.string, updatedAt: PropTypes.string,
})
export const PayoutListType = PropTypes.shape({ payouts: PropTypes.arrayOf(PayoutType).isRequired, pagination: PaginationType.isRequired })
