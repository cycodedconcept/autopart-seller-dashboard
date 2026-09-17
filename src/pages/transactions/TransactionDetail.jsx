import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, Printer, Download } from 'lucide-react'
import { fetchPayoutDetail } from '../../features/transactionSlice'
import { formatNaira, koboToNaira } from '../../config/constant'
import { formatPayoutDate } from '../../utils/sales'
import { ErrorNotice } from '../../components/products/CatalogState'
import PayoutStatusBadge from '../../components/sales/PayoutStatusBadge'
import SalesLoading from '../../components/sales/SalesLoading'
import '../../styles/sales.css'

export default function TransactionDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { payoutDetail: payout, detailLoading, detailError, salesQuery, payoutQuery } = useSelector(state => state.transactions)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState('')
  const content = useRef(null)
  useEffect(() => {
    const request = dispatch(fetchPayoutDetail(id))
    return () => request.abort()
  }, [dispatch, id])
  const download = async () => {
    setExporting(true); setExportError('')
    try {
      const { default: html2pdf } = await import('html2pdf.js')
      await html2pdf().set({ margin: 0.5, filename: 'payout-' + payout.id + '.pdf', html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } }).from(content.current).save()
    } catch {
      setExportError('Could not export the payout details. Please try again.')
    } finally { setExporting(false) }
  }
  const backQuery = new URLSearchParams({
    ...(salesQuery.dateFrom ? { dateFrom: salesQuery.dateFrom, dateTo: salesQuery.dateTo } : {}),
    ...(payoutQuery.status ? { status: payoutQuery.status } : {}),
    page: String(payoutQuery.page), limit: String(payoutQuery.limit),
  })
  return <div className="catalog-page seller-sales">
    <Link className="sales-back" to={'/sales?' + backQuery}><ArrowLeft size={16} />Back to sales &amp; payouts</Link>
    {detailLoading ? <SalesLoading label="Loading payout details" /> : detailError ? <ErrorNotice message={detailError.message} onRetry={() => dispatch(fetchPayoutDetail(id))} />
      : !payout ? <div className="catalog-empty"><h1>Payout not found</h1><p>This payout is not available in your seller account.</p></div>
        : <>
          <header className="catalog-header"><div><h1>Payout #{payout.id}</h1><p>Details of your payout request.</p></div>
            <div className="catalog-actions sales-detail-controls"><button className="catalog-button secondary" onClick={() => window.print()}><Printer size={16} />Print</button>
              <button className="catalog-button secondary" disabled={exporting} onClick={download}><Download size={16} />{exporting ? 'Exporting…' : 'Download PDF'}</button></div></header>
          {exportError && <ErrorNotice message={exportError} />}
          <article className="catalog-panel sales-detail-card" aria-label="Payout details" ref={content}>
            <div className="sales-detail-top"><h2>Payout #{payout.id}</h2><PayoutStatusBadge status={payout.status} /></div>
            <div className="sales-detail-amount">{formatNaira(koboToNaira(payout.amountKobo))}</div>
            <p className="catalog-muted">{payout.status === 'paid' ? 'Paid payout' : 'Payout request amount'}</p>
            {payout.status === 'approved' && <p className="catalog-muted">Approved and awaiting settlement.</p>}
            {payout.status === 'rejected' && <p className="catalog-muted">{payout.rejectionReason || 'This payout request was rejected. No reason was provided.'}</p>}
            <dl className="sales-detail-facts">
              <div><dt>Gross amount</dt><dd>{formatNaira(koboToNaira(payout.grossAmountKobo))}</dd></div>
              <div><dt>Commission</dt><dd>{formatNaira(koboToNaira(payout.commissionAmountKobo))}</dd></div>
              <div><dt>Net payout amount</dt><dd>{formatNaira(koboToNaira(payout.amountKobo))}</dd></div>
              <div><dt>Items included</dt><dd>{payout.itemCount}</dd></div>
              <div><dt>Bank account reference</dt><dd>{payout.bankAccountRef}</dd></div>
              <div><dt>Requested</dt><dd>{formatPayoutDate(payout.requestedAt || payout.createdAt)}</dd></div>
              {payout.approvedAt && <div><dt>Approved</dt><dd>{formatPayoutDate(payout.approvedAt)}</dd></div>}
              <div><dt>Settled</dt><dd>{payout.settledAt ? formatPayoutDate(payout.settledAt) : payout.status === 'paid' ? 'Settlement date not provided' : 'Not settled'}</dd></div>
              <div><dt>Last updated</dt><dd>{formatPayoutDate(payout.updatedAt)}</dd></div>
            </dl>
          </article>
        </>}
  </div>
}
