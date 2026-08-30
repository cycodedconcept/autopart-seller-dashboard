import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { sellerLogin, clearAuthError } from '../../features/authSlice'

// Import the user's uploaded images
import signinImg from '../../assets/signin image.png'
import autoLogo from '../../assets/auto logo.PNG'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error, token, sellerProfile } = useSelector(state => state.auth)
  const [showPwd, setShowPwd] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!token) return
    // DEV ONLY — skip the pending-verification redirect so you can reach the dashboard.
    if (import.meta.env.DEV) { navigate('/dashboard', { replace: true }); return }
    const status = sellerProfile?.verificationStatus
    if (status === 'approved' || status === 'verified') {
      navigate('/dashboard', { replace: true })
    } else {
      navigate('/pending-verification', { replace: true })
    }
  }, [token, sellerProfile, navigate])

  useEffect(() => {
    return () => { dispatch(clearAuthError()) }
  }, [dispatch])

  const handleLogin = (e) => {
    e.preventDefault()
    dispatch(sellerLogin({ email, password }))
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
            
            {/* 1. Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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

            {/* 2. Forgot Password */}
            <div style={{ textAlign: 'right', marginTop: '12px' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111827', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            {error && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '12px', textAlign: 'center' }}>{typeof error === 'object' ? error.message || JSON.stringify(error) : error}</p>}

            {/* 3. Sign In Button */}
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', borderRadius: '8px', marginTop: '24px' }} 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
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
