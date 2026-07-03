import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, ShoppingBag, TrendingUp, Repeat, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { initialCustomers, customerStats } from '../../utils/mockData'

export default function Customers() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredCustomers = initialCustomers.filter(customer => 
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase()) ||
    customer.partCategory.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="customers-page-container">
      <div className="customers-page-header">
        <div className="customers-header-left">
          <h1 className="customers-page-title">All Customer List</h1>
        </div>
        <Link to="/customers/add" className="customers-add-btn">
          Add Customer
        </Link>
      </div>

      <div className="customers-stats-grid">
        <div className="customer-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(255, 107, 0, 0.1)' }}>
            <Users size={20} color="#FF6B00" />
          </div>
          <div className="stat-card-info">
            <div className="stat-card-value">{customerStats.totalCustomers.toLocaleString()}</div>
            <div className="stat-card-label">Total Customers</div>
            <div className="stat-card-change stat-card-change-up">
              {customerStats.totalChange}
            </div>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <ShoppingBag size={20} color="#10B981" />
          </div>
          <div className="stat-card-info">
            <div className="stat-card-value">{customerStats.activeThisMonth.toLocaleString()}</div>
            <div className="stat-card-label">Active This Month</div>
            <div className="stat-card-change stat-card-change-up">
              {customerStats.activeChange}
            </div>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <TrendingUp size={20} color="#3B82F6" />
          </div>
          <div className="stat-card-info">
            <div className="stat-card-value">{customerStats.avgOrderValue}</div>
            <div className="stat-card-label">Avg Order Value</div>
            <div className="stat-card-change stat-card-change-up">
              {customerStats.avgChange}
            </div>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            <Repeat size={20} color="#EF4444" />
          </div>
          <div className="stat-card-info">
            <div className="stat-card-value">{customerStats.repeatBuyers}%</div>
            <div className="stat-card-label">Repeat Buyers</div>
            <div className="stat-card-change stat-card-change-up">
              {customerStats.repeatChange}
            </div>
          </div>
        </div>
      </div>

      <div className="customers-toolbar">
        <div className="customers-search">
          <Search size={18} color="var(--text-muted)" />
          <input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="customers-filter-btn">
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="customers-table-card">
        <div className="customers-table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Part Category</th>
                <th>Last Date</th>
                <th>Delivery Address</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map(customer => (
                <tr key={customer.refNumber} className="customer-table-row">
                  <td>
                    <span className="part-category-badge">
                      {customer.partCategory}
                    </span>
                  </td>
                  <td className="customer-table-cell">{customer.lastDate}</td>
                  <td className="customer-table-cell">{customer.deliveryAddress}</td>
                  <td className="customer-table-cell">
                    <div className="customer-cell-image">
                      <img src={customer.avatar} alt={customer.name} />
                      <span>{customer.name}</span>
                    </div>
                  </td>
                  <td className="customer-table-cell">{customer.email}</td>
                  <td className="customer-table-cell">
                    <span className={`customer-status-badge ${customer.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="customer-table-cell">
                    <button className="customer-action-btn">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="customers-empty-state">No customers found.</div>
          )}
        </div>

        <div className="customers-pagination">
          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} entries
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
