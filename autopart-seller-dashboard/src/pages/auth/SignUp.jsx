import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react'

import signinImg from '../../assets/signin image.png'
import autoLogo from '../../assets/auto logo.PNG'

export default function SignUp() {
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/login')
    }, 800)
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .signup-banner { display: none !important; }
          .signup-shell { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div className="signup-shell" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#fff' }}>

        {/* Left: Banner image — hidden on mobile */}
        <div className="signup-banner" style={{ padding: '24px', display: 'flex', alignItems: 'stretch', justifyContent: 'center', background: '#f9fafb' }}>
          <img
            src={signinImg}
            alt="Sign Up Banner"
            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' }}
          />
        </div>

        {/* Right: Signup Form */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Logo */}
          <img
            src={autoLogo}
            alt="AutoParts Logo"
            style={{ width: '64px', height: 'auto', marginBottom: '20px' }}
          />

          {/* Title */}
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '8px', textAlign: 'center' }}>
            Create Your Account
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '32px', textAlign: 'center' }}>
            Let's get started your 30 days free trial
          </p>

          <form onSubmit={handleSignup} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* 1. Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                    style={{ width: '100%', padding: '12px 14px 12px 42px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    style={{ width: '100%', padding: '12px 14px 12px 42px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>
              </div>

              {/* Phone Number (Optional) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Phone Number <span style={{ color: '#9CA3AF' }}>(optional)</span></label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    style={{ width: '100%', padding: '12px 14px 12px 42px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Enter your password"
                    required
                    style={{ width: '100%', padding: '12px 42px 12px 42px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
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

            {/* 2. Terms Checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '18px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#FF6B00', cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                I agree to all Term, Privacy Policy and Fees
              </span>
            </label>

            {/* 3. Sign Up Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '1rem', fontWeight: 600, borderRadius: '10px', marginTop: '24px' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

          </form>

          {/* 6. Footer */}
          <p style={{ fontSize: '0.875rem', marginTop: '28px', color: '#4B5563', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: '#FF6B00', textDecoration: 'none' }}>Log in</Link>
          </p>

          </div>
        </div>
      </div>
    </>
  )
}
