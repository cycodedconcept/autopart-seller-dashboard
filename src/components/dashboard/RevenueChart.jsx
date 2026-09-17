import { useId, useState } from 'react'
import PropTypes from 'prop-types'
import { CalendarDays } from 'lucide-react'
import { BarChart, Bar, CartesianGrid, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatNaira } from '../../config/constant'

const RevenuePointType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  revenue: PropTypes.number.isRequired,
  active: PropTypes.bool,
  periodLabel: PropTypes.string,
})

function RevenueBar({ x, y, width, height, payload, patternId, highlighted, hoveredMonth }) {
  if (!height || !width) return null
  const selected = highlighted || (!hoveredMonth && payload?.active)
  return <g className="dashboard-revenue-bar">
    <Rectangle x={x} y={y} width={width} height={height} radius={[5, 5, 0, 0]}
      fill={selected ? '#FF7101' : `url(#${patternId})`} />
    <circle cx={x + width / 2} cy={y + 3} r={4} fill="#FF7101" stroke="#FFFFFF" strokeWidth={1.5} />
  </g>
}
RevenueBar.propTypes = {
  x: PropTypes.number, y: PropTypes.number, width: PropTypes.number, height: PropTypes.number,
  payload: RevenuePointType, patternId: PropTypes.string.isRequired, highlighted: PropTypes.bool, hoveredMonth: PropTypes.string,
}

function RevenueTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return <div className="dashboard-revenue-tooltip">
    <strong>{formatNaira(point.revenue)}</strong>
    <span>{point.periodLabel || point.name}</span>
  </div>
}
RevenueTooltip.propTypes = { active: PropTypes.bool, payload: PropTypes.arrayOf(PropTypes.shape({ payload: RevenuePointType })) }

export default function RevenueChart({ data }) {
  const patternId = 'dashboard-revenue-stripes-' + useId().replace(/:/g, '')
  const [hoveredMonth, setHoveredMonth] = useState(null)
  return <section className="card dashboard-card dashboard-revenue-card" aria-label="Monthly revenue">
    <div className="dashboard-card-header">
      <h2 className="dashboard-card-title">Total Revenue</h2>
      <span className="dashboard-period"><CalendarDays size={14} aria-hidden="true" />Monthly</span>
    </div>
    {data.length === 0 ? <div className="dashboard-chart-empty">No revenue data available.</div>
      : <div className="dashboard-revenue-plot">
        <div className="dashboard-revenue-canvas">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 16, right: 6, bottom: 0, left: 0 }} barCategoryGap="24%" accessibilityLayer
              onMouseMove={state => setHoveredMonth(state?.activeLabel || null)} onMouseLeave={() => setHoveredMonth(null)}>
              <defs>
                <pattern id={patternId} patternUnits="userSpaceOnUse" width={4} height={4}>
                  <rect width={4} height={4} fill="#FFF9F4" />
                  <path d="M-1,-1 L5,5 M3,-1 L5,1 M-1,3 L1,5" stroke="#FF7101" strokeWidth={1} />
                </pattern>
              </defs>
              <CartesianGrid vertical={false} stroke="#E9E9E9" strokeDasharray="3 4" />
              <XAxis dataKey="name" tick={{ fill: '#777777', fontSize: 12 }} axisLine={false} tickLine={false} tickMargin={10} interval={0} height={30} />
              <YAxis tick={{ fill: '#777777', fontSize: 12 }} axisLine={false} tickLine={false} width={44} tickCount={5}
                tickFormatter={value => value >= 1000000 ? `${Number((value / 1000000).toFixed(1))}M` : value >= 1000 ? `${Number((value / 1000).toFixed(1))}k` : value} />
              <Tooltip content={<RevenueTooltip />} cursor={false} offset={12} />
              <Bar dataKey="revenue" maxBarSize={34} isAnimationActive={false}
                shape={<RevenueBar patternId={patternId} hoveredMonth={hoveredMonth} />} activeBar={<RevenueBar patternId={patternId} highlighted />} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>}
  </section>
}
RevenueChart.propTypes = { data: PropTypes.arrayOf(RevenuePointType).isRequired }
