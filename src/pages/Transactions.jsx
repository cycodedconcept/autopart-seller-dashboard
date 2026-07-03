
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Search, Filter, FileText, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, Eye, Download, MoreHorizontal } from 'lucide-react'
import { transactionStats } from '../utils/mockData'

const Sparkline = ({ color, data }) => {
  const maxVal = Math.max(...data)
  const width = 100
  const height = 36
  const padding = 4
  const points = data.map((val, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: height - padding - (val / maxVal) * (height - padding * 2),
  }))

  const linePath = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`
    const prev = points[i - 1]
    const cpx1 = prev.x + (p.x - prev.x) * 0.4
    const cpx2 = prev.x + (p.x - prev.x) * 0.6
    return `${acc} C ${cpx1},${prev.y} ${cpx2},${p.y} ${p.x},${p.y}`
  }, '')

  const areaPath = `${linePath} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ flexShrink: 0, overflow: 'visible' }}>
      <path d={areaPath} fill={color} fillOpacity="0.06" stroke="none" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Transactions() {
  const transactions = useSelector(s => s.transactions.list)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const filtered = transactions.filter(txn => 
    txn.id.toLowerCase().includes(search.toLowerCase()) || 
    txn.customerName.toLowerCase().includes(search.toLowerCase()) ||
    txn.description.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const currentTransactions = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getChangeIcon = (change) => {
    if (change.startsWith('+')) return <ArrowUpRight size={12} className="change-positive" />
    return <ArrowDownRight size={12} className="change-negative" />
  }

  const formatAmount = (amount) => {
    const formatted = Math.abs(amount).toLocaleString('en-US')
    return amount >= 0 ? `+₦${formatted}` : `-₦${formatted}`
  }

  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed': return 'status-badge status-badge-green'
      case 'Pending': return 'status-badge status-badge-yellow'
      case 'Reversal': return 'status-badge status-badge-red'
      default: return 'status-badge'
    }
  }

  const sparklineData = [
    [20, 28, 32, 24, 36, 40, 32],
    [12, 20, 16, 28, 24, 36, 32],
    [8, 12, 16, 12, 20, 16, 12]
  ]

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1 className="page-title">All Transactions List</h1>
      </div>

      <div className="stats-grid">
        {/* Total Balance */}
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-header">
              <div className="stat-icon-title">
                <div className="stat-icon stat-icon-green">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" fill="#10B981" fillOpacity="0.2"/>
                  </svg>
                </div>
                <span className="stat-label">Total Balance</span>
              </div>
              <Sparkline color="#10B981" data={sparklineData[0]} />
            </div>
            <div className="stat-value">₦{transactionStats.totalBalance.toLocaleString()}</div>
            <div className="stat-change">
              {getChangeIcon(transactionStats.totalBalanceChange)}
              <span className="stat-badge">{transactionStats.totalBalanceChange}</span>
              <span>Since last week</span>
            </div>
          </div>
        </div>

        {/* Total Credits */}
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-header">
              <div className="stat-icon-title">
                <div className="stat-icon stat-icon-cyan">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" fill="#06B6D4" fillOpacity="0.2"/>
                  </svg>
                </div>
                <span className="stat-label">Total Credits</span>
              </div>
              <Sparkline color="#06B6D4" data={sparklineData[1]} />
            </div>
            <div className="stat-value">+₦{transactionStats.totalCredits.toLocaleString()}</div>
            <div className="stat-change">
              {getChangeIcon(transactionStats.totalCreditsChange)}
              <span className="stat-badge">{transactionStats.totalCreditsChange}</span>
              <span>Since last week</span>
            </div>
          </div>
        </div>

        {/* Total Debits */}
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-header">
              <div className="stat-icon-title">
                <div className="stat-icon stat-icon-orange">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" fill="#F59E0B" fillOpacity="0.2"/>
                  </svg>
                </div>
                <span className="stat-label">Total Debits</span>
              </div>
              <Sparkline color="#F59E0B" data={sparklineData[2]} />
            </div>
            <div className="stat-value">-₦{transactionStats.totalDebits.toLocaleString()}</div>
            <div className="stat-change">
              {getChangeIcon(transactionStats.totalDebitsChange)}
              <span className="stat-badge">{transactionStats.totalDebitsChange}</span>
              <span>Since last week</span>
            </div>
          </div>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-bar">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="search-shortcut">⌘F</span>
        </div>
        <div className="toolbar-buttons">
          <button className="filter-btn">
            <Filter size={16} />
          </button>
          <button className="export-btn">
            <FileText size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer Name</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((txn) => (
              <tr key={txn.id}>
                <td>
                  <span className="transaction-id">{txn.id}</span>
                </td>
                <td>
                  <div className="customer-cell">
                    <img src={txn.avatar} alt={txn.customerName} className="customer-avatar" />
                    <span>{txn.customerName}</span>
                  </div>
                </td>
                <td>{txn.description}</td>
                <td className={txn.amount >= 0 ? 'amount-positive' : 'amount-negative'}>
                  {formatAmount(txn.amount)}
                </td>
                <td>{txn.date}</td>
                <td>{txn.paymentMethod}</td>
                <td>
                  <span className={getStatusClass(txn.status)}>{txn.status}</span>
                </td>
                <td>
                  <div className="action-cell">
                    <button className="action-btn">
                      <Eye size={14} />
                    </button>
                    <button className="action-btn">
                      <Download size={14} />
                    </button>
                    <button className="action-btn">
                      <MoreHorizontal size={16} />
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
            <ChevronLeft size={16} />
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
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="transactions-mobile-list">
        {currentTransactions.map((txn) => (
          <div key={txn.id} className="transaction-mobile-item">
            <div className="transaction-mobile-header">
              <div className="customer-cell">
                <img src={txn.avatar} alt={txn.customerName} className="customer-avatar" />
                <div className="customer-info">
                  <div className="customer-name">{txn.customerName}</div>
                  <div className="transaction-id-mobile">{txn.id}</div>
                </div>
              </div>
              <div className={txn.amount >= 0 ? 'amount-positive' : 'amount-negative'}>
                {formatAmount(txn.amount)}
              </div>
            </div>
            <div className="transaction-mobile-details">
              <div className="transaction-desc">{txn.description}</div>
              <div className="transaction-meta">
                <span>{txn.date}</span>
                <span className={getStatusClass(txn.status)}>{txn.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
