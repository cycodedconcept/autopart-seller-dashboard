import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft, ArrowRight, Lock, Eye, EyeOff } from 'lucide-react'
import autoLogo from '../../assets/auto logo.PNG'
import autoBanner from '../../assets/autoparts_banner.png'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState(['', '', '', ''])
  const otpRefs = [useRef(), useRef(), useRef(), useRef()]
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showNewPwd, setShowNewPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)

  // Carousel state
  const [activeSlide, setActiveSlide] = useState(0)
  const slides = [
    "Explore the Ultimate AutoPart Marketplace – Start Shopping!",
    "Quality Spare Parts at Unbeatable Wholesale Prices – Get Started!",
    "Manage Your Orders & Shipments in Real Time – Scale Today!"
  ]

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length)
  }

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('check')
    }, 800)
  }

  const handleCheckSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('otp')
    }, 600)
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 3) otpRefs[index + 1].current.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus()
    }
  }

  const handleOtpVerify = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('newPassword')
    }, 600)
  }

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('success')
    }, 800)
  }

  /* ─── Render Forms based on Step ─────────────────────── */
  const renderStepContent = () => {
    if (step === 'email') {
      return (
        <>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '8px', textAlign: 'center' }}>Forgot Password</h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '32px', textAlign: 'center' }}>Enter your email for instructions.</p>

          <form onSubmit={handleEmailSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '1rem', fontWeight: 600, borderRadius: '10px', marginBottom: '20px' }}
              disabled={loading}>
              {loading ? 'Sending...' : 'Forgot Password'}
            </button>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type="email" placeholder="Enter your email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px 12px 42px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#FF6B00'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            </div>

            <button type="button" onClick={() => navigate('/login')}
              style={{ width: '100%', padding: '12px', marginTop: '14px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#374151', cursor: 'pointer' }}
              onMouseEnter={e => e.target.style.background = '#F9FAFB'}
              onMouseLeave={e => e.target.style.background = '#fff'}>
              Back to Sign In
            </button>
          </form>
        </>
      )
    }

    if (step === 'check') {
      return (
        <>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '8px', textAlign: 'center' }}>Check your email</h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '28px', textAlign: 'center', lineHeight: 1.6 }}>
            We sent a password reset link to your email.<br />Please check your inbox
          </p>

          <button className="btn btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '1rem', fontWeight: 600, borderRadius: '10px', marginBottom: '16px' }}
            disabled={loading} onClick={handleCheckSubmit}>
            {loading ? 'Opening...' : 'Submit'}
          </button>

          <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>
            Didn't received the email?{' '}
            <button type="button" onClick={() => setStep('email')}
              style={{ background: 'none', border: 'none', padding: 0, color: '#FF6B00', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>
              Resend
            </button>
          </p>
        </>
      )
    }

    if (step === 'otp') {
      return (
        <>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '8px', textAlign: 'center' }}>OTP Verification</h1>
          <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '28px', textAlign: 'center', lineHeight: 1.6 }}>
            we have sent a verification code to email address{' '}
            <span style={{ fontWeight: 600, color: '#111827' }}>{email || 'k.okelola@gmail.com'}</span>{' '}
            <button type="button" onClick={() => setStep('email')}
              style={{ background: 'none', border: 'none', padding: 0, color: '#FF6B00', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>
              Wrong Email?
            </button>
          </p>

          {/* Open Email button */}
          <button className="btn btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '1rem', fontWeight: 600, borderRadius: '10px', marginBottom: '24px' }}
            onClick={() => {}}>
            Open Email
          </button>

          {/* OTP boxes */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={otpRefs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                className={`otp-input${digit ? ' filled' : ''}`}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                onFocus={e => e.target.select()}
              />
            ))}
          </div>

          {/* Resend */}
          <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '20px' }}>
            Didn't received the email?{' '}
            <button type="button" onClick={() => setStep('email')}
              style={{ background: 'none', border: 'none', padding: 0, color: '#FF6B00', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>
              Resend
            </button>
          </p>

          {/* Verify */}
          <button className="btn btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '1rem', fontWeight: 600, borderRadius: '10px' }}
            disabled={otp.some(d => !d) || loading}
            onClick={handleOtpVerify}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </>
      )
    }

    if (step === 'newPassword') {
      return (
        <>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#111827', marginBottom: '8px', textAlign: 'center' }}>
            Create a new password
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '28px', textAlign: 'center', lineHeight: 1.6 }}>
            Set your new password with minimum 8 characters with a combination of letters and numbers
          </p>

          <form onSubmit={handleNewPasswordSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Submit — before fields */}
            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '1rem', fontWeight: 600, borderRadius: '10px', marginBottom: '22px' }}
              disabled={loading}>
              {loading ? 'Saving...' : 'Submit'}
            </button>

            {/* New Password */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type={showNewPwd ? 'text' : 'password'}
                  placeholder="Enter new password"
                  required minLength={8}
                  value={newPwd} onChange={e => setNewPwd(e.target.value)}
                  style={{ width: '100%', padding: '12px 42px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#FF6B00'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
                <button type="button" onClick={() => setShowNewPwd(!showNewPwd)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                  {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                Confirmation New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type={showConfirmPwd ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  required minLength={8}
                  value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
                  style={{ width: '100%', padding: '12px 42px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#FF6B00'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
                <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                  {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </form>
        </>
      )
    }

    /* Success Step */
    return (
      <>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', marginBottom: '12px', textAlign: 'center', lineHeight: 1.3 }}>
          Well Done Your Password Change Successfully
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '28px', textAlign: 'center', lineHeight: 1.6 }}>
          Always remember the password for account at AutoParts
        </p>

        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '13px', fontSize: '1rem', fontWeight: 600, borderRadius: '10px' }}
          onClick={() => navigate('/login')}
        >
          Back to Sign In
        </button>
      </>
    )
  }

  /* ─── Main Render ────────────────────────────────────── */
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .fp-banner { display: none !important; }
          .fp-shell { grid-template-columns: 1fr !important; }
        }
        .otp-input {
          width: 52px; height: 52px; text-align: center;
          font-size: 1.2rem; font-weight: 700; border-radius: 10px;
          border: 1.5px solid #E5E7EB; outline: none;
          background: #F9FAFB; color: #111827; cursor: text;
          transition: border-color .2s, background .2s;
        }
        .otp-input:focus { border-color: #FF6B00; background: #fff; }
        .otp-input.filled { background: #1F1F1F; color: #fff; border-color: #1F1F1F; }
      `}</style>

      <div className="fp-shell" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#fff' }}>
        
        {/* Left Form Wrapper */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={autoLogo} alt="AutoParts Logo" style={{ width: '64px', height: 'auto', marginBottom: '20px' }} />
            {renderStepContent()}
          </div>
        </div>

        {/* Right Panel Banner */}
        <div className="fp-banner" style={{ padding: '24px', position: 'relative', display: 'flex', alignItems: 'stretch', minWidth: 0 }}>
          
          <div style={{
            width: '100%',
            borderRadius: '24px',
            overflow: 'hidden',
            position: 'relative',
            background: '#111',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            minWidth: 0
          }}>
            <img src={autoBanner} alt="Auto Parts" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.1) 100%)' }} />

            {/* Top-Left Cutout (White corner mask) */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '64px',
              height: '64px',
              background: '#fff',
              borderBottomRightRadius: '24px',
              zIndex: 3
            }}>
              {/* Back arrow inside the cutout */}
              <button onClick={() => navigate(-1)} style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#3D3D3D',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <ArrowLeft size={18} />
              </button>
            </div>

            {/* Bottom-Right Cutout (White corner mask) */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '64px',
              height: '64px',
              background: '#fff',
              borderTopLeftRadius: '24px',
              zIndex: 3
            }}>
              {/* Next arrow inside the cutout */}
              <button onClick={nextSlide} style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#3D3D3D',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Centered Footer Content: Slide Wrapper */}
            <div style={{
              position: 'relative',
              width: '100%',
              overflow: 'hidden',
              padding: '32px 0',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              
              {/* Outer sliding deck */}
              <div style={{
                width: '100%',
                overflow: 'hidden',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  width: '300%',
                  transform: `translateX(-${activeSlide * (100 / 3)}%)`,
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  {slides.map((text, index) => (
                    <div key={index} style={{
                      width: '33.333%',
                      padding: '0 80px',
                      boxSizing: 'border-box',
                      flexShrink: 0
                    }}>
                      <p style={{
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1.45rem',
                        lineHeight: 1.35,
                        margin: 0
                      }}>
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Centered pagination dots below the text */}
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                {slides.map((_, i) => (
                  <div key={i} style={{
                    width: i === activeSlide ? '22px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: i === activeSlide ? '#FF6B00' : 'rgba(255,255,255,0.35)',
                    transition: 'width 0.3s, background 0.3s'
                  }} />
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}
