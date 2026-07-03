import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import {
  Package, ShoppingBag, Users, TrendingUp, Sun, MoreVertical, Search, Filter, MapPin
} from 'lucide-react'
import {
  monthlyRevenueData, stockBreakdown, topAgents, currentUser, initialProducts
} from '../utils/mockData'

function StatCard({ icon: Icon, label, value, change, changeDown, color }) {
  return (
    <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '8px', 
            background: `rgba(${color}, 0.1)`, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Icon size={18} color={`rgb(${color})`} />
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
        </div>
        <MoreVertical size={16} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px', 
          fontSize: '0.75rem', 
          color: changeDown ? 'var(--danger)' : 'var(--success)', 
          fontWeight: 600,
          background: changeDown ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          padding: '4px 8px',
          borderRadius: '6px'
        }}>
          <TrendingUp size={12} style={{ transform: changeDown ? 'rotate(180deg)' : 'none' }} />
          {change}
        </div>
      </div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Since last week</div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        background: 'var(--text-primary)', 
        color: '#fff', 
        padding: '8px 12px', 
        borderRadius: '8px', 
        fontSize: '0.75rem',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '4px' }}>₦{payload[0].value.toLocaleString()}</div>
        <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>{label} 23, 2026</div>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const products = initialProducts

  return (
    <div className="dashboard-container">
      {/* Greeting */}
      <div className="dashboard-greeting">
        <Sun size={20} style={{ color: '#FFA500' }} />
        <h2>Good Morning, {currentUser.name}!</h2>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          icon={Package}
          label="Products Listed"
          value="1,324"
          change="+12%"
          color="249, 115, 22"
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value="725"
          change="+12%"
          color="16, 185, 129"
        />
        <StatCard
          icon={Users}
          label="Total Customers"
          value="2,648"
          change="+23%"
          color="59, 130, 246"
        />
        <StatCard
          icon={Package}
          label="Total Revenue"
          value="₦5.2M"
          change="-03%"
          changeDown
          color="245, 158, 11"
        />
      </div>

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
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyRevenueData} barSize={24}>
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
                  fill={entry.active ? '#FF6B00' : 'url(#stripePattern)'} 
                />
              ))}
            </Bar>
            <defs>
              <pattern id="stripePattern" patternUnits="userSpaceOnUse" width="8" height="8">
                <rect width="8" height="8" fill="rgba(255, 107, 0, 0.2)" />
                <line x1="0" y1="0" x2="8" y2="8" stroke="rgba(255, 107, 0, 0.4)" strokeWidth="1" />
              </pattern>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

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
  )
}
