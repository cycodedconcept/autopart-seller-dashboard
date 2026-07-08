import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ShoppingBag, Box, Clock, AlertCircle, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { orderStats } from '../../utils/mockData'
import StatCard from '../../components/StatCard'

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

      <div className="dashboard-stats-grid">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={orderStats.totalOrders.toLocaleString()}
          change={orderStats.totalChange}
          iconColor="#3B82F6"
          lineColor="#3B82F6"
          lightColor="#DBEAFE"
          progressWidth="45%"
        />
        <StatCard
          icon={Box}
          label="Parts Shipped"
          value={orderStats.partsShipped.toLocaleString()}
          change={orderStats.partsShippedChange}
          iconColor="#22C55E"
          lineColor="#22C55E"
          lightColor="#DCFCE7"
          progressWidth="62%"
        />
        <StatCard
          icon={Clock}
          label="Backordered"
          value={orderStats.backordered.toLocaleString()}
          change={orderStats.backorderedChange}
          changeDown={orderStats.backorderedChange.startsWith('-')}
          iconColor="#F59E0B"
          lineColor="#F59E0B"
          lightColor="#FEF3C7"
          progressWidth="18%"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Orders"
          value={orderStats.pendingOrders.toLocaleString()}
          change={orderStats.pendingChange}
          changeDown={orderStats.pendingChange.startsWith('-')}
          iconColor="#EF4444"
          lineColor="#EF4444"
          lightColor="#FEE2E2"
          progressWidth="25%"
        />
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
