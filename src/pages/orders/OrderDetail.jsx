import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, Printer } from 'lucide-react'
import { fetchOrder } from '../../features/orderSlice'
import { formatNaira, koboToNaira } from '../../config/constant'
import { formatOrderDate, orderAddress } from '../../utils/orders'
import ProductImage from '../../components/products/ProductImage'
import { ErrorNotice } from '../../components/products/CatalogState'
import OrderStatusBadge from '../../components/orders/OrderStatusBadge'
import OrderLoading from '../../components/orders/OrderLoading'
import OrderItemActions from '../../components/orders/OrderItemActions'
import '../../styles/orders.css'

export default function OrderDetail() {
  const { id } = useParams()
  const { hash } = useLocation()
  const dispatch = useDispatch()
  const { detail: order, detailLoading, detailError, query } = useSelector(state => state.orders)
  useEffect(() => {
    const request = dispatch(fetchOrder(id))
    return () => request.abort()
  }, [dispatch, id])
  useEffect(() => {
    if (order && hash) document.getElementById(hash.slice(1))?.scrollIntoView?.({ block: 'start' })
  }, [hash, order])
  const backToOrders = '/orders?' + new URLSearchParams({
    ...(query.itemStatus ? { itemStatus: query.itemStatus } : {}), page: String(query.page), limit: String(query.limit),
  })
  return <div className="catalog-page seller-orders">
    <Link className="order-back" to={backToOrders}><ArrowLeft size={16} />Back to orders</Link>
    {detailLoading ? <OrderLoading detail />
      : detailError ? <ErrorNotice message={detailError.message} onRetry={() => dispatch(fetchOrder(id))} />
        : !order ? <div className="catalog-empty"><h1>Order not found</h1><p>This order is not available in your seller account.</p></div>
          : <>
            <header className="catalog-header">
              <div><h1>Order #{order.id}</h1><p>Placed {formatOrderDate(order.createdAt)} · {order.items.length} seller line {order.items.length === 1 ? 'item' : 'items'}</p></div>
              <button className="catalog-button secondary order-print" onClick={() => window.print()}><Printer size={16} />Print order</button>
            </header>
            <div className="order-detail-grid">
              <section aria-label="Order items">
                {!order.items.length && <div className="catalog-empty"><h2>No items available</h2><p>This order currently has no items for your shop.</p></div>}
                {order.items.map(item => <article id={'item-' + item.id} aria-label={item.title} className="catalog-panel" key={item.id}>
                  <div className="order-item-heading">
                    <div className="order-product"><ProductImage src={item.primaryImageUrl} alt={item.title} />
                      <div><h2>{item.title}</h2><p className="catalog-muted">{item.partNumber || 'No part number'} · Item #{item.id}</p>
                        <p className="catalog-muted">{[item.condition, item.location].filter(Boolean).join(' · ')}</p></div>
                    </div>
                    <OrderStatusBadge status={item.itemStatus} />
                  </div>
                  <dl className="order-item-facts">
                    <div><dt>Quantity</dt><dd>{item.quantity}</dd></div>
                    <div><dt>Unit price</dt><dd>{formatNaira(koboToNaira(item.unitPriceKobo))}</dd></div>
                    <div><dt>Item total</dt><dd>{formatNaira(koboToNaira(item.lineTotalKobo))}</dd></div>
                  </dl>
                  <OrderItemActions order={order} item={item} />
                  {item.updatedAt && <div className="order-updated">Status updated {formatOrderDate(item.updatedAt)}</div>}
                </article>)}
              </section>
              <aside>
                <section className="catalog-panel" aria-labelledby="order-payment-title">
                  <h2 id="order-payment-title">Payment</h2>
                  <dl className="order-facts">
                    <div><dt>Status</dt><dd>{order.paymentStatus?.replaceAll('_', ' ') || 'Not provided'}</dd></div>
                    <div><dt>Method</dt><dd>{order.paymentMethod?.replaceAll('_', ' ') || 'Not provided'}</dd></div>
                    <div><dt>Your items total</dt><dd>{formatNaira(koboToNaira(order.sellerTotalKobo ?? order.items.reduce((total, item) => total + item.lineTotalKobo, 0)))}</dd></div>
                    {order.paymentReference && <div><dt>Reference</dt><dd>{order.paymentReference}</dd></div>}
                  </dl>
                </section>
                <section className="catalog-panel" aria-labelledby="order-delivery-title">
                  <h2 id="order-delivery-title">Delivery address</h2>
                  {order.deliveryAddress?.label && <p><strong>{order.deliveryAddress.label}</strong></p>}
                  <p>{orderAddress(order.deliveryAddress)}</p>
                  <p>{order.deliveryAddress?.phone || 'Phone not provided'}</p>
                </section>
                <section className="catalog-panel">
                  <h2>Prepare for pickup</h2>
                  <p>Check and pack each paid, pending item, then mark it <strong>Ready for Pickup</strong>.</p>
                  <p>The courier will handle pickup and delivery updates.</p>
                </section>
              </aside>
            </div>
          </>}
  </div>
}
