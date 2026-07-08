import React from 'react';

export default function AuthBanner() {
  return (
    <div style={{
      padding: '24px',
      background: '#f3f4f6',
      height: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      overflow: 'hidden',
      alignItems: 'start'
    }}>
      {/* Column 1 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <img src="https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&q=80" alt="parts" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px' }} />
        <img src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80" alt="mechanic" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px' }} />
        <img src="https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?w=400&q=80" alt="filter" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }} />
        <img src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&q=80" alt="mechanic" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} />
      </div>

      {/* Column 2 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Orange Card */}
        <div style={{ background: '#d95d13', borderRadius: '12px', padding: '20px', color: 'white' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '4px' }}>1,737+</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px' }}>Car Parts</div>
          <p style={{ fontSize: '0.75rem', lineHeight: 1.5, opacity: 0.9, marginBottom: '16px' }}>
            At the heart of AutoParts' vision is a commitment to exceptional customer experiences. Their passionate team
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>
            <span style={{ background: 'white', color: '#d95d13', padding: '2px 4px', borderRadius: '2px', fontWeight: 700 }}>-04%</span> Since last week
          </div>
        </div>

        <img src="https://images.unsplash.com/photo-1504222490345-c075b6008014?w=400&q=80" alt="hands" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px' }} />
        
        {/* Green Card */}
        <div style={{ background: '#548e28', borderRadius: '12px', padding: '20px', color: 'white' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '4px' }}>536+</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px' }}>Parts Sold</div>
          <p style={{ fontSize: '0.75rem', lineHeight: 1.5, opacity: 0.9, marginBottom: '16px' }}>
            AutoParts specializes in comprehensive market insights, strategic acquisition guidance, and effective portfolio oversight.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>
            <span style={{ background: 'white', color: '#548e28', padding: '2px 4px', borderRadius: '2px', fontWeight: 700 }}>-04%</span> Since last week
          </div>
        </div>
        
        <img src="https://images.unsplash.com/photo-1632733711679-5292d77d7b10?w=400&q=80" alt="suspension" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px' }} />
      </div>

      {/* Column 3 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&q=80" alt="car" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }} />
        <img src="https://images.unsplash.com/photo-1599256621730-535171e28f32?w=400&q=80" alt="mechanic" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '12px' }} />
        <img src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&q=80" alt="parts" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }} />
        <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&q=80" alt="mechanic" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} />
      </div>
    </div>
  )
}
