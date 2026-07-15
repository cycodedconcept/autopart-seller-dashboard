import { useState } from 'react'
import {
  LineChart, Line, Area, AreaChart, ComposedChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts'
import {
  Building2, Users, Banknote, TrendingUp, ChevronDown, Calendar,
  Eye, Pencil, Trash2,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import {
  salesAnalyticData, salesSummaryData, totalRevenueBarData, latestTransactions,
} from '../utils/mockData'

// ── Figma-style filter button ──────────────────────────────────────────────
function ChartFilter({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '8px 12px',
          background: '#FFFFFF',
          border: '1px solid #F0F0F0',
          boxShadow: '0px 1px 2px rgba(82,88,102,0.06)',
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <Calendar size={14} color="#5F5F5F" />
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#5F5F5F' }}>{value}</span>
        <ChevronDown size={14} color="#5F5F5F" />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0,
          background: '#fff', border: '1px solid #F0F0F0',
          borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          zIndex: 50, minWidth: '110px', overflow: 'hidden',
        }}>
          {options.map(o => (
            <button
              key={o}
              onClick={() => { onChange(o); setOpen(false) }}
              style={{
                display: 'block', width: '100%', padding: '8px 14px',
                textAlign: 'left', background: o === value ? '#FFF4EE' : 'transparent',
                border: 'none', cursor: 'pointer', fontSize: '12px',
                fontWeight: o === value ? 600 : 400,
                color: o === value ? '#FF7101' : '#5F5F5F',
                fontFamily: 'inherit',
              }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Line chart tooltip — Figma floating card style ─────────────────────────
function LineTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  // Show Income on top, Expenses below — filter out the bg bar entry
  const filtered = payload.filter(p => p.name === 'Income' || p.name === 'Expenses')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', pointerEvents: 'none' }}>
      {filtered.map(p => (
        <div
          key={p.dataKey}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#FFFFFF',
            padding: '8px 12px',
            borderRadius: '4px',
            boxShadow: '0px 0px 16px rgba(0,0,0,0.06), 0px 14px 46px rgba(0,0,0,0.12)',
            fontSize: '12px', color: '#0E0E0C', whiteSpace: 'nowrap',
          }}
        >
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: '#FFFFFF', boxShadow: '0px 1px 4px rgba(0,0,0,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.color }} />
          </div>
          <span>{p.name}: {Math.round(p.value / 1000)}K</span>
        </div>
      ))}
    </div>
  )
}

// ── Background column bars custom shape ───────────────────────────────────
function BgBars(props) {
  const { x, y, width, height } = props
  const bw = Math.max(4, width * 0.18)
  const gap = (width - bw * 3) / 4
  const bars = [
    { h: height * 0.58, x: gap },
    { h: height * 0.26, x: gap * 2 + bw },
    { h: height * 0.10, x: gap * 3 + bw * 2 },
  ]
  return (
    <g>
      {bars.map((b, i) => (
        <rect
          key={i}
          x={x + b.x}
          y={y + height - b.h}
          width={bw}
          height={b.h}
          fill="#F0F0F0"
          opacity={0.6}
          rx={2}
        />
      ))}
    </g>
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

const DONUT_COLORS = ['#B7D57B', '#FB3636', '#24D059', '#F5A405']

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
          icon={Building2}
          label="No. of Products"
          value="5,536"
          change="+15.5%"
          gradient="linear-gradient(178.98deg, #EEFBD5 -100.51%, #FFFFFF 57.23%)"
          variant="analytics"
        />
        <StatCard
          icon={Users}
          label="Regi. Agents"
          value="746"
          change="-02.8%"
          changeDown
          gradient="linear-gradient(178.98deg, #D3F6DE -100.51%, #FFFFFF 57.23%)"
          variant="analytics"
        />
        <StatCard
          icon={Banknote}
          label="Total Revenue"
          value="₦2,748"
          change="+21.6%"
          gradient="linear-gradient(178.98deg, #FED7D7 -100.51%, #FFFFFF 57.23%)"
          variant="analytics"
        />
        <StatCard
          icon={TrendingUp}
          label="Target This Month"
          value="435"
          change="-09.4%"
          changeDown
          gradient="linear-gradient(178.98deg, #D2E6FE -100.51%, #FFFFFF 57.23%)"
          variant="analytics"
        />
      </div>

      <div className="an-row-2">
        <div className="an-chart-card">
          <div className="an-chart-header">
            <div style={{ fontSize: '18px', fontWeight: 500, color: '#0E0E0C' }}>Sales Analytic</div>
            <ChartFilter
              value={analyticFilter}
              onChange={setAnalyticFilter}
              options={['Monthly', 'Yearly', 'Weekly']}
            />
          </div>

          <ResponsiveContainer width="100%" height={252}>
            <ComposedChart data={salesAnalyticData} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F5A405" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#F5A405" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B7D57B" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#B7D57B" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                tick={{ fill: '#5F5F5F', fontSize: 11, opacity: 0.6 }}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />
              <YAxis
                tick={{ fill: '#5F5F5F', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[10000, 20000]}
                ticks={[10000, 12000, 14000, 16000, 18000, 20000]}
                tickFormatter={v => `${v / 1000}K`}
                width={32}
              />
              <Tooltip
                content={<LineTooltip />}
                cursor={{ stroke: '#0E0E0C', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              {/* Decorative background bars per month column */}
              <Bar dataKey="income" shape={<BgBars />} isAnimationActive={false} legendType="none" tooltipType="none" />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#F5A405"
                strokeWidth={2}
                fill="url(#incomeGrad)"
                dot={false}
                activeDot={{ r: 5, fill: '#F5A405', stroke: '#fff', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="Expenses"
                stroke="#B7D57B"
                strokeWidth={2}
                fill="url(#expenseGrad)"
                dot={false}
                activeDot={{ r: 5, fill: '#B7D57B', stroke: '#fff', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="an-chart-card">
          <div className="an-chart-header">
            <div style={{ fontSize: '18px', fontWeight: 500, color: '#0E0E0C' }}>Sales Summary</div>
            <ChartFilter
              value={summaryFilter}
              onChange={setSummaryFilter}
              options={['Monthly', 'Yearly', 'Weekly']}
            />
          </div>

          <div style={{ position: 'relative', height: 208, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width={208} height={208}>
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={salesSummaryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={100}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={6}
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

          {/* Legend — 2×2 grid, inline row per item */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px 8px',
            marginTop: '16px',
          }}>
            {salesSummaryData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '100px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: DONUT_COLORS[i], flexShrink: 0 }} />
                <span style={{ fontSize: '12px', fontWeight: 400, color: '#5F5F5F' }}>{d.name}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0E0E0C' }}>₦{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="an-row-3">
        <div className="an-chart-card">
          <div className="an-chart-header">
            <div style={{ fontSize: '18px', fontWeight: 500, color: '#0E0E0C' }}>Most Sales Location</div>
            <ChartFilter
              value={mapFilter}
              onChange={setMapFilter}
              options={['Nigeria', 'Global', 'Asia']}
            />
          </div>
          <NigeriaMap />
        </div>

        <div className="an-chart-card">
          <div className="an-chart-header">
            <div style={{ fontSize: '18px', fontWeight: 500, color: '#0E0E0C' }}>Total Revenue</div>
            <ChartFilter
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
          <div className="section-title" style={{ fontSize: '18px', fontWeight: 500, color: '#0E0E0C' }}>Latest Transaction</div>
          <ChartFilter value="Monthly" onChange={() => {}} options={['Monthly', 'Yearly']} />
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
