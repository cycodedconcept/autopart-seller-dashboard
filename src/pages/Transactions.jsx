import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { fetchSales, fetchPayouts, refreshSalesAndPayouts } from '../features/transactionSlice'
import { PAYOUT_STATUS_LABELS } from '../utils/sales'
import { ErrorNotice } from '../components/products/CatalogState'
import SalesDateFilter from '../components/sales/SalesDateFilter'
import SalesOverview from '../components/sales/SalesOverview'
import SalesLoading from '../components/sales/SalesLoading'
import PayoutRequestForm from '../components/sales/PayoutRequestForm'
import PayoutHistory from '../components/sales/PayoutHistory'
import '../styles/sales.css'

export default function Transactions() {
  const dispatch = useDispatch()
  const [params, setParams] = useSearchParams()
  const [dateFormVersion, setDateFormVersion] = useState(0)
  const { sales, salesLoading, salesError, payoutsLoading, payoutsError, payoutPagination, requestingPayout } = useSelector(state => state.transactions)
  const dateFrom = params.get('dateFrom') || ''
  const dateTo = params.get('dateTo') || ''
  const status = Object.hasOwn(PAYOUT_STATUS_LABELS, params.get('status')) ? params.get('status') : ''
  const requestedPage = Number(params.get('page') || 1)
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const limit = [10, 25, 50].includes(Number(params.get('limit'))) ? Number(params.get('limit')) : 10

  useEffect(() => {
    const request = dispatch(fetchSales(dateFrom || dateTo ? { dateFrom, dateTo } : {}))
    return () => request.abort()
  }, [dispatch, dateFrom, dateTo])
  useEffect(() => {
    const request = dispatch(fetchPayouts({ status, page, limit }))
    return () => request.abort()
  }, [dispatch, status, page, limit])
  useEffect(() => {
    if (!payoutsLoading && !payoutsError && payoutPagination?.page === page && page > Math.max(1, payoutPagination.totalPages)) {
      setParams(previous => {
        const next = new URLSearchParams(previous)
        next.set('page', String(Math.max(1, payoutPagination.totalPages)))
        return next
      }, { replace: true })
    }
  }, [payoutsLoading, payoutsError, payoutPagination, page, setParams])

  const applyDates = range => {
    setParams(previous => {
      const next = new URLSearchParams(previous)
      for (const field of ['dateFrom', 'dateTo']) {
        if (range[field]) next.set(field, range[field]); else next.delete(field)
      }
      return next
    })
    setDateFormVersion(version => version + 1)
    if ((range.dateFrom || '') === dateFrom && (range.dateTo || '') === dateTo) dispatch(fetchSales(range))
  }
  const changePayoutQuery = change => {
    const query = { status, page, limit, ...change }
    setParams(previous => {
      const next = new URLSearchParams(previous)
      if (query.status) next.set('status', query.status); else next.delete('status')
      next.set('page', String(query.page)); next.set('limit', String(query.limit))
      return next
    })
  }
  const formFrom = dateFrom || sales?.period.dateFrom || ''
  const formTo = dateTo || sales?.period.dateTo || ''
  return <div className="catalog-page seller-sales">
    <header className="catalog-header"><div><h1>Sales &amp; payouts</h1><p>Review your sales, commission and payout requests.</p></div>
      <button className="catalog-button secondary" disabled={salesLoading || payoutsLoading || requestingPayout} onClick={() => dispatch(refreshSalesAndPayouts())}><RefreshCw size={16} />Refresh</button></header>
    <SalesDateFilter key={[formFrom, formTo, dateFormVersion].join(':')} dateFrom={formFrom} dateTo={formTo} busy={salesLoading || requestingPayout} onApply={applyDates} />
    {salesError ? <ErrorNotice message={salesError.message} onRetry={() => dispatch(fetchSales(dateFrom || dateTo ? { dateFrom, dateTo } : {}))} />
      : salesLoading ? <SalesLoading label="Loading sales summary" />
        : sales ? <SalesOverview summary={sales} /> : null}
    <PayoutRequestForm />
    <PayoutHistory status={status} page={page} limit={limit} onQuery={changePayoutQuery} onRetry={() => dispatch(fetchPayouts({ status, page, limit }))} />
  </div>
}
