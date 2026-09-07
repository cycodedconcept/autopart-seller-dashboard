import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft, ArrowRight, Lock, Eye, EyeOff, KeyRound } from 'lucide-react'
import api from '../../utils/axios'
import autoLogo from '../../assets/auto logo.PNG'
import autoBanner from '../../assets/autoparts_banner.png'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [token, setToken] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showNewPwd, setShowNewPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)

  const [activeSlide, setActiveSlide] = useState(0)
  const slides = [
    "Explore the Ultimate AutoPart Marketplace – Start Shopping!",
    "Quality Spare Parts at Unbeatable Wholesale Prices – Get Started!",
    "Manage Your Orders & Shipments in Real Time – Scale Today!"
  ]

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.post('/auth/forgot-password', { email })
      setStep('reset')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    if (newPwd !== confirmPwd) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await api.post('/auth/reset-password', { token, newPassword: newPwd })
      setStep('success')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    if (step === 'email') {
      return (
        <>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '8px', textAlign: 'center' }}>Forgot Password</h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '32px', textAlign: 'center' }}>Enter your email for instructions.</p>
          <form onSubmit={handleEmailSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type="email" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px 12px 42px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            {error && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginBottom: '12px', textAlign: 'center' }}>{typeof error === 'object' ? error.message || JSON.stringify(error) : error}</p>}
            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '1rem', fontWeight: 600, borderRadius: '10px', marginBottom: '14px' }}
              disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button type="button" onClick={() => navigate('/login')}
              style={{ width: '100%', padding: '12px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
              Back to Sign In
            </button>
          </form>
        </>
      )
    }

    if (step === 'reset') {
      return (
        <>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#111827', marginBottom: '8px', textAlign: 'center' }}>Reset Password</h1>
          <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '28px', textAlign: 'center', lineHeight: 1.6 }}>
            Enter the reset token from your email and set a new password.
          </p>
          <form onSubmit={handleResetSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Reset Token</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type="text" placeholder="Paste token from email" required value={token} onChange={e => setToken(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px 12px 42px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type={showNewPwd ? 'text' : 'password'} placeholder="Enter new password" required minLength={8} value={newPwd} onChange={e => setNewPwd(e.target.value)}
                  style={{ width: '100%', padding: '12px 42px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                <button type="button" onClick={() => setShowNewPwd(!showNewPwd)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                  {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type={showConfirmPwd ? 'text' : 'password'} placeholder="Confirm new password" required minLength={8} value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
                  style={{ width: '100%', padding: '12px 42px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                  {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginBottom: '12px', textAlign: 'center' }}>{typeof error === 'object' ? error.message || JSON.stringify(error) : error}</p>}
            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '1rem', fontWeight: 600, borderRadius: '10px' }}
              disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </>
      )
    }

    return (
      <>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', marginBottom: '12px', textAlign: 'center', lineHeight: 1.3 }}>
          Password Changed Successfully
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '28px', textAlign: 'center', lineHeight: 1.6 }}>
          Your password has been reset. You can now sign in with your new password.
        </p>
        <button className="btn btn-primary"
          style={{ width: '100%', padding: '13px', fontSize: '1rem', fontWeight: 600, borderRadius: '10px' }}
          onClick={() => navigate('/login')}>
          Back to Sign In
        </button>
      </>
    )
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .fp-banner { display: none !important; }
          .fp-shell { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div className="fp-shell" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={autoLogo} alt="AutoParts Logo" style={{ width: '64px', height: 'auto', marginBottom: '20px' }} />
            {renderStepContent()}
          </div>
        </div>
        <div className="fp-banner" style={{ padding: '24px', position: 'relative', display: 'flex', alignItems: 'stretch', minWidth: 0 }}>
          <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', position: 'relative', background: '#111', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minWidth: 0 }}>
            <img src={autoBanner} alt="Auto Parts" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.1) 100%)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '64px', height: '64px', background: '#fff', borderBottomRightRadius: '24px', zIndex: 3 }}>
              <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '8px', left: '8px', width: '40px', height: '40px', borderRadius: '10px', background: '#3D3D3D', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <ArrowLeft size={18} />
              </button>
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '64px', height: '64px', background: '#fff', borderTopLeftRadius: '24px', zIndex: 3 }}>
              <button onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)} style={{ position: 'absolute', bottom: '8px', right: '8px', width: '40px', height: '40px', borderRadius: '10px', background: '#3D3D3D', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <ArrowRight size={18} />
              </button>
            </div>
            <div style={{ position: 'relative', width: '100%', overflow: 'hidden', padding: '32px 0', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '100%', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{ display: 'flex', width: '300%', transform: `translateX(-${activeSlide * (100 / 3)}%)`, transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                  {slides.map((text, index) => (
                    <div key={index} style={{ width: '33.333%', padding: '0 80px', boxSizing: 'border-box', flexShrink: 0 }}>
                      <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.45rem', lineHeight: 1.35, margin: 0 }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                {slides.map((_, i) => (
                  <div key={i} style={{ width: i === activeSlide ? '22px' : '8px', height: '8px', borderRadius: '4px', background: i === activeSlide ? '#FF6B00' : 'rgba(255,255,255,0.35)', transition: 'width 0.3s, background 0.3s' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
