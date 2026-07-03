import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ShoppingBag, Box, Clock, AlertCircle, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { orderStats } from '../../utils/mockData'

export default function Orders() {
  const orders = useSelector(s => s.orders.list)
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

  const getChangeIcon = (change) => {
    if (change.startsWith('+')) return <ArrowUpRight size={14} className="change-positive" />
    return <ArrowDownRight size={14} className="change-negative" />
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1 className="page-title">All Order List</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon stat-icon-blue">
              <ShoppingBag size={20} />
            </div>
            <div className="stat-change">
              {getChangeIcon(orderStats.totalChange)}
              <span>{orderStats.totalChange} Since last week</span>
            </div>
          </div>
          <div className="stat-value">{orderStats.totalOrders.toLocaleString()}</div>
          <div className="stat-label">Total Orders</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon stat-icon-green">
              <Box size={20} />
            </div>
            <div className="stat-change">
              {getChangeIcon(orderStats.partsShippedChange)}
              <span>{orderStats.partsShippedChange} Since last week</span>
            </div>
          </div>
          <div className="stat-value">{orderStats.partsShipped.toLocaleString()}</div>
          <div className="stat-label">Parts Shipped</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon stat-icon-yellow">
              <Clock size={20} />
            </div>
            <div className="stat-change">
              {getChangeIcon(orderStats.backorderedChange)}
              <span>{orderStats.backorderedChange} Since last week</span>
            </div>
          </div>
          <div className="stat-value">{orderStats.backordered.toLocaleString()}</div>
          <div className="stat-label">Backordered</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon stat-icon-red">
              <AlertCircle size={20} />
            </div>
            <div className="stat-change">
              {getChangeIcon(orderStats.pendingChange)}
              <span>{orderStats.pendingChange} Since last week</span>
            </div>
          </div>
          <div className="stat-value">{orderStats.pendingOrders.toLocaleString()}</div>
          <div className="stat-label">Pending Orders</div>
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
          <button className="export-btn">
            <FileText size={18} />
            <span>Export Data</span>
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
                    <Link to={`/orders/${order.id}`} className="view-link">View</Link>
                    <button className="action-icon">
                      <MoreHorizontal size={18} />
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
