import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, ShoppingBag, TrendingUp, Repeat, Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { initialCustomers, customerStats } from '../../utils/mockData'
import StatCard from '../../components/StatCard'

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

      <div className="dashboard-stats-grid">
        <StatCard
          icon={Users}
          label="Total Customers"
          value={customerStats.totalCustomers.toLocaleString()}
          change={customerStats.totalChange}
          iconColor="#FF6B00"
          lineColor="#FF6B00"
          lightColor="#FFD3B0"
          progressWidth="47%"
        />
        <StatCard
          icon={ShoppingBag}
          label="Active This Month"
          value={customerStats.activeThisMonth.toLocaleString()}
          change={customerStats.activeChange}
          iconColor="#10B981"
          lineColor="#10B981"
          lightColor="#D1FAE5"
          progressWidth="35%"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Order Value"
          value={customerStats.avgOrderValue}
          change={customerStats.avgChange}
          iconColor="#3B82F6"
          lineColor="#3B82F6"
          lightColor="#DBEAFE"
          progressWidth="52%"
        />
        <StatCard
          icon={Repeat}
          label="Repeat Buyers"
          value={`${customerStats.repeatBuyers}%`}
          change={customerStats.repeatChange}
          iconColor="#EF4444"
          lineColor="#EF4444"
          lightColor="#FEE2E2"
          progressWidth="28%"
        />
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
