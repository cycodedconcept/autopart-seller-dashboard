import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Mail, Lock, Eye, EyeOff, User, Phone, Building2, MapPin, FileText, ArrowLeft, ArrowRight, Upload } from 'lucide-react'
import { sellerRegister, uploadSellerDocuments, clearAuthError } from '../../features/authSlice'

import signinImg from '../../assets/signin image.png'
import autoLogo from '../../assets/auto logo.PNG'

export default function SignUp() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { error, token, sellerProfile } = useSelector(state => state.auth)
  const [step, setStep] = useState(1)
  const [showPwd, setShowPwd] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [cacFile, setCacFile] = useState(null)
  const [utilityFile, setUtilityFile] = useState(null)
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '',
    businessName: '', contactEmail: '', contactPhone: '',
    address: '', cacNumber: ''
  })

  useEffect(() => {
    if (!token) return
    // DEV ONLY — skip the pending-verification redirect so you can reach the dashboard.
    if (import.meta.env.DEV) { navigate('/dashboard', { replace: true }); return }
    const status = sellerProfile?.verificationStatus
    if (status === 'approved' || status === 'verified') navigate('/dashboard', { replace: true })
    else navigate('/pending-verification', { replace: true })
  }, [token, sellerProfile, navigate])

  useEffect(() => {
    return () => { dispatch(clearAuthError()) }
  }, [dispatch])

  const handleNext = () => {
    setForm(f => ({ ...f, contactEmail: f.email, contactPhone: f.phone }))
    setStep(2)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!agreed || submitLoading) return
    setSubmitLoading(true)
    try {
      // Register the seller account
      await dispatch(sellerRegister(form)).unwrap()
      // Success! Document upload is disabled for now (502 error on backend)
      // Users can upload documents later from account settings
      // Account created successfully - redirect will happen in useEffect
    } catch (err) {
      // Registration failed - show error
      setSubmitLoading(false)
    }
  }

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const inputStyle = { width: '100%', padding: '12px 14px 12px 42px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }
  const iconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .signup-banner { display: none !important; }
          .signup-shell { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div className="signup-shell" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#fff' }}>

        <div className="signup-banner" style={{ padding: '24px', display: 'flex', alignItems: 'stretch', justifyContent: 'center', background: '#f9fafb' }}>
          <img src={signinImg} alt="Sign Up Banner" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          <img src={autoLogo} alt="AutoParts Logo" style={{ width: '64px', height: 'auto', marginBottom: '20px' }} />

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '4px', textAlign: 'center' }}>
            {step === 1 ? 'Create Your Account' : 'Business Details'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '24px', textAlign: 'center' }}>
            {step === 1 ? 'Step 1 of 2 — Personal Information' : 'Step 2 of 2 — Business Information'}
          </p>

          {step === 1 ? (
            <form onSubmit={(e) => { e.preventDefault(); handleNext() }} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={iconStyle} />
                    <input type="text" placeholder="Enter your name" required value={form.fullName} onChange={update('fullName')} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={iconStyle} />
                    <input type="email" placeholder="Enter your email" required value={form.email} onChange={update('email')} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={iconStyle} />
                    <input type="tel" placeholder="Enter your phone number" required value={form.phone} onChange={update('phone')} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={iconStyle} />
                    <input type={showPwd ? 'text' : 'password'} placeholder="Enter your password" required pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}" title="At least 8 characters with one uppercase letter, one lowercase letter, and one number" value={form.password} onChange={update('password')} style={{ ...inputStyle, paddingRight: '42px' }} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '4px' }}>At least 8 characters: one uppercase, one lowercase, one number</p>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: '1rem', fontWeight: 600, borderRadius: '10px', marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Next <ArrowRight size={18} />
              </button>

              <p style={{ fontSize: '0.875rem', marginTop: '28px', color: '#4B5563', textAlign: 'center' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ fontWeight: 700, color: '#FF6B00', textDecoration: 'none' }}>Log in</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Business Name</label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={16} style={iconStyle} />
                    <input type="text" placeholder="Enter your business name" required value={form.businessName} onChange={update('businessName')} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Contact Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={iconStyle} />
                    <input type="email" placeholder="Business contact email" required value={form.contactEmail} onChange={update('contactEmail')} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Contact Phone</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={iconStyle} />
                    <input type="tel" placeholder="Business contact phone" required value={form.contactPhone} onChange={update('contactPhone')} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Business Address</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '16px', color: '#9CA3AF' }} />
                    <textarea placeholder="Enter your business address" required value={form.address} onChange={update('address')} rows={2} style={{ ...inputStyle, paddingTop: '12px', resize: 'vertical', fontFamily: 'inherit' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>CAC Registration Number</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <FileText size={16} style={iconStyle} />
                      <input type="text" placeholder="e.g. RC-123456" required value={form.cacNumber} onChange={update('cacNumber')} style={inputStyle} />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 14px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', background: '#F9FAFB', fontSize: '0.8rem', color: '#374151', fontWeight: 500, gap: '6px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      <Upload size={14} />
                      {cacFile ? 'File' : 'Upload'}
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setCacFile(e.target.files[0])} style={{ display: 'none' }} />
                    </label>
                  </div>
                  {cacFile && <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '4px', marginLeft: '2px' }}>{cacFile.name}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Utility Bill — Proof of Address <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(electricity bill, water bill, waste management bill, internet subscription bill)</span>
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', background: '#F9FAFB', fontSize: '0.85rem', color: '#374151', fontWeight: 500, gap: '6px' }}>
                      <Upload size={14} />
                      {utilityFile ? utilityFile.name : 'Choose File'}
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setUtilityFile(e.target.files[0])} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '18px', cursor: 'pointer' }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#FF6B00', cursor: 'pointer', flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', color: '#4B5563' }}>I agree to all Term, Privacy Policy and Fees</span>
              </label>

              {error && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '12px', textAlign: 'center' }}>{typeof error === 'object' ? error.message || JSON.stringify(error) : error}</p>}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: '1rem', fontWeight: 600, borderRadius: '10px', marginTop: '24px' }} disabled={submitLoading || !agreed}>
                {submitLoading ? 'Submitting...' : 'Create Account'}
              </button>

              <button type="button" onClick={() => setStep(1)} style={{ width: '100%', padding: '12px', marginTop: '10px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ArrowLeft size={16} /> Back
              </button>
            </form>
          )}

          </div>
        </div>
      </div>
    </>
  )
}
