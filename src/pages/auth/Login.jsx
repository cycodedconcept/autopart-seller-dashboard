import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

// Import the user's uploaded images
import signinImg from '../../assets/signin image.png'
import autoLogo from '../../assets/auto logo.PNG'

export default function Login() {
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 800)
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .login-banner { display: none !important; }
          .login-shell { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div className="login-shell" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#fff' }}>
      
      {/* Left: The uploaded Figma image banner — hidden on mobile */}
      <div className="login-banner" style={{ padding: '24px', display: 'flex', alignItems: 'stretch', justifyContent: 'center', background: '#f9fafb' }}>
        <img 
          src={signinImg} 
          alt="Sign In Banner" 
          style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' }}
        />
      </div>

      {/* Right: Login Form perfectly matching Figma layout */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Logo */}
          <img 
            src={autoLogo} 
            alt="AutoParts Logo" 
            style={{ width: '64px', height: 'auto', marginBottom: '20px' }}
          />

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
            Login Into AutoParts
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '32px' }}>
            Enter your email and password to log in
          </p>

          <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* 1. Sign In Button at the top */}
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', borderRadius: '8px', marginBottom: '16px' }} 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            {/* 2. Login with Google Button */}
            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#374151', border: '1px solid #E5E7EB', backgroundColor: '#fff' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Login with Google
            </button>

            {/* 3. Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
              <span style={{ padding: '0 12px', fontSize: '0.75rem', color: '#9CA3AF' }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            </div>

            {/* 4. Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    style={{ width: '100%', padding: '12px 14px 12px 40px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  <input 
                    type={showPwd ? 'text' : 'password'} 
                    placeholder="Enter your password" 
                    required 
                    style={{ width: '100%', padding: '12px 40px 12px 40px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

            </div>

            {/* 5. Forgot Password */}
            <div style={{ textAlign: 'right', marginTop: '12px' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111827', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>
          </form>

          {/* 6. Footer Text */}
          <p style={{ fontSize: '0.875rem', marginTop: '32px', color: '#4B5563' }}>
            Don't have an account? <Link to="/signup" style={{ fontWeight: 600, color: '#FF6B00', textDecoration: 'none' }}>Register</Link>
          </p>

        </div>
      </div>
    </div>
    </>
  )
}
