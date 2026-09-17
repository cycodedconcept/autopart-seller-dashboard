import { SalesSummaryType } from '../../types/sales'
import { formatNaira, koboToNaira } from '../../config/constant'
import { formatSalesDay } from '../../utils/sales'

export default function SalesOverview({ summary }) {
  const { period, sales, payouts, commissionRatePercent } = summary
  return <>
    <section aria-labelledby="sales-summary-title">
      <div className="sales-section-heading"><div><h2 id="sales-summary-title">Sales summary</h2>
        <p>{formatSalesDay(period.dateFrom)} – {formatSalesDay(period.dateTo)}</p></div>
        <span className="sales-commission-rate">Commission rate: {commissionRatePercent}%</span></div>
      <div className="sales-total-grid">
        {[['Gross sales', sales.grossSalesKobo], ['Commission', sales.commissionKobo], ['Net sales', sales.netSalesKobo]].map(([label, amount]) =>
          <div className={'catalog-stat' + (label === 'Net sales' ? ' sales-net' : '')} key={label}><span>{label}</span><strong>{formatNaira(koboToNaira(amount))}</strong><small>Selected sales period</small></div>)}
      </div>
      <div className="sales-volume"><span>Paid orders <strong>{sales.totalOrders.toLocaleString()}</strong></span><span>Items sold <strong>{sales.totalItems.toLocaleString()}</strong></span></div>
      {sales.totalOrders === 0 && <p className="sales-empty-note">No paid sales in this period.</p>}
    </section>
    <section aria-labelledby="payout-balances-title">
      <div className="sales-section-heading"><div><h2 id="payout-balances-title">Payout balances</h2><p>Across all dates. These balances do not change with the sales date filter.</p></div></div>
      <div className="sales-balance-grid">
        {[
          ['Available for payout', payouts.pendingKobo, 'Eligible completed sales'],
          ['Requested', payouts.requestedKobo, 'Awaiting review'],
          ['Approved', payouts.approvedKobo, 'Awaiting settlement'],
          ['Paid', payouts.paidKobo, 'Settled payouts'],
        ].map(([label, amount, description]) => <div className="catalog-stat" key={label}><span>{label}</span><strong>{formatNaira(koboToNaira(amount))}</strong><small>{description}</small></div>)}
      </div>
    </section>
  </>
}
SalesOverview.propTypes = { summary: SalesSummaryType.isRequired }
