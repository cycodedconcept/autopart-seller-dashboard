import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import { Download, PackageCheck } from 'lucide-react'
import { fetchOrders } from '../../features/orderSlice'
import { formatNaira, koboToNaira, ITEM_STATUS_LABELS } from '../../config/constant'
import { SELLER_ITEM_STATUSES, formatOrderDate, orderCsvCell } from '../../utils/orders'
import ProductImage from '../../components/products/ProductImage'
import { ErrorNotice } from '../../components/products/CatalogState'
import OrderStatusBadge from '../../components/orders/OrderStatusBadge'
import OrderLoading from '../../components/orders/OrderLoading'
import '../../styles/orders.css'

export default function Orders() {
  const dispatch = useDispatch()
  const { list, loading, error, pagination } = useSelector(state => state.orders)
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const requestedPage = Number(params.get('page') || 1)
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const limit = [10, 25, 50].includes(Number(params.get('limit'))) ? Number(params.get('limit')) : 10
  const itemStatus = SELLER_ITEM_STATUSES.includes(params.get('itemStatus')) ? params.get('itemStatus') : ''

  useEffect(() => {
    const request = dispatch(fetchOrders({ itemStatus, page, limit }))
    return () => request.abort()
  }, [dispatch, itemStatus, page, limit])

  // A status change elsewhere can remove the last matching order from a page.
  useEffect(() => {
    if (!loading && !error && pagination?.page === page && page > Math.max(1, pagination.totalPages)) {
      setParams({ ...(itemStatus ? { itemStatus } : {}), page: String(Math.max(1, pagination.totalPages)), limit: String(limit) }, { replace: true })
    }
  }, [loading, error, pagination, page, itemStatus, limit, setParams])

  const changeQuery = change => {
    setSearch('')
    const next = { itemStatus, page, limit, ...change }
    setParams({ ...(next.itemStatus ? { itemStatus: next.itemStatus } : {}), page: String(next.page), limit: String(next.limit) })
  }
  const needle = search.trim().toLowerCase()
  const visible = list.map(order => ({
    ...order,
    items: order.items.filter(item => !needle || [order.id, item.id, item.title, item.partNumber].some(value => String(value ?? '').toLowerCase().includes(needle))),
  })).filter(order => order.items.length)
  const items = list.flatMap(order => order.items)
  const totalPages = Math.max(1, pagination?.totalPages || 1)
  const stats = [
    [itemStatus ? 'Matching orders' : 'Total orders', pagination?.total || 0, 'Across all pages'],
    ['Pending items', items.filter(item => item.itemStatus === 'pending').length, 'On this page'],
    ['Ready for Pickup', items.filter(item => item.itemStatus === 'ready_for_pickup').length, 'Items on this page'],
    ['Picked up / delivered', items.filter(item => ['picked_up', 'delivered'].includes(item.itemStatus)).length, 'Items on this page'],
  ]
  const exportPage = () => {
    const rows = [['Order ID', 'Item ID', 'Part number', 'Product', 'Quantity', 'Amount (NGN)', 'Item status', 'Payment status', 'Order date']]
    visible.forEach(order => order.items.forEach(item => rows.push([
      order.id, item.id, item.partNumber, item.title, item.quantity, koboToNaira(item.lineTotalKobo),
      ITEM_STATUS_LABELS[item.itemStatus] || item.itemStatus, order.paymentStatus, formatOrderDate(order.createdAt),
    ])))
    const csv = rows.map(row => row.map(orderCsvCell).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url; link.download = 'orders-page-' + page + '.csv'; link.click()
    URL.revokeObjectURL(url)
  }

  return <div className="catalog-page seller-orders">
    <header className="catalog-header">
      <div><h1>Orders</h1><p>Prepare your paid order items and mark them ready for courier pickup.</p></div>
      <button className="catalog-button secondary" disabled={loading || !!error || !visible.length} onClick={exportPage}><Download size={16} />Export this page</button>
    </header>
    <section aria-label="Order summary" className="seller-order-stats">
      {stats.map(([label, count, scope]) => <div className="catalog-stat" key={label}><span>{label}</span><strong>{loading || error ? '—' : count.toLocaleString()}</strong><small>{scope}</small></div>)}
    </section>
    <div className="order-toolbar">
      <div className="catalog-field"><label htmlFor="order-status">Item status</label>
        <select id="order-status" value={itemStatus} onChange={event => changeQuery({ itemStatus: event.target.value, page: 1 })}>
          <option value="">All statuses</option>
          {SELLER_ITEM_STATUSES.map(status => <option value={status} key={status}>{ITEM_STATUS_LABELS[status]}</option>)}
        </select>
      </div>
      <div className="catalog-field order-search"><label htmlFor="order-search">Search this page</label>
        <input id="order-search" placeholder="Order, item or part number" value={search} onChange={event => setSearch(event.target.value)} />
      </div>
    </div>
    {error ? <ErrorNotice message={error.message} onRetry={() => dispatch(fetchOrders({ itemStatus, page, limit }))} />
      : loading ? <OrderLoading />
        : !visible.length ? <div className="catalog-empty"><PackageCheck size={36} aria-hidden="true" />
          <h2>{search ? 'No matches on this page' : itemStatus ? 'No orders with this item status' : 'No orders yet'}</h2>
          <p>{search ? 'Try another order ID, product title or part number.' : 'Your seller orders will appear here when customers place them.'}</p>
          {(search || itemStatus) && <button className="catalog-button secondary" onClick={() => { setSearch(''); changeQuery({ itemStatus: '', page: 1 }) }}>Clear filters</button>}
        </div>
          : <div className="catalog-table-wrap"><table className="catalog-table order-table">
            <caption className="sr-only">Seller order items, grouped by order</caption>
            <thead><tr><th>Product</th><th>Quantity</th><th>Item total</th><th>Item status</th><th>Action</th></tr></thead>
            <tbody>{visible.map(order => <Fragment key={order.id}>
              <tr className="order-parent"><td colSpan={5}><div className="order-parent-summary">
                <Link to={'/orders/' + order.id}>Order #{order.id}</Link>
                <span>{formatOrderDate(order.createdAt)}</span>
                <span>Payment: {order.paymentStatus?.replaceAll('_', ' ') || 'Not provided'}</span>
                <span>{order.deliveryAddress?.city || 'Delivery address not provided'}</span>
              </div></td></tr>
              {order.items.map(item => <tr key={item.id}>
                <td><div className="order-product"><ProductImage src={item.primaryImageUrl} alt={item.title} />
                  <div><strong>{item.title}</strong><small>{item.partNumber || 'No part number'} · Item #{item.id}</small></div>
                </div></td>
                <td>{item.quantity}</td><td>{formatNaira(koboToNaira(item.lineTotalKobo))}</td>
                <td><OrderStatusBadge status={item.itemStatus} /></td>
                <td><Link className="catalog-button secondary" to={'/orders/' + order.id + '#item-' + item.id} aria-label={'Manage ' + item.title}>Manage item</Link></td>
              </tr>)}
            </Fragment>)}</tbody>
          </table></div>}
    {!error && <nav aria-label="Order pagination" className="catalog-pagination">
      <span>{pagination?.total ?? 0} orders · Page {page} of {totalPages}</span>
      <label>Orders per page <select value={limit} disabled={loading} onChange={event => changeQuery({ limit: Number(event.target.value), page: 1 })}>
        {[10, 25, 50].map(value => <option value={value} key={value}>{value}</option>)}
      </select></label>
      <div className="catalog-actions">
        <button className="catalog-button secondary" disabled={loading || page <= 1} onClick={() => changeQuery({ page: page - 1 })}>Previous</button>
        <button className="catalog-button secondary" disabled={loading || page >= totalPages} onClick={() => changeQuery({ page: page + 1 })}>Next</button>
      </div>
    </nav>}
  </div>
}
