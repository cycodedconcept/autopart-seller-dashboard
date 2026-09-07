import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { ShoppingBag, Box, Clock, AlertCircle, Search, Filter, ChevronLeft, ChevronRight, Download, Eye, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { fetchOrders } from '../../features/orderSlice'

export default function Orders() {
  const dispatch = useDispatch()
  const orders = useSelector(s => s.orders.list)

  useEffect(() => { dispatch(fetchOrders()) }, [dispatch])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const filtered = orders.filter(order => 
    order.id.toLowerCase().includes(search.toLowerCase()) ||
    order.customerName.toLowerCase().includes(search.toLowerCase()) ||
    order.itemName.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const currentOrders = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleExport = () => {
    const headers = ['Order ID', 'Customer Name', 'Purchase Date', 'Item Name', 'Amount', 'Payment Method', 'Status']
    const rows = filtered.map(order => [
      order.id, order.customerName, order.purchaseDate, order.itemName,
      order.amount, order.paymentMethod, order.status
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'orders.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Delivered': return 'status-badge status-delivered'
      case 'Cancelled': return 'status-badge status-cancelled'
      case 'Processing': return 'status-badge status-processing'
      case 'Shipped': return 'status-badge status-shipped'
      case 'Pending': return 'status-badge status-pending'
      default: return 'status-badge'
    }
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1 className="page-title">All Order List</h1>
        <button className="export-btn" onClick={handleExport}>
          <Download size={18} />
          <span>Export Data</span>
        </button>
      </div>

      <div className="dashboard-stats-grid">
        <div className="card dashboard-stat-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', paddingLeft: '34px', border: '1px solid #F0F0F0', borderRadius: '8px' }}>
          <div style={{ position: 'absolute', left: '16px', top: '16px', width: '6px', height: '70px', background: '#3B82F6', borderRadius: '20px' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '16px', color: '#5F5F5F', fontWeight: 500, lineHeight: '20px' }}>Total Orders</span>
            <div style={{ padding: '8px', background: 'rgba(59,130,246,0.1)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={24} color="#3B82F6" />
            </div>
          </div>
          <div style={{ color: '#0E0E0C', fontSize: '32px', fontWeight: 700, lineHeight: '42px' }}>{orders.length.toLocaleString()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#5F5F5F', fontWeight: 400 }}>Total orders</span>
          </div>
        </div>
        <div className="card dashboard-stat-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', paddingLeft: '34px', border: '1px solid #F0F0F0', borderRadius: '8px' }}>
          <div style={{ position: 'absolute', left: '16px', top: '16px', width: '6px', height: '70px', background: '#22C55E', borderRadius: '20px' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '16px', color: '#5F5F5F', fontWeight: 500, lineHeight: '20px' }}>Parts Shipped</span>
            <div style={{ padding: '8px', background: 'rgba(34,197,94,0.1)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box size={24} color="#22C55E" />
            </div>
          </div>
          <div style={{ color: '#0E0E0C', fontSize: '32px', fontWeight: 700, lineHeight: '42px' }}>{orders.filter(o => o.status === 'Delivered' || o.status === 'Shipped').length.toLocaleString()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#5F5F5F', fontWeight: 400 }}>Delivered/shipped</span>
          </div>
        </div>
        <div className="card dashboard-stat-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', paddingLeft: '34px', border: '1px solid #F0F0F0', borderRadius: '8px' }}>
          <div style={{ position: 'absolute', left: '16px', top: '16px', width: '6px', height: '70px', background: '#F59E0B', borderRadius: '20px' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '16px', color: '#5F5F5F', fontWeight: 500, lineHeight: '20px' }}>Processing</span>
            <div style={{ padding: '8px', background: 'rgba(245,158,11,0.1)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={24} color="#F59E0B" />
            </div>
          </div>
          <div style={{ color: '#0E0E0C', fontSize: '32px', fontWeight: 700, lineHeight: '42px' }}>{orders.filter(o => o.status === 'Processing').length.toLocaleString()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#5F5F5F', fontWeight: 400 }}>In progress</span>
          </div>
        </div>
        <div className="card dashboard-stat-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', paddingLeft: '34px', border: '1px solid #F0F0F0', borderRadius: '8px' }}>
          <div style={{ position: 'absolute', left: '16px', top: '16px', width: '6px', height: '70px', background: '#EF4444', borderRadius: '20px' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '16px', color: '#5F5F5F', fontWeight: 500, lineHeight: '20px' }}>Pending Orders</span>
            <div style={{ padding: '8px', background: 'rgba(239,68,68,0.1)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={24} color="#EF4444" />
            </div>
          </div>
          <div style={{ color: '#0E0E0C', fontSize: '32px', fontWeight: 700, lineHeight: '42px' }}>{orders.filter(o => o.status === 'Pending').length.toLocaleString()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#5F5F5F', fontWeight: 400 }}>Awaiting action</span>
          </div>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="toolbar-buttons">
          <button className="filter-btn">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Purchase Date</th>
              <th>Item Name</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  <span className="order-id">#{order.id}</span>
                </td>
                <td>
                  <div className="customer-cell">
                    <img src={order.avatar} alt={order.customerName} className="customer-avatar" />
                    <span>{order.customerName}</span>
                  </div>
                </td>
                <td>{order.purchaseDate}</td>
                <td>{order.itemName}</td>
                <td>₦{order.amount.toLocaleString()}</td>
                <td>{order.paymentMethod}</td>
                <td>
                  <span className={getStatusBadgeClass(order.status)}>{order.status}</span>
                </td>
                <td>
                  <div className="action-cell">
                    <Link to={`/orders/${order.id}`} className="action-btn" style={{ textDecoration: 'none' }}>
                      <Eye size={16} />
                    </Link>
                    <button className="action-btn">
                      <Edit size={16} />
                    </button>
                    <button className="action-btn">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">
          Showing <span>{(currentPage - 1) * itemsPerPage + 1}</span> to <span>{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span>{filtered.length}</span> entries
        </div>
        <div className="pagination-controls">
          <button 
            className="pagination-btn" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button 
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button 
            className="pagination-btn" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
