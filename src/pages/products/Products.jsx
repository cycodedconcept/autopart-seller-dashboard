import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Package, Plus, Grid, List, Search, MapPin, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { deleteProduct } from '../../features/productSlice'
import { initialProducts } from '../../utils/mockData'

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }} className="product-card-link">
      <div className="product-card-item">
        <div className="product-card-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-card-main-image"
          />
          <span className={`product-card-status ${
            product.status === 'In Stock' ? 'status-in-stock' :
            product.status === 'Low Stock' ? 'status-low-stock' : 'status-out'
          }`}>
            {product.status}
          </span>
        </div>
        <div className="product-card-body">
          <div className="product-card-name-text">{product.name}</div>
          <div className="product-card-category">{product.category}</div>
          <div className="product-card-price-container">
            <span className="product-card-price">₦{product.price.toLocaleString()}</span>
            <span className="product-card-units">{product.units} units</span>
          </div>
          <div className="product-card-location">
            <MapPin size={12} />
            {product.location}
          </div>
        </div>
      </div>
    </Link>
  )
}

function ProductRowItem({ product, onDelete }) {
  return (
    <tr className="product-table-row">
      <td className="product-table-cell product-cell-image">
        <img src={product.image} alt={product.name} />
        <div className="product-cell-info">
          <div className="product-cell-name">{product.name}</div>
          <div className="product-cell-sku">{product.sku}</div>
        </div>
      </td>
      <td className="product-table-cell">{product.category}</td>
      <td className="product-table-cell product-cell-price">₦{product.price.toLocaleString()}</td>
      <td className="product-table-cell">{product.units}</td>
      <td className="product-table-cell">
        <span className={`product-cell-badge ${
          product.status === 'In Stock' ? 'badge-green' :
          product.status === 'Low Stock' ? 'badge-yellow' : 'badge-red'
        }`}>
          {product.status}
        </span>
      </td>
      <td className="product-table-cell">{product.location}</td>
      <td className="product-table-cell product-cell-actions">
        <Link to={`/products/${product.id}`} className="product-cell-action-btn view-btn">View</Link>
        <button className="product-cell-action-btn delete-btn" onClick={() => onDelete(product.id)}>Delete</button>
      </td>
    </tr>
  )
}

export default function Products() {
  const dispatch = useDispatch()
  const products = useSelector(s => s.products.list.length > 0 ? s.products.list : initialProducts)
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const categories = ['All', 'Brakes', 'Filters', 'Electrical', 'Ignition', 'Suspension']
  
  const inStock = products.filter(p => p.status === 'In Stock').length
  const lowStock = products.filter(p => p.status === 'Low Stock').length
  const outOfStock = products.filter(p => p.status === 'Out of Stock').length

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = filter === 'All' || p.category === filter
    return matchSearch && matchCat
  })

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) dispatch(deleteProduct(id))
  }

  return (
    <div className="products-page-container">
      {/* Header */}
      <div className="products-page-header">
        <div className="products-header-left">
          <h1 className="products-page-title">Products</h1>
          <p className="products-page-subtitle">Manage your auto-parts inventory</p>
        </div>
        <Link to="/products/add" className="products-add-btn">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Stat counters */}
      <div className="products-stats-grid">
        {[
          { label: 'Total Products', val: products.length, color: '#FF6B00', icon: Package },
          { label: 'In Stock', val: inStock, color: '#10B981', icon: CheckCircle },
          { label: 'Low Stock', val: lowStock, color: '#F59E0B', icon: AlertTriangle },
          { label: 'Out of Stock', val: outOfStock, color: '#EF4444', icon: XCircle },
        ].map(({ label, val, color, icon: Icon }) => (
          <div key={label} className="product-stat-card">
            <div className="stat-icon-circle" style={{ background: `${color}15` }}>
              <Icon size={20} color={color} />
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{val}</div>
              <div className="stat-card-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="products-toolbar">
        <div className="products-toolbar-left">
          <div className="products-search">
            <Search size={16} color="var(--text-muted)" />
            <input
              placeholder="Search parts, SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="products-toolbar-right">
          <div className="products-filter-tabs">
            {categories.map(c => (
              <button
                key={c}
                className={`filter-tab ${filter === c ? 'active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="products-view-toggle">
            <button
              className={`view-toggle-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
            >
              <Grid size={15} />
            </button>
            <button
              className={`view-toggle-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Products list or grid */}
      {view === 'grid' ? (
        <div className="products-grid-container">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
          {filtered.length === 0 && (
            <div className="products-empty-state">
              No products found.
            </div>
          )}
        </div>
      ) : (
        <div className="products-table-card">
          <div className="products-table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Units</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <ProductRowItem key={p.id} product={p} onDelete={handleDelete} />
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="products-empty-state">No products found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
