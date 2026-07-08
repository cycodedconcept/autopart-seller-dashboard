
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
  customChange
}) {
  return (
    <div className="card dashboard-stat-card" style={{ 
      padding: '16px',
      display: 'flex', 
      flexDirection: 'column', 
      gap: '12px', 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            padding: '8px',
            background: '#fff',
            borderRadius: '8px',
            outline: '1px solid #F0F0F0',
            outlineOffset: '-1px',
            boxShadow: '0px 1px 2px rgba(82,88,102,0.06)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Icon size={20} color={iconColor} />
          </div>
          <span style={{ fontSize: '16px', color: '#5F5F5F', fontWeight: 500, lineHeight: '20px' }}>{label}</span>
        </div>
        {customMiddle || (showKebab && <KebabIcon />)}
      </div>

      {(lineColor && lightColor) && (
        <div style={{ display: 'flex', gap: '2px', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: progressWidth || 'auto' }}>
            <div style={{ flex: 1, height: '4px', background: lineColor, borderRadius: '1px' }} />
            <div style={{ width: '2px', height: '12px', background: lineColor, borderRadius: '1px' }} />
          </div>
          <div style={{ flex: 1, height: '4px', background: lightColor, borderRadius: '1px' }} />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ color: '#0E0E0C', fontSize: '24px', fontWeight: 700, lineHeight: '34px' }}>{value}</div>
        {customChange || (showChange && change && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ 
              padding: '4px',
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
            <span style={{ fontSize: '14px', color: '#5F5F5F', fontWeight: 400, lineHeight: '18px' }}>Since last week</span>
          </div>
        ))}
      </div>
    </div>
  )
}
