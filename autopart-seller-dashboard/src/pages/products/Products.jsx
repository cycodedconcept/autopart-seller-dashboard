import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Package, Plus, Grid, List, Search, Star, Filter, ChevronLeft, ChevronRight, X, Edit, Trash2, Eye, SlidersHorizontal } from 'lucide-react'
import { deleteProductThunk, fetchProducts } from '../../features/productSlice'
import { CATEGORY_NAMES } from '../../config/categories'

function ArrowUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4.88 2.92L4.56 4.56L6.19 4.88" stroke="#24D059" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 11.08V4.67" stroke="#24D059" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.67 7L7 4.67L9.33 7" stroke="#24D059" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ArrowDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4.88 6.21L4.56 4.59L6.19 4.27" stroke="#FB3636" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 2.08L7 8.5" stroke="#FB3636" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.33 7L7 9.33L4.67 7" stroke="#FB3636" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function KebabIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="4.17" r="1.67" fill="#5F5F5F"/>
      <circle cx="10" cy="10" r="1.67" fill="#5F5F5F"/>
      <circle cx="10" cy="15.83" r="1.67" fill="#5F5F5F"/>
    </svg>
  )
}

function StatCard({ icon: Icon, label, value, iconColor, lineColor, lightColor, progressWidth, iconBgColor }) {
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
      {/* Vertical bar on left */}
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

      <div style={{ display: 'flex', gap: '0px', width: '100%', alignItems: 'center', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: progressWidth || 'auto' }}>
          <div style={{ flex: 1, height: '4px', background: lineColor, borderRadius: '2px 0 0 2px' }} />
        </div>
        <div style={{ width: '2px', height: '12px', background: lineColor, borderRadius: '1px' }} />
        <div style={{ flex: 1, height: '4px', background: lightColor, borderRadius: '0 2px 2px 0' }} />
      </div>
    </div>
  )
}

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
            product.status === 'Low Stock' ? 'status-low-stock' : 'status-out-of-stock'
          }`}>
            {product.status}
          </span>
        </div>
        <div className="product-card-body">
          <div className="product-card-name-text">{product.name}</div>
          <div className="product-card-sku">{product.sku}</div>
          <div className="product-card-price-container">
            <div className="product-card-price">₦{product.price.toLocaleString()}</div>
          </div>
          <div className="product-card-footer">
            <div className="product-card-reviews">
              <Star size={14} fill="#FFD700" />
              {product.reviews}
            </div>
            <div className="product-card-sold">
              {product.sold} sold
            </div>
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
        <img src={product.image} alt={product.name} className="product-cell-image-img" />
        <div className="product-cell-info">
          <div className="product-cell-name">{product.name}</div>
          <div className="product-cell-sku">{product.sku}</div>
        </div>
      </td>
      <td className="product-table-cell">{product.category}</td>
      <td className="product-table-cell product-cell-price">₦{product.price.toLocaleString()}</td>
      <td className="product-table-cell">{product.units}</td>
      <td className="product-table-cell">{product.sold}</td>
      <td className="product-table-cell product-cell-reviews">
        <Star size={12} fill="#FFD700" />
        {product.reviews}
      </td>
      <td className="product-table-cell">
        <span className={`product-cell-badge ${
          product.status === 'In Stock' ? 'badge-in-stock' :
          product.status === 'Low Stock' ? 'badge-low-stock' : 'badge-out-of-stock'
        }`}>
          {product.status}
        </span>
      </td>
      <td className="product-table-cell product-cell-actions">
        <Link to={`/products/${product.id}`} className="product-cell-action-btn view-btn">
          <Eye size={16} />
        </Link>
        <Link to={`/products/edit/${product.id}`} className="product-cell-action-btn edit-btn">
          <Edit size={16} />
        </Link>
        <button className="product-cell-action-btn delete-btn" onClick={() => onDelete(product.id)}>
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  )
}

export default function Products() {
  const dispatch = useDispatch()
  const { list: products, loading, error } = useSelector(s => s.products)
  
  const [view, setView] = useState('list')
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters] = useState({
    category: 'All',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
    condition: 'All',
    location: 'All'
  })
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterCategory, filters])
  const itemsPerPage = 8

  const categories = ['All', ...CATEGORY_NAMES]
  const locations = ['All', 'Ikeja, Lagos', 'Abuja, FCT', 'Port Harcourt, Rivers', 'Lekki, Lagos']
  const conditions = ['All', 'New', 'Used', 'OEM']

  const totalProducts = products.length
  const inStock = products.filter(p => p.status === 'In Stock').length
  const lowStock = products.filter(p => p.status === 'Low Stock').length
  const outOfStock = products.filter(p => p.status === 'Out of Stock').length
  const pct = (n) => (totalProducts ? Math.round((n / totalProducts) * 100) : 0)

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCategory = filterCategory === 'All' || p.category === filterCategory
    const matchAdvancedCat = filters.category === 'All' || p.category === filters.category
    const matchPrice = (!filters.priceMin || p.price >= Number(filters.priceMin)) && (!filters.priceMax || p.price <= Number(filters.priceMax))
    const matchCondition = filters.condition === 'All' || p.condition === filters.condition
    const matchLocation = filters.location === 'All' || p.location === filters.location
    const matchYear = (() => {
      if (!filters.yearMin && !filters.yearMax) return true
      const m = (p.year || '').match(/(\d{4})\s*-\s*(\d{4})/)
      if (!m) return true
      const from = Number(m[1])
      const to = Number(m[2])
      const min = filters.yearMin ? Number(filters.yearMin) : -Infinity
      const max = filters.yearMax ? Number(filters.yearMax) : Infinity
      return to >= min && from <= max
    })()
    return matchSearch && matchCategory && matchAdvancedCat && matchPrice && matchCondition && matchLocation && matchYear
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) dispatch(deleteProductThunk(id))
  }

  const clearFilters = () => {
    setFilters({
      category: 'All',
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
      condition: 'All',
      location: 'All'
    })
    setFilterCategory('All')
    setShowFilter(false)
  }

  return (
    <div className="products-page-container">
      {/* Page Header */}
      <div className="products-page-header">
        <div className="products-header-left">
          <h1 className="products-page-title">Products</h1>
        </div>
        <Link to="/products/add" className="products-add-btn">
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-stats-grid">
        <StatCard
          icon={Package}
          label="Total Products"
          value={totalProducts.toLocaleString()}
          iconColor="#FF7101"
          lineColor="#FF7101"
          lightColor="#FFD3B0"
          iconBgColor="#FFF5EB"
          progressWidth="100%"
        />
        <StatCard
          icon={Package}
          label="In Stock"
          value={inStock.toLocaleString()}
          iconColor="#7ED321"
          lineColor="#7ED321"
          lightColor="#D7F1BA"
          iconBgColor="#F2FCE4"
          progressWidth={`${pct(inStock)}%`}
        />
        <StatCard
          icon={Package}
          label="Low Stock"
          value={lowStock.toLocaleString()}
          iconColor="#FFCC00"
          lineColor="#FFCC00"
          lightColor="#FFEFB0"
          iconBgColor="#FFF9E6"
          progressWidth={`${pct(lowStock)}%`}
        />
        <StatCard
          icon={Package}
          label="Out of Stock"
          value={outOfStock.toLocaleString()}
          iconColor="#FF3B30"
          lineColor="#FF3B30"
          lightColor="#FFC2BF"
          iconBgColor="#FFEBEB"
          progressWidth={`${pct(outOfStock)}%`}
        />
      </div>

      {error && (
        <div className="error-banner">{error}</div>
      )}

      {loading && products.length === 0 && (
        <div className="loading-spinner-container"><div className="loading-spinner" /></div>
      )}

      {/* Main Content Layout */}
      <div className={`products-main-layout ${showFilter ? 'filter-open' : ''}`}>
        {/* Filter Sidebar */}
        {showFilter && (
          <div className="products-filter-sidebar">
            <div className="filter-sidebar-header">
              <h3 className="filter-sidebar-title">Filter</h3>
              <button className="filter-clear-all" onClick={clearFilters}>Clear All</button>
            </div>

            <div className="filter-section">
              <div className="filter-section-header">
                <SlidersHorizontal size={14} />
                <label className="filter-section-label">Category</label>
                <X size={14} className="filter-section-icon" />
              </div>
              <div className="filter-options">
                {categories.map(cat => (
                  <label key={cat} className="filter-option">
                    <input
                      type="radio"
                      name="filter-category"
                      checked={filters.category === cat}
                      onChange={() => setFilters({ ...filters, category: cat })}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-section-header">
                <SlidersHorizontal size={14} />
                <label className="filter-section-label">Price Range</label>
                <X size={14} className="filter-section-icon" />
              </div>
              <div className="price-range-inputs">
                <div className="price-input-group">
                  <span className="price-currency">₦</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                  />
                </div>
                <div className="price-input-group">
                  <span className="price-currency">₦</span>
                  <input
                    type="number"
                    placeholder="80000"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-section-header">
                <SlidersHorizontal size={14} />
                <label className="filter-section-label">Year Range</label>
                <X size={14} className="filter-section-icon" />
              </div>
              <div className="price-range-inputs">
                <input
                  type="text"
                  placeholder="Min"
                  value={filters.yearMin}
                  onChange={(e) => setFilters({ ...filters, yearMin: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Max"
                  value={filters.yearMax}
                  onChange={(e) => setFilters({ ...filters, yearMax: e.target.value })}
                />
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-section-header">
                <SlidersHorizontal size={14} />
                <label className="filter-section-label">Condition</label>
                <X size={14} className="filter-section-icon" />
              </div>
              <div className="filter-options">
                {conditions.map(cond => (
                  <label key={cond} className="filter-option">
                    <input
                      type="radio"
                      name="filter-condition"
                      checked={filters.condition === cond}
                      onChange={() => setFilters({ ...filters, condition: cond })}
                    />
                    <span>{cond}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-section-header">
                <SlidersHorizontal size={14} />
                <label className="filter-section-label">Location</label>
                <X size={14} className="filter-section-icon" />
              </div>
              <div className="filter-options">
                {locations.map(loc => (
                  <label key={loc} className="filter-option">
                    <input
                      type="radio"
                      name="filter-location"
                      checked={filters.location === loc}
                      onChange={() => setFilters({ ...filters, location: loc })}
                    />
                    <span>{loc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Content Area */}
        <div className="products-content">
          {/* Toolbar */}
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
              <button className="products-filter-btn" onClick={() => setShowFilter(!showFilter)}>
                <Filter size={18} />
                <span>Filter</span>
              </button>
            </div>
            <div className="products-toolbar-bottom">
              <div className="products-filter-tabs">
                {categories.map(c => (
                  <button
                    key={c}
                    className={`filter-tab ${filterCategory === c ? 'active' : ''}`}
                    onClick={() => setFilterCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="products-view-toggle">
                <button
                  className={`view-toggle-btn ${view === 'list' ? 'active' : ''}`}
                  onClick={() => setView('list')}
                >
                  <List size={18} />
                </button>
                <button
                  className={`view-toggle-btn ${view === 'grid' ? 'active' : ''}`}
                  onClick={() => setView('grid')}
                >
                  <Grid size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Products Display */}
          {view === 'grid' ? (
            <div className="products-grid-container">
              {paginatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
              {paginatedProducts.length === 0 && (
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
                      <th>Stock</th>
                      <th>Sold</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map(p => (
                      <ProductRowItem key={p.id} product={p} onDelete={handleDelete} />
                    ))}
                  </tbody>
                </table>
                {paginatedProducts.length === 0 && (
                  <div className="products-empty-state">No products found.</div>
                )}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="products-pagination">
              <div className="pagination-info">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
              </div>
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
