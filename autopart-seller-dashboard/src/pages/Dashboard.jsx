import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import {
  Package, ShoppingBag, Search, Filter, MapPin
} from 'lucide-react'
import { fetchDashboard } from '../features/dashboardSlice'
import StatCard from '../components/StatCard'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        background: '#fff', 
        color: 'var(--text-primary)', 
        padding: '12px 16px', 
        borderRadius: '10px', 
        fontSize: '0.8rem',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ fontWeight: 700, marginBottom: '4px' }}>₦{payload[0].value.toLocaleString()}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{label}</div>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const dispatch = useDispatch()
  const products = useSelector(state => state.products.list)
  const { overviewCardsMapped, revenueChart, productStatus, featuredProducts, topCustomers, loading } = useSelector(state => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboard())
  }, [dispatch])

  const exploreProducts = featuredProducts.length > 0 ? featuredProducts : products

  const totalProducts = Number(productStatus.totalProducts) || 0
  const inStock = Number(productStatus.inStock) || 0
  const lowStock = Number(productStatus.lowStock) || 0
  const outOfStock = Number(productStatus.outOfStock) || 0

  return (
    <div className="dashboard-container">
      {/* Stats */}
      <div className="dashboard-stats-grid">
        {overviewCardsMapped.map((card) => (
          <StatCard
            key={card.key}
            icon={card.icon}
            label={card.label}
            value={card.value}
            change={card.change}
            changeDown={card.changeDown}
            changeLabel={card.changeLabel}
            iconColor={card.iconColor}
            lineColor={card.lineColor}
            lightColor={card.lightColor}
            progressWidth={card.progressWidth}
          />
        ))}
      </div>

      {/* Main Content: 2 Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Revenue Chart */}
          <div className="card dashboard-card">
            <div className="dashboard-card-header">
              <div className="dashboard-card-title">Total Revenue</div>
              <div className="dashboard-card-select">
                <select>
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Daily</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueChart} barSize={32} barGap={8}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${Math.round(v/1000)}K` : v}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {revenueChart.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={entry.active ? '#FF7101' : 'url(#stripePattern)'} 
                    />
                  ))}
                </Bar>
                <defs>
                  <pattern id="stripePattern" patternUnits="userSpaceOnUse" width="8" height="8">
                    <rect width="8" height="8" fill="rgba(255, 113, 1, 0.2)" />
                    <line x1="0" y1="0" x2="8" y2="8" stroke="rgba(255, 113, 1, 0.4)" strokeWidth="1" />
                  </pattern>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

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
                      <img 
                        src={product.image} 
                        alt={product.name} 
                      />
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
                        ₦{product.price.toLocaleString()}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Total Products Chart */}
          <div className="card dashboard-card">
            <div className="dashboard-card-header">
              <div className="dashboard-card-title">Total Products</div>
              <select className="dashboard-card-select">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>

            {/* Colorful Bars */}
            <div className="colorful-bars">
              {Array.from({ length: 20 }, (_, i) => {
                let cls = 'colorful-bar bar-orange'
                if (totalProducts > 0) {
                  const inStockBars = Math.round((inStock / Math.max(totalProducts, inStock + lowStock + outOfStock)) * 20)
                  const lowStockBars = Math.round((lowStock / Math.max(totalProducts, inStock + lowStock + outOfStock)) * 20)
                  if (i < lowStockBars) cls = 'colorful-bar bar-yellow'
                  else if (i < lowStockBars + inStockBars) cls = 'colorful-bar bar-green'
                  else cls = 'colorful-bar bar-light-orange'
                }
                return <div key={i} className={cls} />
              })}
            </div>

            <div className="products-count">{totalProducts.toLocaleString()}</div>
            <div className="products-label">Total Products</div>

            {/* Stock Status */}
            <div className="stock-status">
              {[
                { label: 'In Stock', value: inStock, color: '#32CD32' },
                { label: 'Low Stock', value: lowStock, color: '#FFD700' },
                { label: 'Out of Stock', value: outOfStock, color: '#FF6B00' }
              ].map(item => (
                <div key={item.label} className="stock-item">
                  <div className="stock-item-left">
                    <div className="stock-dot" style={{ background: item.color }} />
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
