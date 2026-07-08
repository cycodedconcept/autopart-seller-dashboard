import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts'
import {
  Package, Users, DollarSign, Target, ChevronDown,
  Eye, Pencil, Trash2,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import {
  salesAnalyticData, salesSummaryData, totalRevenueBarData, latestTransactions,
} from '../utils/mockData'

function FilterSelect({ value, onChange, options }) {
  return (
    <div className="an-filter-wrap">
      <select
        className="an-filter-select"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} className="an-filter-arrow" />
    </div>
  )
}

function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="an-tooltip">
      <div className="an-tooltip-label">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="an-tooltip-row">
          <span className="an-tooltip-dot" style={{ background: p.color }} />
          <span>{p.name}: ₦{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((acc, p) => acc + (p.value || 0), 0)
  return (
    <div className="an-tooltip">
      <div className="an-tooltip-label">{label}</div>
      <div style={{ fontWeight: 700, color: 'var(--brand)', fontSize: '0.9rem', marginTop: 4 }}>
        ₦{total.toLocaleString()}.00
      </div>
    </div>
  )
}

const CITY_MARKERS = [
  { city: 'Lagos',         amount: 23231, x: 80,  y: 180, color: '#FF7101' },
  { city: 'Abuja',         amount: 12091, x: 320, y: 120, color: '#EF4444' },
  { city: 'Port Harcourt', amount: 17321, x: 560, y: 150, color: '#F5A623' },
  { city: 'Kano',          amount: 19534, x: 480, y: 220, color: '#1FAA59' },
  { city: 'Ibadan',        amount: 15213, x: 180, y: 260, color: '#3B82F6' },
]

function NigeriaMap() {
  return (
    <div className="an-map-wrap">
      <div className="an-map-container" style={{ position: 'relative', width: '100%', height: '290px' }}>
        <img
          src="/Map.png"
          alt="World Map"
          className="an-map-background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />

        {/* City Markers */}
        {CITY_MARKERS.map(c => (
          <div
            key={c.city}
            className="an-city-marker"
            style={{
              position: 'absolute',
              left: `${(c.x / 700) * 100}%`,
              top: `${(c.y / 350) * 100}%`,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {/* Tooltip Card */}
            <div
              className="an-city-tooltip"
              style={{
                background: 'white',
                padding: '8px 12px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center',
                border: `2px solid ${c.color}`,
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{c.city}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: c.color }}>₦{c.amount.toLocaleString()}.00</div>
            </div>

            {/* Connector Line */}
            <div
              className="an-city-connector"
              style={{
                width: '2px',
                height: '16px',
                background: c.color,
                opacity: 0.8,
              }}
            />

            {/* Dot */}
            <div
              className="an-city-dot"
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: c.color,
                boxShadow: `0 0 0 4px ${c.color}33`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="an-city-strip">
        {CITY_MARKERS.map(c => (
          <div key={c.city} className="an-city-chip" style={{ background: c.color }}>
            <div className="an-city-chip-name">{c.city}</div>
            <div className="an-city-chip-amt">₦{c.amount.toLocaleString()}.00</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const DONUT_COLORS = ['#1FAA59', '#EF4444', '#F5A623', '#3B82F6']

const STATUS_CLS = {
  Completed: 'badge-green',
  Cancel:    'badge-red',
  Pending:   'badge-yellow',
}

export default function Analytics() {
  const [analyticFilter, setAnalyticFilter] = useState('Monthly')
  const [summaryFilter, setSummaryFilter] = useState('Monthly')
  const [mapFilter, setMapFilter] = useState('Nigeria')
  const [revFilter, setRevFilter] = useState('Monthly')

  return (
    <div className="analytics-page">
      <div className="dashboard-stats-grid">
        <StatCard
          icon={Package}
          label="No. of Products"
          value="5,536"
          change="+15.5%"
          iconColor="#FF7101"
          lineColor="#FF7101"
          lightColor="#FFD3B0"
          progressWidth="65%"
        />
        <StatCard
          icon={Users}
          label="Reg. Agents"
          value="746"
          change="-02.8%"
          changeDown
          iconColor="#3B82F6"
          lineColor="#3B82F6"
          lightColor="#DBEAFE"
          progressWidth="20%"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value="₦2,748"
          change="+21.6%"
          iconColor="#10B981"
          lineColor="#10B981"
          lightColor="#DCFCE7"
          progressWidth="55%"
        />
        <StatCard
          icon={Target}
          label="Target This Month"
          value="435"
          change="-09.4%"
          changeDown
          iconColor="#F59E0B"
          lineColor="#F59E0B"
          lightColor="#FEF3C7"
          progressWidth="15%"
        />
      </div>

      <div className="an-row-2">
        <div className="card an-chart-card">
          <div className="an-chart-header">
            <div className="section-title">Sales Analytic</div>
            <FilterSelect
              value={analyticFilter}
              onChange={setAnalyticFilter}
              options={['Monthly', 'Yearly', 'Weekly']}
            />
          </div>

          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={salesAnalyticData} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                domain={[10000, 20000]}
                ticks={[10000, 12000, 14000, 16000, 18000, 20000]}
                tickFormatter={v => `${v / 1000}K`}
              />
              <Tooltip content={<LineTooltip />} />
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#FF7101"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#FF7101', strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#1FAA59"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#1FAA59', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="an-line-legend">
            <span className="an-legend-dot" style={{ background: '#FF7101' }} />
            <span>Income 19K</span>
            <span className="an-legend-dot" style={{ background: '#1FAA59', marginLeft: 12 }} />
            <span>Expense 17K</span>
          </div>
        </div>

        <div className="card an-chart-card">
          <div className="an-chart-header">
            <div className="section-title">Sales Summary</div>
            <FilterSelect
              value={summaryFilter}
              onChange={setSummaryFilter}
              options={['Monthly', 'Yearly', 'Weekly']}
            />
          </div>

          <div style={{ position: 'relative', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={salesSummaryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={3}
                  stroke="#fff"
                >
                  {salesSummaryData.map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="an-donut-center">
              <div className="an-donut-pct">86%</div>
              <div className="an-donut-sub">Total Sales<br />Summary</div>
            </div>
          </div>

          <div className="an-donut-legend">
            {salesSummaryData.map((d, i) => (
              <div key={d.name} className="an-donut-legend-item">
                <span className="an-legend-dot" style={{ background: DONUT_COLORS[i] }} />
                <div>
                  <div className="an-legend-name">{d.name}</div>
                  <div className="an-legend-val" style={{ color: DONUT_COLORS[i] }}>
                    ₦{d.value.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="an-row-3">
        <div className="card an-chart-card">
          <div className="an-chart-header">
            <div className="section-title">Most Sales Location</div>
            <FilterSelect
              value={mapFilter}
              onChange={setMapFilter}
              options={['Nigeria', 'Global', 'Asia']}
            />
          </div>
          <NigeriaMap />
        </div>

        <div className="card an-chart-card">
          <div className="an-chart-header">
            <div className="section-title">Total Revenue</div>
            <FilterSelect
              value={revFilter}
              onChange={setRevFilter}
              options={['Monthly', 'Yearly', 'Weekly']}
            />
          </div>

          <ResponsiveContainer width="100%" height={290}>
            <BarChart data={totalRevenueBarData} barSize={22} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="month"
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => (v === 0 ? '0' : `${(v / 1000).toFixed(0)}K`)}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />

              <Bar dataKey="a" stackId="rev" name="Sold">
                {totalRevenueBarData.map((e, i) => (
                  <Cell key={i} fill={e.active ? '#FF7101' : 'rgba(255,113,1,0.2)'} />
                ))}
              </Bar>

              <Bar dataKey="b" stackId="rev" name="Rented">
                {totalRevenueBarData.map((e, i) => (
                  <Cell key={i} fill={e.active ? '#F5A623' : 'rgba(245,166,35,0.2)'} />
                ))}
              </Bar>

              <Bar dataKey="c" stackId="rev" name="Income" radius={[4, 4, 0, 0]}>
                {totalRevenueBarData.map((e, i) => (
                  <Cell key={i} fill={e.active ? '#3B82F6' : 'rgba(59,130,246,0.2)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="an-chart-header">
          <div className="section-title">Latest Transaction</div>
          <FilterSelect value="Monthly" onChange={() => {}} options={['Monthly', 'Yearly']} />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Transactions ID</th>
                <th>Customer Name</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th>Invested Property</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {latestTransactions.map(txn => (
                <tr key={txn.id}>
                  <td>
                    <span className="font-600 color-brand">{txn.id}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-8">
                      <img
                        src={txn.avatar}
                        alt={txn.customerName}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                      <span>{txn.customerName}</span>
                    </div>
                  </td>
                  <td className="font-600">₦{txn.amount.toLocaleString()}</td>
                  <td className="color-muted">{txn.date}</td>
                  <td>{txn.paymentMethod}</td>
                  <td>{txn.location}</td>
                  <td>
                    <span className={`badge ${STATUS_CLS[txn.status] || 'badge-gray'}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center" style={{ gap: 5 }}>
                      <button className="an-act-btn" title="View">
                        <Eye size={13} />
                      </button>
                      <button className="an-act-btn" title="Edit">
                        <Pencil size={13} />
                      </button>
                      <button className="an-act-btn danger" title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
