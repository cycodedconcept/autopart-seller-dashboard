import { Link, useNavigate } from 'react-router-dom'
import autoLogo from '../../assets/auto logo.PNG'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .notfound-shell { padding: 20px !important; }
        }
      `}</style>
      <div className="notfound-shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          {/* Logo */}
          <img
            src={autoLogo}
            alt="AutoParts Logo"
            style={{ width: '64px', height: 'auto', marginBottom: '20px' }}
          />

          {/* 404 Code */}
          <h1 style={{ fontSize: '5rem', fontWeight: 800, color: '#FF6B00', marginBottom: '0px', lineHeight: '1' }}>
            404
          </h1>

          {/* Title */}
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
            Page Not Found
          </h2>

          {/* Description */}
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '32px', lineHeight: '1.5' }}>
            Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', width: '100%', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                flex: '1 1 140px',
                padding: '12px 20px',
                fontSize: '0.9rem',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#fff',
                color: '#374151',
                cursor: 'pointer'
              }}
            >
              Go Back
            </button>
            <Link
              to="/dashboard"
              style={{
                flex: '1 1 140px',
                padding: '12px 20px',
                fontSize: '0.9rem',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#FF6B00',
                color: '#fff',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Go to Dashboard
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}
