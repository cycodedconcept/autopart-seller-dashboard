import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { updateOrderStatus } from '../../features/orderSlice'
import { ArrowLeft, Printer, ChevronDown, Check, Clock, Package, Truck, MapPin, CreditCard } from 'lucide-react'

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

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Delivered': return 'detail-status-badge detail-status-delivered'
      case 'Cancelled': return 'detail-status-badge detail-status-cancelled'
      case 'Processing': return 'detail-status-badge detail-status-processing'
      case 'Shipped': return 'detail-status-badge detail-status-shipped'
      case 'Pending': return 'detail-status-badge detail-status-pending'
      default: return 'detail-status-badge'
    }
  }

  const getTimelineIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock size={16} />
      case 'Processing': return <Check size={16} />
      case 'Shipped': return <Truck size={16} />
      case 'Delivered': return <Check size={16} />
      default: return <Clock size={16} />
    }
  }

  const isStatusCompleted = (status) => {
    const orderIndex = ['Pending', 'Processing', 'Shipped', 'Delivered'].indexOf(order.status)
    const currentIndex = ['Pending', 'Processing', 'Shipped', 'Delivered'].indexOf(status)
    return currentIndex <= orderIndex
  }

  return (
    <div className="order-detail-page">
      <div className="detail-header">
        <div className="detail-header-left">
          <Link to="/orders" className="back-link">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="detail-title">Order Details</h1>
            <div className="detail-subtitle">#{order.id}</div>
          </div>
        </div>
        <div className="detail-header-right">
          <button className="print-btn">
            <Printer size={18} />
            <span>Print</span>
          </button>
          <div className="status-dropdown">
            <button 
              className="update-status-btn" 
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <span>Update Status</span>
              <ChevronDown size={16} />
            </button>
            {showStatusDropdown && (
              <div className="status-dropdown-menu">
                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                  <button 
                    key={status} 
                    className={`status-dropdown-item ${order.status === status ? 'active' : ''}`}
                    onClick={() => handleStatusChange(status)}
                  >
                    {status === order.status && <Check size={16} />}
                    <span>Mark as {status}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-left">
          <div className="detail-card">
            <div className="detail-card-title">Order Status</div>
            <div className="timeline">
              {['Pending', 'Processing', 'Shipped', 'Delivered'].map((status, index) => (
                <div 
                  key={status} 
                  className={`timeline-item ${isStatusCompleted(status) ? 'completed' : ''}`}
                >
                  <div className="timeline-icon">
                    {getTimelineIcon(status)}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-status">{status}</div>
                  </div>
                  {index < 3 && <div className={`timeline-line ${isStatusCompleted(['Pending', 'Processing', 'Shipped'][index]) ? 'completed' : ''}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-card-title">Customer</div>
            <div className="customer-info">
              <img src={order.avatar} alt={order.customerName} className="customer-info-avatar" />
              <div>
                <div className="customer-info-name">{order.customerName}</div>
                <div className="customer-info-id">Customer ID: {order.id}</div>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-card-title">Payment</div>
            <div className="payment-info">
              <div className="payment-row">
                <span className="payment-label">Method</span>
                <span className="payment-value flex items-center gap-2">
                  <CreditCard size={16} />
                  {order.paymentMethod}
                </span>
              </div>
              <div className="payment-row">
                <span className="payment-label">Date</span>
                <span className="payment-value">{order.orderDate || order.purchaseDate}</span>
              </div>
              <div className="payment-row">
                <span className="payment-label">Total</span>
                <span className="payment-value payment-total">₦{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-card-title">Shipping</div>
            <div className="shipping-info">
              <div className="shipping-address flex items-start gap-2">
                <MapPin size={16} className="mt-1" />
                <span>{order.shippingAddress}</span>
              </div>
              {order.trackingId && order.trackingId !== 'Pending Allocation' && order.trackingId !== 'Cancelled' && (
                <div className="tracking-info">
                  <span className="tracking-label">Tracking No.</span>
                  <span className="tracking-value">{order.trackingId}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="detail-right">
          <div className="detail-card">
            <div className="detail-card-title">Order Items</div>
            <div className="order-items-table">
              <div className="order-items-header">
                <span>Product</span>
                <span>SKU</span>
                <span>Unit Price</span>
                <span>Qty</span>
                <span>Subtotal</span>
              </div>
              {order.items.map((item, index) => (
                <div key={index} className="order-item-row">
                  <div className="product-cell">
                    <div className="product-image-placeholder">
                      <Package size={24} />
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <span className="item-sku">{item.sku}</span>
                  <span>₦{item.price.toLocaleString()}</span>
                  <span>{item.qty}</span>
                  <span>₦{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={order.shippingCost === 0 ? 'shipping-free' : ''}>
                  {order.shippingCost === 0 ? 'Free' : `₦${order.shippingCost.toLocaleString()}`}
                </span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>₦{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="detail-card">
              <div className="detail-card-title">Order Notes</div>
              <div className="order-notes">{order.notes}</div>
            </div>
          )}

          <div className="detail-card">
            <div className="detail-card-title">Quick Actions</div>
            <div className="quick-actions">
              <button className="quick-action-btn">Mark as Pending</button>
              <button className="quick-action-btn quick-action-warning">Mark as Processing</button>
              <button className="quick-action-btn quick-action-info">Mark as Shipped</button>
              <button className="quick-action-btn quick-action-danger">Cancel Order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
