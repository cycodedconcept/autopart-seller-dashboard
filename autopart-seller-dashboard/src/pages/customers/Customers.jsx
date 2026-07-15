import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Users, ShoppingBag, TrendingUp, Repeat, Search, Filter, Eye, Edit, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { initialCustomers, customerStats } from '../../utils/mockData'

function ArrowUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4.88 2.92L4.56 4.56L6.19 4.88" stroke="#24D059" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 11.08V4.67" stroke="#24D059" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.67 7L7 4.67L9.33 7" stroke="#24D059" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function StatCard({ icon: Icon, label, value, iconColor, lineColor, iconBgColor, subLabel, change }) {
  return (
    <div className="card dashboard-stat-card" style={{ 
      padding: '16px',
      display: 'flex', 
      flexDirection: 'column', 
      gap: '8px', 
      position: 'relative',
      paddingLeft: '34px',
      border: '1px solid #F0F0F0',
      borderRadius: '8px',
    }}>
      <div style={{ 
        position: 'absolute',
        left: '16px',
        top: '16px',
        width: '6px',
        height: '70px',
        background: lineColor,
        borderRadius: '20px',
      }} />
      
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '16px', color: '#5F5F5F', fontWeight: 500, lineHeight: '20px' }}>{label}</span>
        <div style={{ 
          padding: '8px',
          background: iconBgColor,
          borderRadius: '4px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Icon size={24} color={iconColor} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#0E0E0C', fontSize: '32px', fontWeight: 700, lineHeight: '42px' }}>{value}</div>
      </div>

      {subLabel && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {change && (
            <div style={{ 
              padding: '4px 6px',
              borderRadius: '4px',
              background: '#E9FAEE',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ArrowUp />
              <span style={{ 
                fontSize: '12px', 
                color: '#24D059', 
                fontWeight: 500,
                lineHeight: '16px'
              }}>
                {change}
              </span>
            </div>
          )}
          <span style={{ fontSize: '14px', color: '#5F5F5F', fontWeight: 400, lineHeight: '18px' }}>{subLabel}</span>
        </div>
      )}
    </div>
  )
}

export default function Customers() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState(initialCustomers)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase()) ||
    customer.partCategory.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage)

  const totalCustomers = customerStats.totalCustomers
  const activeThisMonth = customerStats.activeThisMonth
  const avgOrderValue = customerStats.avgOrderValue
  const repeatBuyers = customerStats.repeatBuyers

  const handleDelete = (refNumber) => {
    if (confirm('Delete this customer?')) {
      setCustomers(prev => prev.filter(c => c.refNumber !== refNumber))
    }
  }

  return (
    <div className="customers-page-container">
      <div className="products-page-header">
        <div className="products-header-left">
          <h1 className="products-page-title">All Customer List</h1>
        </div>
        <Link to="/customers/add" className="products-add-btn">
          <Plus size={18} />
          Add Customer
        </Link>
      </div>

      <div className="dashboard-stats-grid">
        <StatCard
          icon={Users}
          label="Total Customers"
          value={totalCustomers.toLocaleString()}
          iconColor="#FF7101"
          lineColor="#FF7101"
          iconBgColor="#FFF5EB"
          change="+23%"
          subLabel="this week"
        />
        <StatCard
          icon={ShoppingBag}
          label="Active This Month"
          value={activeThisMonth.toLocaleString()}
          iconColor="#3B82F6"
          lineColor="#3B82F6"
          iconBgColor="#DBEAFE"
          subLabel="50.7% of total"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg. Order Value"
          value={avgOrderValue}
          iconColor="#2DD4BF"
          lineColor="#2DD4BF"
          iconBgColor="#CCFBF1"
          subLabel="Per Customer"
        />
        <StatCard
          icon={Repeat}
          label="Repeat Buyers"
          value={`${repeatBuyers}%`}
          iconColor="#EF4444"
          lineColor="#EF4444"
          iconBgColor="#FEE2E2"
          subLabel="Returning rate"
        />
      </div>

      <div className="products-toolbar">
        <div className="products-toolbar-top">
          <div className="products-search">
            <Search size={18} color="var(--text-muted)" />
            <input
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="products-filter-btn">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      <div className="customers-table-card">
            <div className="customers-table-wrapper">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>PART CATEGORY</th>
                    <th>LAST DATE</th>
                    <th>DELIVERY ADDRESS</th>
                    <th>CUSTOMER NAME</th>
                    <th>EMAIL ADDRESS</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCustomers.map(customer => (
                    <tr key={customer.refNumber} className="customer-table-row">
                      <td className="customer-table-cell">{customer.partCategory}</td>
                      <td className="customer-table-cell">{customer.lastDate}</td>
                      <td className="customer-table-cell">{customer.deliveryAddress}</td>
                      <td className="customer-table-cell">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={customer.avatar} 
                            alt={customer.name} 
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          {customer.name}
                        </div>
                      </td>
                      <td className="customer-table-cell">{customer.email}</td>
                      <td className="customer-table-cell">
                        <span className={`customer-status-badge ${customer.status === 'Active' ? 'active' : 'inactive'}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="customer-table-cell">
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="customer-action-btn" onClick={() => navigate('/customers/' + customer.refNumber)}>
                            <Eye size={18} color="#5F5F5F" />
                          </button>
                          <button className="customer-action-btn" onClick={() => navigate('/customers/' + customer.refNumber)}>
                            <Edit size={18} color="#5F5F5F" />
                          </button>
                          <button className="customer-action-btn" onClick={() => handleDelete(customer.refNumber)}>
                            <Trash2 size={18} color="#5F5F5F" />
                          </button>
                        </div>
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