import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import {
  Package, ShoppingBag, Users, Search, Filter, MapPin, DollarSign
} from 'lucide-react'
import {
  monthlyRevenueData, stockBreakdown, topAgents, currentUser
} from '../utils/mockData'
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
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{label} 23, 2026</div>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const products = useSelector(state => state.products.list)

  return (
    <div className="dashboard-container">
      {/* Stats */}
      <div className="dashboard-stats-grid">
        <StatCard
          icon={Package}
          label="Products Listed"
          value="1,324"
          change="+12%"
          iconColor="#FF7101"
          lineColor="#FF7101"
          lightColor="#FFD3B0"
          progressWidth="47%"
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value="725"
          change="+12%"
          iconColor="#7ED321"
          lineColor="#7ED321"
          lightColor="#D7F1BA"
          progressWidth="26%"
        />
        <StatCard
          icon={Users}
          label="Total Customers"
          value="2,648"
          change="+23%"
          iconColor="#007AFF"
          lineColor="#007AFF"
          lightColor="#B0D6FF"
          progressWidth="79%"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value="₦5.2M"
          change="-03%"
          changeDown
          iconColor="#FFCC00"
          lineColor="#FFCC00"
          lightColor="#FFEFB0"
          progressWidth="13%"
        />
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
              <BarChart data={monthlyRevenueData} barSize={32} barGap={8}>
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
                  tickFormatter={v => `${v/1000}00K`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {monthlyRevenueData.map((entry, index) => (
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
              {products.slice(0, 3).map((product) => (
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
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className={`colorful-bar bar-${i < 5 ? 'orange' : i < 10 ? 'light-orange' : i < 15 ? 'yellow' : 'green'}`}
                />
              ))}
            </div>

            <div className="products-count">780</div>
            <div className="products-label">Total Products</div>

            {/* Stock Status */}
            <div className="stock-status">
              {[
                { label: 'In Stock', value: 520, color: '#32CD32' },
                { label: 'Low Stock', value: 180, color: '#FFD700' },
                { label: 'Out of Stock', value: 80, color: '#FF6B00' }
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
              {topAgents.map(agent => (
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
