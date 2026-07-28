import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { updateOrderStatus } from '../../features/orderSlice'
import { ArrowLeft, Printer, ChevronDown, Check, Clock, Package, Truck, CreditCard, MapPin, Phone, X } from 'lucide-react'

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const order = useSelector(s => s.orders.list.find(o => o.id === id))

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <div className="page-title">Order not found</div>
        <button onClick={() => navigate('/orders')} className="btn btn-primary mt-20">Back to Orders</button>
      </div>
    )
  }

  const handleStatusChange = (newStatus) => {
    if (window.confirm(`Update order status to ${newStatus}?`)) {
      dispatch(updateOrderStatus({ orderId: order.id, status: newStatus }))
    }
    setShowStatusDropdown(false)
  }

  const getStatusBadgeClass = (s) => {
    switch (s) {
      case 'Delivered': return 'detail-status-badge detail-status-delivered'
      case 'Cancelled': return 'detail-status-badge detail-status-cancelled'
      case 'Processing': return 'detail-status-badge detail-status-processing'
      case 'Shipped': return 'detail-status-badge detail-status-shipped'
      case 'Pending': return 'detail-status-badge detail-status-pending'
      default: return 'detail-status-badge'
    }
  }

  const getTimelineIcon = (status) => {
    switch (status) {
      case 'Order Placed': return <Clock size={16} />
      case 'Processing': return <Clock size={16} />
      case 'Shipped': return <Truck size={16} />
      case 'Delivered': return <Check size={16} />
      case 'Cancelled': return <X size={16} />
      default: return <Clock size={16} />
    }
  }

  const timelineData = order.timeline || [
    { status: 'Order Placed', date: order.purchaseDate || order.orderDate || 'N/A', completed: true },
    { status: 'Processing', date: 'Pending', completed: order.status !== 'Pending' },
    { status: 'Shipped', date: 'Pending', completed: ['Shipped', 'Delivered'].includes(order.status) },
    { status: 'Delivered', date: 'Pending', completed: order.status === 'Delivered' },
  ]

  const getTimelineItemState = (item) => {
    if (order.status === 'Cancelled') {
      if (item.completed && item.status !== 'Cancelled') return 'completed'
      if (item.status === 'Cancelled') return 'cancelled'
      return ''
    }
    const statusMap = {
      'Pending': 'Order Placed',
      'Processing': 'Processing',
      'Shipped': 'Shipped',
      'Delivered': 'Delivered',
    }
    const activeStatus = statusMap[order.status]
    if (item.status === activeStatus) return 'active'
    if (item.completed) return 'completed'
    return ''
  }

  const paymentStatus =
    ({
      Delivered: 'Paid',
      Shipped: 'Paid',
      Processing: 'Pending',
      Pending: 'Unpaid',
      Cancelled: 'Refunded',
    }[order.status]) || 'Unknown'

  const subtotal = order.subtotal || 0
  const shippingCost = order.shippingCost || 0
  const tax = order.tax || 0
  const discount = order.discount || 0

  return (
    <div className="order-detail-page">

      {/* ===== Header Card — Figma: 16px padding, title + breadcrumb left, Print + Update Status right ===== */}
      <div style={{
        background: '#FFFFFF', border: '0.8px solid #F0F0F0',
        boxShadow: '0px 1px 2px rgba(82,88,102,0.06)', borderRadius: '12px',
        padding: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left: title + breadcrumb */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0E0E0C', margin: 0, lineHeight: '27px' }}>
              Order Details
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                <ArrowLeft size={13} color="#A7A9AA" />
                <span style={{ fontSize: '16px', fontWeight: 400, color: '#A7A9AA' }}>Orders</span>
              </Link>
              <ChevronDown size={13} color="#A7A9AA" style={{ transform: 'rotate(-90deg)' }} />
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#FF7101' }}>#{order.id}</span>
            </div>
          </div>
          {/* Right: Print + Update Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 12px', borderRadius: '8px',
              border: '0.8px solid #F0F0F0', background: '#FFFFFF',
              fontSize: '13px', fontWeight: 500, color: '#5F5F5F',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <Printer size={14} color="#5F5F5F" />
              Print
            </button>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 12px', borderRadius: '8px',
                  border: 'none', background: '#FF7101',
                  fontSize: '13px', fontWeight: 500, color: '#FFFFFF',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <ChevronDown size={14} color="#FFFFFF" />
                Update Status
              </button>
              {showStatusDropdown && (
                <div className="status-dropdown-menu">
                  {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                    <button
                      key={s}
                      className={`status-dropdown-item ${order.status === s ? 'active' : ''}`}
                      onClick={() => handleStatusChange(s)}
                    >
                      {order.status === s
                        ? <Check size={16} style={{ color: 'var(--brand)' }} />
                        : <span style={{ width: 16, display: 'inline-block' }} />
                      }
                      <span>Mark as {s}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="detail-content" style={{ gridTemplateColumns: '270px 1fr' }}>
        {/* ----- Left Column ----- */}
        <div className="detail-left">
          {/* Order Status Card */}
          <div className="detail-card">
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0E0E0C', marginBottom: '12px' }}>Order Status</div>

            {/* Current status badge */}
            <div style={{ marginBottom: '16px' }}>
              {(() => {
                const badgeCfg = {
                  Delivered:  { bg: '#E9FAEE', color: '#24D059' },
                  Shipped:    { bg: '#EFF6FF', color: '#2563EB' },
                  Processing: { bg: '#FEF3C7', color: '#D97706' },
                  Pending:    { bg: '#F8FAFC', color: '#64748B' },
                  Cancelled:  { bg: '#FEE2E2', color: '#DC2626' },
                }
                const cfg = badgeCfg[order.status] || { bg: '#F0F0F0', color: '#5F5F5F' }
                return (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '6px',
                    background: cfg.bg,
                  }}>
                    <Check size={14} color={cfg.color} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: cfg.color }}>
                      {order.status}
                    </span>
                  </div>
                )
              })()}
            </div>

            {/* Step list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {timelineData.map((item, i) => {
                const state = getTimelineItemState(item)
                const isCompleted = state === 'completed'
                const isActive    = state === 'active'
                const isCancelled = state === 'cancelled'

                /* dot appearance */
                const dotBg     = (isCompleted || isCancelled) ? '#FF7101' : 'transparent'
                const dotBorder = '#FF7101'
                const dotColor  = isActive ? '#FF7101' : '#FFFFFF'
                const labelColor = isActive ? '#FF7101' : '#0E0E0C'

                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Circle dot */}
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: dotBg,
                      border: `1.6px solid ${dotBorder}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {(isCompleted || isCancelled) ? (
                        <Check size={12} color="#FFFFFF" strokeWidth={2.5} />
                      ) : (
                        <span style={{ fontSize: '11px', fontWeight: 400, color: dotColor, lineHeight: 1 }}>
                          {i + 1}
                        </span>
                      )}
                    </div>
                    {/* Label */}
                    <span style={{ fontSize: '12px', fontWeight: 500, color: labelColor, lineHeight: '18px' }}>
                      {item.status}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Customer Card */}
          <div className="detail-card" style={{ borderRadius: '12px', border: '0.8px solid #F0F0F0', boxShadow: '0px 1px 2px rgba(82,88,102,0.06)', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0E0E0C' }}>Customer</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0 8px' }}>
              <img
                src={order.avatar}
                alt={order.customerName}
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#0E0E0C', lineHeight: '20px' }}>
                  {order.customerName}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 400, color: '#5F5F5F', lineHeight: '16px' }}>
                  ID: {order.id}
                </span>
              </div>
            </div>
            {(order.email || order.phone) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', paddingTop: '8px', borderTop: '0.8px solid #F0F0F0' }}>
                {order.email && (
                  <span style={{ fontSize: '11px', fontWeight: 400, color: '#5F5F5F', lineHeight: '16px', wordBreak: 'break-all' }}>
                    {order.email}
                  </span>
                )}
                {order.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Phone size={11} color="#5F5F5F" />
                    <span style={{ fontSize: '11px', fontWeight: 400, color: '#5F5F5F', lineHeight: '16px' }}>
                      {order.phone}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Card */}
          <div className="detail-card">
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0E0E0C' }}>Payment</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px' }}>

              {/* Method */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 400, color: '#5F5F5F' }}>Method</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CreditCard size={12} color="#0E0E0C" />
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#0E0E0C' }}>{order.paymentMethod}</span>
                </div>
              </div>

              {/* Date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 400, color: '#5F5F5F' }}>Date</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#0E0E0C' }}>
                  {order.orderDate || order.purchaseDate}
                </span>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: '#F0F0F0', margin: '4px 0' }} />

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 400, color: '#5F5F5F' }}>Total</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#0E0E0C' }}>
                  ₦{order.total.toLocaleString()}
                </span>
              </div>

            </div>
          </div>

          {/* Shipping Card */}
          <div className="detail-card">
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0E0E0C' }}>Shipping</div>

            {/* Address */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', paddingTop: '12px' }}>
              <div style={{ paddingTop: '2px', flexShrink: 0 }}>
                <MapPin size={13} color="#FF7101" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 400, color: '#5F5F5F', lineHeight: '18px' }}>
                {order.shippingAddress}
              </span>
            </div>

            {/* Tracking pill */}
            {order.trackingId &&
              order.trackingId !== 'Pending Allocation' &&
              order.trackingId !== 'Cancelled' && (
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', marginTop: '12px',
                background: '#FAFAFA', border: '0.8px solid #F0F0F0', borderRadius: '6px',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 400, color: '#A7A9AA', lineHeight: '15px' }}>Tracking No.</span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#0E0E0C', lineHeight: '18px' }}>
                    {order.trackingId}
                  </span>
                </div>
                <button
                  onClick={() => navigator.clipboard?.writeText(order.trackingId)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
                  title="Copy tracking ID"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <rect x="4.5" y="4.5" width="7" height="7" rx="1" stroke="#FF7101" strokeWidth="1.08" />
                    <path d="M1.5 8.5V2.5a1 1 0 0 1 1-1h6" stroke="#FF7101" strokeWidth="1.08" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ----- Right Column ----- */}
        <div className="detail-right">

          {/* Order Items Card */}
          <div className="detail-card">
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0E0E0C', marginBottom: '0' }}>Order Items</div>

            {order.items && order.items.length > 0 ? (
              <>
                {/* Table */}
                <div style={{ marginTop: '16px' }}>
                  {/* Header row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 120px 120px 60px 80px',
                    paddingBottom: '10px',
                    borderBottom: '0.8px solid #F0F0F0',
                  }}>
                    {['Product', 'SKU', 'Unit Price', 'Qty', 'Subtotal'].map(h => (
                      <span key={h} style={{
                        fontSize: '11px', fontWeight: 500, color: '#A7A9AA',
                        textTransform: 'uppercase', letterSpacing: '0.275px',
                        textAlign: h === 'Product' || h === 'SKU' ? 'left' : 'right',
                      }}>{h}</span>
                    ))}
                  </div>

                  {/* Item rows */}
                  {order.items.map((item, i) => (
                    <div key={i} style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 120px 120px 60px 80px',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '0.8px solid #F0F0F0',
                      minHeight: '65px',
                    }}>
                      {/* Product */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '6px',
                          background: '#F8F8F8', border: '0.8px solid #F0F0F0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <Package size={16} color="#A7A9AA" />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#0E0E0C' }}>
                          {item.name}
                        </span>
                      </div>
                      {/* SKU */}
                      <span style={{ fontSize: '12px', fontWeight: 400, color: '#5F5F5F' }}>
                        {item.sku}
                      </span>
                      {/* Unit Price */}
                      <span style={{ fontSize: '13px', fontWeight: 400, color: '#0E0E0C', textAlign: 'right' }}>
                        ₦{item.price.toLocaleString()}
                      </span>
                      {/* Qty */}
                      <span style={{ fontSize: '13px', fontWeight: 400, color: '#0E0E0C', textAlign: 'right' }}>
                        ×{item.qty}
                      </span>
                      {/* Subtotal */}
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#0E0E0C', textAlign: 'right' }}>
                        ₦{(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Summary — right-aligned, 240px wide */}
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: '8px',
                  alignItems: 'flex-end', paddingTop: '16px',
                  borderTop: '0.8px solid #F0F0F0', marginTop: '8px',
                }}>
                  {/* Subtotal */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '240px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 400, color: '#5F5F5F' }}>Subtotal</span>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#0E0E0C' }}>₦{subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '240px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 400, color: '#5F5F5F' }}>Discount</span>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#FB3636' }}>-₦{discount.toLocaleString()}</span>
                    </div>
                  )}

                  {tax > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '240px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 400, color: '#5F5F5F' }}>Tax</span>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#0E0E0C' }}>₦{tax.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Shipping */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '240px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 400, color: '#5F5F5F' }}>Shipping</span>
                    <span style={{ fontSize: '12px', fontWeight: 400, color: shippingCost === 0 ? '#24D059' : '#0E0E0C' }}>
                      {shippingCost === 0 ? 'Free' : `₦${shippingCost.toLocaleString()}`}
                    </span>
                  </div>

                  {/* Divider */}
                  <div style={{ width: '240px', height: '1px', background: '#F0F0F0' }} />

                  {/* Total */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '240px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0E0E0C' }}>Total</span>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#0E0E0C' }}>₦{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '40px 20px', color: '#A7A9AA' }}>
                <Package size={40} />
                <p style={{ margin: 0, fontSize: '14px' }}>No products found in this order.</p>
              </div>
            )}
          </div>

          {/* Order Notes Card */}
          <div className="detail-card">
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0E0E0C' }}>Order Notes</div>
            <div style={{ marginTop: '8px' }}>
              {order.notes ? (
                <div style={{
                  padding: '12px',
                  background: '#FAFAFA',
                  border: '0.8px solid #F0F0F0',
                  borderRadius: '8px',
                  fontSize: '13px', fontWeight: 400, color: '#5F5F5F', lineHeight: '20px',
                }}>
                  {order.notes}
                </div>
              ) : (
                <div style={{
                  padding: '12px',
                  background: '#FAFAFA',
                  border: '0.8px solid #F0F0F0',
                  borderRadius: '8px',
                  fontSize: '13px', fontWeight: 400, color: '#A7A9AA', fontStyle: 'italic',
                }}>
                  No notes added for this order.
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="detail-card">
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0E0E0C' }}>Quick Actions</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>

              {/* Mark as Pending */}
              <button
                onClick={() => order.status !== 'Pending' && handleStatusChange('Pending')}
                disabled={order.status === 'Pending'}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 12px', borderRadius: '8px',
                  border: '0.8px solid #F0F0F0', background: 'transparent',
                  fontSize: '12px', fontWeight: 500, color: '#5F5F5F',
                  cursor: order.status === 'Pending' ? 'not-allowed' : 'pointer',
                  opacity: order.status === 'Pending' ? 0.5 : 1,
                  fontFamily: 'inherit',
                }}
              >
                <Clock size={14} color="#5F5F5F" />
                Mark as Pending
              </button>

              {/* Mark as Processing */}
              <button
                onClick={() => order.status !== 'Processing' && handleStatusChange('Processing')}
                disabled={order.status === 'Processing'}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 12px', borderRadius: '8px',
                  border: '0.8px solid #F0F0F0', background: 'transparent',
                  fontSize: '12px', fontWeight: 500, color: '#F5A405',
                  cursor: order.status === 'Processing' ? 'not-allowed' : 'pointer',
                  opacity: order.status === 'Processing' ? 0.5 : 1,
                  fontFamily: 'inherit',
                }}
              >
                <Package size={14} color="#F5A405" />
                Mark as Processing
              </button>

              {/* Mark as Shipped */}
              <button
                onClick={() => order.status !== 'Shipped' && handleStatusChange('Shipped')}
                disabled={order.status === 'Shipped'}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 12px', borderRadius: '8px',
                  border: '0.8px solid #F0F0F0', background: 'transparent',
                  fontSize: '12px', fontWeight: 500, color: '#3B82F6',
                  cursor: order.status === 'Shipped' ? 'not-allowed' : 'pointer',
                  opacity: order.status === 'Shipped' ? 0.5 : 1,
                  fontFamily: 'inherit',
                }}
              >
                <Truck size={14} color="#3B82F6" />
                Mark as Shipped
              </button>

              {/* Cancel Order */}
              <button
                onClick={() => !['Cancelled','Delivered'].includes(order.status) && handleStatusChange('Cancelled')}
                disabled={['Cancelled', 'Delivered'].includes(order.status)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 12px', borderRadius: '8px',
                  border: '0.8px solid #FFEBEB', background: '#FFEBEB',
                  fontSize: '12px', fontWeight: 500, color: '#FB3636',
                  cursor: ['Cancelled','Delivered'].includes(order.status) ? 'not-allowed' : 'pointer',
                  opacity: ['Cancelled','Delivered'].includes(order.status) ? 0.5 : 1,
                  fontFamily: 'inherit',
                }}
              >
                <X size={14} color="#FB3636" />
                Cancel Order
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
