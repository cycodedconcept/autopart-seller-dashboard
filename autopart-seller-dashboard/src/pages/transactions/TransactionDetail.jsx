import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ArrowLeft, Printer, Download } from 'lucide-react'
import html2pdf from 'html2pdf.js'

export default function TransactionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const txn = useSelector(s => s.transactions.list.find(t => t.id === id))

  if (!txn) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <div className="page-title">Transaction not found</div>
        <button onClick={() => navigate('/transactions')} className="btn btn-primary mt-20">
          Back to Transactions
        </button>
      </div>
    )
  }

  const isCredit = txn.amount >= 0
  const absAmount = Math.abs(txn.amount).toLocaleString('en-US')
  const displayAmount = `₦${absAmount}`
  const amountColor = isCredit ? '#22C55E' : '#EF4444'
  const amountLabel = isCredit ? 'CREDIT' : 'DEBIT'

  const handleDownloadPDF = () => {
    const el = document.getElementById('receipt-content')
    const opt = {
      margin:       0.5,
      filename:     `receipt-${txn.id}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, letterRendering: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
    }
    html2pdf().set(opt).from(el).save()
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="transaction-detail-page">
      <div className="td-header">
        <button className="td-back-btn" onClick={() => navigate('/transactions')}>
          <ArrowLeft size={18} />
          Back to Transactions
        </button>
        <div className="td-actions">
          <button className="td-action-btn" onClick={handlePrint}>
            <Printer size={16} />
            Print
          </button>
          <button className="td-action-btn td-download-btn" onClick={handleDownloadPDF}>
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="receipt-wrapper" id="receipt-content">
        <div className="receipt-card">
          <div className="receipt-header">
            <div className="receipt-title">RECEIPT</div>
            <div className="receipt-id">{txn.id}</div>
            <div className="receipt-date">{txn.date}</div>
          </div>

          <div className="receipt-amount-section">
            <div className="receipt-amount" style={{ color: amountColor }}>
              {displayAmount}
            </div>
            <div className="receipt-amount-label" style={{ color: amountColor }}>
              {amountLabel}
            </div>
          </div>

          <div className="receipt-divider" />

          <div className="receipt-details">
            <div className="receipt-row">
              <span className="receipt-label">Customer</span>
              <span className="receipt-value">{txn.customerName}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Payment Method</span>
              <span className="receipt-value">{txn.paymentMethod}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Reference</span>
              <span className="receipt-value">{txn.description}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Status</span>
              <span className={`receipt-status ${txn.status.toLowerCase()}`}>{txn.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
