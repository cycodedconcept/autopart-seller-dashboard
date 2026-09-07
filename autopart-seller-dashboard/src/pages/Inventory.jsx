import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Boxes, PackageCheck, PackageX, AlertTriangle, Layers, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchInventory } from '../features/productSlice'

const koboToNaira = (kobo) => Number(kobo || 0) / 100
const formatDate = (iso) => iso
  ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  : '—'

const stockBadge = (item) => {
  if (item.isOutOfStock) return 'status-badge status-cancelled'
  if (item.isLowStock) return 'status-badge status-processing'
  return 'status-badge status-delivered'
}

const stockLabel = (item) => {
  if (item.isOutOfStock) return 'Out of Stock'
  if (item.isLowStock) return 'Low Stock'
  return 'In Stock'
}

const ConditionTag = ({ value }) => (
  <span className="product-tag">{(value || 'New').replace(/^\w/, c => c.toUpperCase())}</span>
)

export default function Inventory() {
  const dispatch = useDispatch()
  const { inventory, inventorySummary, pagination, loading } = useSelector(s => s.products)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => { dispatch(fetchInventory({ page })) }, [dispatch, page])

  const filtered = inventory.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    (item.partNumber || '').toLowerCase().includes(search.toLowerCase())
  )

  const summary = inventorySummary || {}
  const totalPages = pagination?.totalPages || Math.ceil(filtered.length / 10) || 1

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1 className="page-title">Inventory</h1>
      </div>

      <div className="dashboard-stats-grid">
        {[
          { icon: Layers, label: 'Total Listings', value: summary.totalListings ?? 0, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
          { icon: PackageCheck, label: 'Active Listings', value: summary.activeListings ?? 0, color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
          { icon: AlertTriangle, label: 'Low Stock', value: summary.lowStockListings ?? 0, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
          { icon: PackageX, label: 'Out of Stock', value: summary.outOfStockListings ?? 0, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="card dashboard-stat-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', paddingLeft: '34px', border: '1px solid #F0F0F0', borderRadius: '8px' }}>
            <div style={{ position: 'absolute', left: '16px', top: '16px', width: '6px', height: '70px', background: color, borderRadius: '20px' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '16px', color: '#5F5F5F', fontWeight: 500, lineHeight: '20px' }}>{label}</span>
              <div style={{ padding: '8px', background: bg, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} color={color} />
              </div>
            </div>
            <div style={{ color: '#0E0E0C', fontSize: '32px', fontWeight: 700, lineHeight: '42px' }}>{(value ?? 0).toLocaleString()}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#5F5F5F', fontWeight: 400 }}>
                {label === 'Low Stock' && summary.lowStockThreshold != null ? `Threshold: ${summary.lowStockThreshold} units` : `${summary.totalUnitsInStock ?? 0} units in stock`}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search inventory..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
        </div>
      </div>

      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Part Number</th>
              <th>Category</th>
              <th>Condition</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Added</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link to={`/products/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="customer-cell">
                      {item.primaryImageUrl
                        ? <img src={item.primaryImageUrl} alt={item.title} className="customer-avatar" style={{ objectFit: 'cover' }} />
                        : <span className="customer-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F5F5', color: '#A7A9AA' }}><Boxes size={16} /></span>
                      }
                      <span>{item.title}</span>
                    </div>
                  </Link>
                </td>
                <td>{item.partNumber || '—'}</td>
                <td>{item.category?.name || '—'}</td>
                <td><ConditionTag value={item.condition} /></td>
                <td>₦{Math.round(koboToNaira(item.priceKobo)).toLocaleString()}</td>
                <td>{item.stockQty} units</td>
                <td><span className={stockBadge(item)}>{stockLabel(item)}</span></td>
                <td>{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: '#A7A9AA', fontSize: '14px' }}>
            No inventory items found.
          </div>
        )}
      </div>

      <div className="pagination">
        <div className="pagination-info">
          Showing page <span>{page}</span> of <span>{totalPages}</span>
        </div>
        <div className="pagination-controls">
          <button className="pagination-btn" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
            <ChevronLeft size={18} />
          </button>
          <button className="pagination-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}