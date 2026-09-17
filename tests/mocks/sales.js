export const salesSummary = {
  period: { dateFrom: '2026-08-13', dateTo: '2026-09-11' }, commissionRatePercent: 12,
  sales: { totalOrders: 24, totalItems: 39, grossSalesKobo: 12500003, commissionKobo: 1500000, netSalesKobo: 11000003 },
  payouts: { pendingKobo: 8100001, requestedKobo: 2700002, approvedKobo: 1800003, paidKobo: 9000004 },
}
export const payout = {
  id: 77, grossAmountKobo: 9200001, commissionAmountKobo: 1100000, amountKobo: 8100001,
  status: 'requested', bankAccountRef: 'BANK-TEST123', itemCount: 3,
  requestedAt: '2026-09-11T10:00:00.000Z', approvedAt: null, settledAt: null,
  rejectionReason: null, createdAt: '2026-09-11T10:00:00.000Z', updatedAt: '2026-09-11T10:00:00.000Z',
}
export const payoutRows = [
  payout,
  { ...payout, id: 76, status: 'approved', amountKobo: 1800003, approvedAt: '2026-09-11T11:00:00.000Z' },
  { ...payout, id: 75, status: 'paid', amountKobo: 9000004, settledAt: '2026-09-11T12:00:00.000Z' },
  { ...payout, id: 74, status: 'rejected', amountKobo: 990001, rejectionReason: 'Check the bank account reference.' },
]
export const payoutPagination = { page: 1, limit: 10, total: 4, totalPages: 1 }
