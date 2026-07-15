
function ArrowUp({ color }) {
  const c = color || '#24D059'
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4.88 2.92L4.56 4.56L6.19 4.88" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 11.08V4.67" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.67 7L7 4.67L9.33 7" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ArrowDown({ color }) {
  const c = color || '#FB3636'
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4.88 6.21L4.56 4.59L6.19 4.27" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 2.08L7 8.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.33 7L7 9.33L4.67 7" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function KebabIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="4.17" r="1.67" fill="#6B7280"/>
      <circle cx="10" cy="10" r="1.67" fill="#6B7280"/>
      <circle cx="10" cy="15.83" r="1.67" fill="#6B7280"/>
    </svg>
  )
}

const VALUE_SIZES = {
  large: { size: '38px', line: '1.1' },
  default: { size: '24px', line: '34px' },
  small: { size: '20px', line: '28px' },
}

export default function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  changeDown, 
  iconColor, 
  lineColor, 
  lightColor, 
  progressWidth,
  showKebab = true,
  showChange = true,
  customMiddle,
  customChange,
  valueSize,
  changeBelow,
  graph,
  variant = 'default',
  titleSize,
  iconVariant = 'soft',
  changeLabel,
  progress,
  gradient,
}) {
  const isAnalytics = variant === 'analytics'
  const pWidth = progress || progressWidth

  const resolveValue = () => {
    if (!valueSize) return isAnalytics ? { size: '40px', line: 1 } : VALUE_SIZES.default
    if (valueSize in VALUE_SIZES) return VALUE_SIZES[valueSize]
    return { size: valueSize, line: valueSize === '31px' ? '1.1' : valueSize === '32px' ? '42px' : valueSize === '40px' ? '44px' : '34px' }
  }

  const vStyle = resolveValue()

  // ── Analytics variant: fully separate render path ──
  if (isAnalytics) {
    const changeColor = changeDown ? '#FB3636' : '#24D059'
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        gap: '10px',
        minHeight: '145px',
        borderRadius: '12px',
        background: gradient || '#FFFFFF',
        border: '1px solid #F0F0F0',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
      }}>
        {/* Top — icon + label */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '80px',
            background: '#FFFFFF',
            border: '1px solid #F0F0F0',
            boxShadow: '0px 2px 19px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={20} color="#5F5F5F" />
          </div>
          <span style={{ fontSize: titleSize || '16px', fontWeight: 500, color: '#5F5F5F', lineHeight: '20px' }}>{label}</span>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#F0F0F0', width: '100%' }} />

        {/* Value row — value left, change stacked right */}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#0E0E0C', fontSize: '24px', fontWeight: 700, lineHeight: '34px' }}>
            {value}
          </div>
          {customChange || (showChange && change && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: changeColor, lineHeight: '18px' }}>
                {change}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 400, color: '#5F5F5F', lineHeight: '16px' }}>
                {changeLabel || 'last month'}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Default / non-analytics render path (unchanged) ──
  const iconContainer = () => {
    if (iconVariant === 'outlined') {
      return {
        width: '44px',
        height: '44px',
        background: '#FFFFFF',
        borderRadius: '50%',
        border: '1px solid #F1F3F5',
        boxShadow: '0 2px 8px rgba(15,23,42,.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    }
    return {
      padding: '10px',
      background: `${lightColor}03`,
      borderRadius: '50%',
      border: `1px solid ${lightColor}12`,
      boxShadow: '0 2px 6px rgba(16,24,40,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  }

  const iconStyle = iconContainer()
  const cardGap = graph ? '14px' : (changeBelow ? '10px' : '14px')
  const colGap = graph ? '4px' : (changeBelow ? '10px' : '14px')

  return (
    <div className="card dashboard-stat-card" style={{ 
      padding: graph ? '18px 6px 18px 16px' : '20px 22px',
      display: 'flex', 
      flexDirection: graph ? 'row' : 'column', 
      gap: cardGap,
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '18px',
      boxShadow: '0 1px 3px rgba(15,23,42,.03), 0 6px 18px rgba(15,23,42,.03)'
    }}>
      <div style={{ 
        flex: graph ? 1 : undefined,
        display: 'flex', 
        flexDirection: 'column', 
        gap: colGap,
        minWidth: 0
      }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={iconStyle}>
            <Icon size={18} color={iconColor} />
          </div>
          <span style={{ fontSize: '16px', color: '#5F5F5F', fontWeight: 500, lineHeight: '20px', letterSpacing: '-0.2px' }}>{label}</span>
        </div>
        {!graph && (customMiddle || (showKebab && <KebabIcon />))}
      </div>

      {!customMiddle && !graph && (lineColor && lightColor) && (
        <div style={{ display: 'flex', gap: '2px', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: pWidth || 'auto' }}>
            <div style={{ flex: 1, height: '3px', background: lineColor, borderRadius: '2px' }} />
            <div style={{ width: '2px', height: '10px', background: lineColor, borderRadius: '1px' }} />
          </div>
          <div style={{ flex: 1, height: '3px', background: lightColor, borderRadius: '2px' }} />
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        alignItems: changeBelow ? 'flex-start' : 'center', 
        justifyContent: 'space-between',
        flexDirection: changeBelow ? 'column' : 'row',
        gap: changeBelow ? '8px' : '0'
      }}>
        <div style={{ color: '#0E0E0C', fontSize: vStyle.size, fontWeight: 700, lineHeight: vStyle.line, letterSpacing: '-1px' }}>{value}</div>
        {customChange || (showChange && change && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '-2px' }}>
            <div style={{ 
              padding: '2px 8px',
              borderRadius: '4px',
              background: changeDown ? '#FFEBEB' : '#E9FAEE',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {changeDown ? <ArrowDown /> : <ArrowUp />}
              <span style={{ 
                fontSize: '12px', 
                color: changeDown ? '#FB3636' : '#24D059', 
                fontWeight: 500,
                lineHeight: '16px'
              }}>
                {change}
              </span>
            </div>
            <span style={{ fontSize: '14px', color: '#6F6F6F', fontWeight: 400, lineHeight: '18px' }}>{changeLabel || 'Since last week'}</span>
          </div>
        ))}
      </div>
      </div>

      {graph && (
        <div style={{
          width: '150px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '14px',
          marginLeft: '12px'
        }}>
          <img src={graph} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      )}
    </div>
  )
}