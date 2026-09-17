import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Package, ShoppingBag, ShoppingCart, Users, CircleDollarSign, Search, Filter, MapPin
} from 'lucide-react'
import { fetchDashboard } from '../features/dashboardSlice'
import StatCard from '../components/StatCard'
import ProductImage from '../components/products/ProductImage'
import RevenueChart from '../components/dashboard/RevenueChart'
import { formatNaira, koboToNaira } from '../config/constant'
import '../styles/dashboard.css'

const DASHBOARD_ICONS = {
  productsListed: Package,
  totalOrders: ShoppingCart,
  totalCustomers: Users,
  totalRevenue: CircleDollarSign,
}

export default function Dashboard() {
  const dispatch = useDispatch()
  const products = useSelector(state => state.products.list)
  const { overviewCardsMapped, revenueChart, productStatus, featuredProducts, topCustomers } = useSelector(state => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboard())
  }, [dispatch])

  const exploreProducts = featuredProducts.length > 0 ? featuredProducts : products.map(product => ({
    id: product.id, name: product.title, category: product.category.name, price: koboToNaira(product.priceKobo),
    image: product.primaryImageUrl, units: product.stockQty, status: product.status, compatibility: '',
  }))

  const totalProducts = Number(productStatus.totalProducts) || 0
  const inStock = Number(productStatus.inStock) || 0
  const lowStock = Number(productStatus.lowStock) || 0
  const outOfStock = Number(productStatus.outOfStock) || 0
  const stockSegments = [
    { label: 'In Stock', value: inStock, color: '#FF7101' },
    { label: 'Low Stock', value: lowStock, color: '#F2C900' },
    { label: 'Out of Stock', value: outOfStock, color: '#7ED321' },
  ]
  const stockTotal = inStock + lowStock + outOfStock

  return (
    <div className="dashboard-container">
      {/* Stats */}
      <div className="dashboard-stats-grid">
        {overviewCardsMapped.map((card) => (
          <StatCard
            key={card.key}
            icon={DASHBOARD_ICONS[card.key] || Package}
            variant="dashboard"
            iconVariant="tile"
            titleSize="14px"
            label={card.label}
            value={card.value}
            change={card.change}
            changeDown={card.changeDown}
            changeLabel={card.changeLabel}
            changeBelow
            iconColor="#5F5F5F"
            lineColor={card.lineColor}
            lightColor={card.lightColor}
            progressWidth={card.progressWidth}
          />
        ))}
      </div>

      {/* Main Content: 2 Column Layout */}
      <div className="dashboard-main-grid">
        {/* Left Column */}
        <div className="dashboard-main-column">
          {/* Revenue Chart */}
          <RevenueChart data={revenueChart} />

          {/* Explore Your Products */}
          <div className="card dashboard-card">
            <div className="dashboard-card-header">
              <div className="dashboard-card-title">Explore Your Products</div>
              <div className="products-header-right">
                <div className="search-bar">
                  <Search size={14} />
                  <input placeholder="Search..." />
                </div>
                <button className="filter-btn">
                  <Filter size={14} />
                </button>
              </div>
            </div>
            <div className="products-grid">
              {exploreProducts.slice(0, 3).map((product) => (
                <Link 
                  key={product.id} 
                  to={`/products/${product.id}`} 
                  className="product-card-link"
                >
                  <div className="product-card">
                    <div className="product-card-image">
                      <ProductImage src={product.image} alt={product.name} className="catalog-dashboard-image" />
                    </div>
                    <div className="product-card-content">
                      <div className="product-card-name">
                        {product.name}
                      </div>
                      <div className="product-card-location">
                        <MapPin size={12} />
                        {product.location}
                      </div>
                      <div className="product-card-price">
                        {formatNaira(product.price)}
                      </div>
                      <div className="product-card-tags">
                        <span className="product-tag">
                          <Package size={10} />
                          {product.category}
                        </span>
                        <span className="product-tag">
                          <ShoppingBag size={10} />
                          {product.units} Units
                        </span>
                        <span className="product-tag">
                          <Package size={10} />
                          {product.compatibility}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-main-column">
          {/* Total Products Chart */}
          <div className="card dashboard-card dashboard-stock-card">
            <div className="dashboard-card-header">
              <div className="dashboard-card-title">Total Products</div>
            </div>

            {/* Colorful Bars */}
            <div className="dashboard-stock-bars" aria-hidden="true">
              {Array.from({ length: 26 }, (_, i) => {
                const position = (i + 0.5) / 26 * stockTotal
                const color = stockTotal === 0 ? '#EAEAEA' : position < inStock ? stockSegments[0].color
                  : position < inStock + lowStock ? stockSegments[1].color : stockSegments[2].color
                return <div key={i} style={{ backgroundColor: color }} />
              })}
            </div>

            <div className="products-count">{totalProducts.toLocaleString()}</div>
            <div className="products-label">Total Products</div>

            {/* Stock Status */}
            <div className="stock-status">
              {stockSegments.map(item => (
                <div key={item.label} className="stock-item">
                  <div className="stock-item-left">
                    <div className="stock-dot" style={{ borderColor: item.color }} />
                    <span>{item.label}</span>
                  </div>
                  <span className="stock-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agent List */}
          <div className="card dashboard-card">
            <div className="dashboard-card-header">
              <div className="dashboard-card-title">Agent List</div>
              <div className="agent-details">Details</div>
            </div>
            <div className="agents-list">
              {topCustomers.map(agent => (
                <div key={agent.id} className="agent-item">
                  <img 
                    src={agent.avatar} 
                    alt={agent.name} 
                    className="agent-avatar"
                  />
                  <div className="agent-info">
                    <div className="agent-name">
                      {agent.name}
                    </div>
                    <div className="agent-stats">
                      {agent.itemsSold} Sold, {agent.itemsRented} Rent
                    </div>
                  </div>
                  <div className="agent-sales">
                    ₦{agent.sales.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
