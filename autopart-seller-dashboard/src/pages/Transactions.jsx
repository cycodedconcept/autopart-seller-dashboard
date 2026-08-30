
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Search, Filter, FileText, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, Eye, Download, MoreHorizontal, Wallet, CreditCard, TrendingDown, Plus } from 'lucide-react'
import { fetchSales, fetchPayouts } from '../features/transactionSlice'
import StatCard from '../components/StatCard'

const splitDate = (dateStr) => {
  const m = dateStr.match(/^(.+?\d{4})\s+(.+)$/)
  return m ? { date: m[1], time: m[2] } : { date: dateStr, time: '' }
}

export default function Transactions() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const transactions = useSelector(s => s.transactions.list)
  const payouts = useSelector(s => s.transactions.payouts)

  useEffect(() => {
    dispatch(fetchSales())
    dispatch(fetchPayouts())
  }, [dispatch])

  const naira = (kobo) => Math.round((Number(kobo) || 0) / 100)
  const totalCredits = payouts
    .filter(p => ['paid', 'approved'].includes(p.status))
    .reduce((sum, p) => sum + naira(p.amountKobo), 0)
  const totalDebits = payouts
    .filter(p => ['paid', 'approved'].includes(p.status))
    .reduce((sum, p) => sum + naira(p.commissionAmountKobo), 0)
  const totalBalance = payouts
    .filter(p => p.status !== 'rejected')
    .reduce((sum, p) => sum + naira(p.amountKobo), 0)
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

  return (
    <div className="transactions-page">
      <div className="products-page-header">
        <div className="products-header-left">
          <h1 className="products-page-title">All Transactions List</h1>
        </div>
        <button className="products-add-btn">
          <FileText size={18} />
          Export CSV
        </button>
      </div>

      <div className="dashboard-stats-grid transactions-stats-grid">
        <StatCard
          icon={Wallet}
          label="Total Balance"
          value={`₦${totalBalance.toLocaleString()}`}
          change=""
          iconColor="#10B981"
          lineColor="#10B981"
          lightColor="#10B981"
          valueSize="31px"
          changeBelow
          graph="/Graph1.png"
        />
        <StatCard
          icon={CreditCard}
          label="Total Credits"
          value={`+₦${totalCredits.toLocaleString()}`}
          change=""
          iconColor="#06B6D4"
          lineColor="#06B6D4"
          lightColor="#06B6D4"
          valueSize="31px"
          changeBelow
          graph="/Graph 2.png"
        />
        <StatCard
          icon={TrendingDown}
          label="Total Debits"
          value={`-₦${totalDebits.toLocaleString()}`}
          change=""
          changeDown
          iconColor="#F59E0B"
          lineColor="#F59E0B"
          lightColor="#F59E0B"
          valueSize="31px"
          changeBelow
          graph="/Graph 3.png"
        />
      </div>

      <div className="products-toolbar">
        <div className="products-toolbar-top">
          <div className="products-search">
            <Search size={16} color="var(--text-muted)" />
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="products-filter-btn">
            <Filter size={16} />
            Filter
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
              <tr key={txn.id} onClick={() => navigate(`/transactions/${txn.id}`)} style={{ cursor: 'pointer' }}>
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
                <td>
                  <div className="date-stacked">
                    <span className="date-line">{splitDate(txn.date).date}</span>
                    <span className="time-line">{splitDate(txn.date).time}</span>
                  </div>
                </td>
                <td>{txn.paymentMethod}</td>
                <td>
                  <span className={getStatusClass(txn.status)}>{txn.status}</span>
                </td>
                <td>
                  <div className="action-cell">
                    <button className="action-btn" onClick={(e) => { e.stopPropagation(); navigate(`/transactions/${txn.id}`) }}>
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
          <div key={txn.id} className="transaction-mobile-item" onClick={() => navigate(`/transactions/${txn.id}`)} style={{ cursor: 'pointer' }}>
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
                <div className="date-stacked">
                  <span className="date-line">{splitDate(txn.date).date}</span>
                  <span className="time-line">{splitDate(txn.date).time}</span>
                </div>
                <span className={getStatusClass(txn.status)}>{txn.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
