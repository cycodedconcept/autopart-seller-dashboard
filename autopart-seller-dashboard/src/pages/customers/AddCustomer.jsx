import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addCustomer } from '../../features/customerSlice'
import {
  Phone, PhoneCall, Mail, MapPin, MessageSquare, X,
  User, Building2, CircleDollarSign, ShieldCheck, ChevronDown
} from 'lucide-react'
import { FaWhatsapp, FaFacebook, FaLinkedin, FaInstagram, FaXTwitter } from 'react-icons/fa6'

// Colourful landscape upload illustration matching Figma
function UploadIllustration() {
  return (
    <svg width="80" height="72" viewBox="0 0 80 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background card */}
      <rect x="4" y="8" width="64" height="52" rx="8" fill="#E8E8FF" />
      {/* Sky */}
      <rect x="4" y="8" width="64" height="30" rx="8" fill="#C7D2FF" />
      {/* Sun */}
      <circle cx="52" cy="22" r="7" fill="#FFD166" />
      {/* Mountains back */}
      <path d="M4 40 L20 20 L36 40 Z" fill="#9B8FD4" />
      {/* Mountains front */}
      <path d="M28 42 L44 24 L60 42 L68 42 L68 56 Q68 60 64 60 L8 60 Q4 60 4 56 L4 42 Z" fill="#7C6FC4" />
      {/* Ground */}
      <path d="M4 50 Q20 44 40 50 Q56 56 68 50 L68 60 Q68 60 64 60 L8 60 Q4 60 4 56 Z" fill="#A8D5A2" />
      {/* Upload badge circle */}
      <circle cx="58" cy="54" r="14" fill="white" />
      <circle cx="58" cy="54" r="13" fill="#FF7101" />
      {/* Upload arrow */}
      <path d="M58 61 L58 49" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M53 54 L58 49 L63 54" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function AddCustomer() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    name: 'Chukwuemeka Okafor',
    email: '',
    phone: '',
    productsNumber: '',
    ownProducts: '',
    investProperty: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  })
  const [avatar, setAvatar] = useState(null)
  const [photos, setPhotos] = useState([])
  const avatarInputRef = useRef(null)
  const photoInputRef = useRef(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setAvatar(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => setPhotos(prev => [...prev, reader.result])
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (idx) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(addCustomer({
      name: form.name,
      email: form.email,
      phone: form.phone,
      productsNumber: form.productsNumber,
      ownProducts: form.ownProducts,
      investProperty: form.investProperty,
      address: form.address,
      city: form.city,
      zipCode: form.zipCode,
      country: form.country,
      avatar: avatar || 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200',
      partCategory: 'General',
      deliveryAddress: form.city ? `${form.city}, ${form.country}` : '',
      lastDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Active',
    }))
    navigate('/customers')
  }

  return (
    <div className="add-customer-page">
      {/* Header — Save before Cancel to match Figma */}
      <div className="add-customer-header-card">
        <div className="add-customer-header-top">
          <h1 className="add-customer-title">Add New Customer</h1>
          <div className="add-customer-header-actions">
            <button type="submit" form="add-customer-form" className="add-customer-save-btn">Save</button>
            <button type="button" className="add-customer-cancel-btn" onClick={() => navigate('/customers')}>Cancel</button>
          </div>
        </div>
        <div className="add-customer-breadcrumb">
          <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">Add New Customer</span>
        </div>
      </div>

      <form id="add-customer-form" onSubmit={handleSubmit} className="add-customer-form">
        <div className="add-customer-layout">

          {/* ── Left: Customer Profile card ── */}
          <div className="add-customer-left">
            <div className="add-customer-card">
              <div className="card-header">
                <h3 className="add-customer-card-title">Customer Profile</h3>
                <button type="button" className="card-close-btn" onClick={() => navigate('/customers')}>
                  <X size={18} />
                </button>
              </div>

              <div className="customer-profile-preview">
                <div className="customer-avatar-preview" onClick={() => avatarInputRef.current?.click()} style={{ cursor: 'pointer' }}>
                  <img src={avatar || 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200'} alt="Customer" />
                </div>
                <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                <h4 className="customer-preview-name">{form.name}</h4>
                <p className="customer-preview-role">(Customer)</p>
              </div>

              <div className="customer-contact-links">
                <button type="button" className="contact-link-btn">
                  <Phone size={16} />
                  Call Customer
                </button>
                <button type="button" className="contact-link-btn">
                  <MessageSquare size={16} />
                  Message
                </button>
              </div>

              <div className="customer-email-preview">
                <Mail size={14} />
                <span>{form.email || 'chuk.okafor@gmail.com'}</span>
              </div>

              <div className="customer-phone-preview">
                <Phone size={14} />
                <span>{form.phone || '+234 803 456 7890'}</span>
              </div>

              <div className="customer-location-preview">
                <MapPin size={14} />
                <span>{form.city ? `${form.city}, ${form.country}` : 'Lagos, Nigeria'}</span>
              </div>

              <div className="customer-social-links">
                <span className="social-label">Follow Social Media</span>
                <div className="social-buttons">
                  <button type="button" className="social-btn" data-brand="whatsapp" title="WhatsApp">
                    <FaWhatsapp size={18} />
                  </button>
                  <button type="button" className="social-btn" data-brand="facebook" title="Facebook">
                    <FaFacebook size={18} />
                  </button>
                  <button type="button" className="social-btn" data-brand="linkedin" title="LinkedIn">
                    <FaLinkedin size={18} />
                  </button>
                  <button type="button" className="social-btn" data-brand="instagram" title="Instagram">
                    <FaInstagram size={18} />
                  </button>
                  <button type="button" className="social-btn" data-brand="twitter" title="Twitter">
                    <FaXTwitter size={18} />
                  </button>
                  <button type="button" className="social-btn" data-brand="mail" title="Mail">
                    <Mail size={18} />
                  </button>
                </div>
              </div>

              <div className="profile-actions">
                <button type="submit" form="add-customer-form" className="profile-save-btn">Add Customer</button>
                <button type="button" className="profile-cancel-btn" onClick={() => navigate('/customers')}>Cancel</button>
              </div>
            </div>
          </div>

          {/* ── Right: Customer Information + Photo ── */}
          <div className="add-customer-right">
            <div className="add-customer-card">
              <h3 className="add-customer-card-title">Customer Information</h3>

              {/* Row 1: Name + Email */}
              <div className="add-customer-row">
                <div className="add-customer-group">
                  <label className="add-customer-label">Customer Name</label>
                  <div className="input-icon-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      className="add-customer-input"
                      placeholder="Enter full name"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                    />
                  </div>
                </div>
                <div className="add-customer-group">
                  <label className="add-customer-label">Customer Email</label>
                  <div className="input-icon-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      className="add-customer-input"
                      type="email"
                      placeholder="Enter email"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Phone + Products Number */}
              <div className="add-customer-row">
                <div className="add-customer-group">
                  <label className="add-customer-label">Customer Number</label>
                  <div className="input-icon-wrapper">
                    {/* PhoneCall matches the arc-lines phone icon in Figma */}
                    <PhoneCall size={18} className="input-icon" />
                    <input
                      className="add-customer-input"
                      placeholder="Enter phone number"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                    />
                  </div>
                </div>
                <div className="add-customer-group">
                  <label className="add-customer-label">Products Number</label>
                  <div className="input-icon-wrapper">
                    {/* Building2 matches the storefront/grid icon in Figma */}
                    <Building2 size={18} className="input-icon" />
                    <input
                      className="add-customer-input"
                      placeholder="Enter Products number"
                      value={form.productsNumber}
                      onChange={e => set('productsNumber', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Own Products + Invest Property */}
              <div className="add-customer-row">
                <div className="add-customer-group">
                  <label className="add-customer-label">Own Products</label>
                  <div className="input-icon-wrapper">
                    <Building2 size={18} className="input-icon" />
                    <input
                      className="add-customer-input"
                      placeholder="Enter own Products"
                      value={form.ownProducts}
                      onChange={e => set('ownProducts', e.target.value)}
                    />
                  </div>
                </div>
                <div className="add-customer-group">
                  <label className="add-customer-label">Invest Property</label>
                  <div className="input-icon-wrapper">
                    {/* CircleDollarSign matches the dollar-in-circle icon in Figma */}
                    <CircleDollarSign size={18} className="input-icon" />
                    <input
                      className="add-customer-input"
                      placeholder="Enter invest price"
                      value={form.investProperty}
                      onChange={e => set('investProperty', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Address + City */}
              <div className="add-customer-row">
                <div className="add-customer-group">
                  <label className="add-customer-label">Customer Address</label>
                  <div className="input-icon-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <input
                      className="add-customer-input"
                      placeholder="Enter address"
                      value={form.address}
                      onChange={e => set('address', e.target.value)}
                    />
                  </div>
                </div>
                <div className="add-customer-group">
                  <label className="add-customer-label">City</label>
                  <div className="input-icon-wrapper">
                    {/* Figma uses a person silhouette icon for City */}
                    <User size={18} className="input-icon" />
                    <select
                      className="add-customer-input add-customer-select"
                      value={form.city}
                      onChange={e => set('city', e.target.value)}
                    >
                      <option value="">Select city</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Port Harcourt">Port Harcourt</option>
                      <option value="Ibadan">Ibadan</option>
                      <option value="Kano">Kano</option>
                      <option value="Enugu">Enugu</option>
                    </select>
                    <ChevronDown size={16} className="select-chevron" />
                  </div>
                </div>
              </div>

              {/* Row 5: Zip-Code + Country */}
              <div className="add-customer-row">
                <div className="add-customer-group">
                  <label className="add-customer-label">Zip-Code</label>
                  <div className="input-icon-wrapper">
                    {/* ShieldCheck matches the shield/tag icon in Figma for zip code */}
                    <ShieldCheck size={18} className="input-icon" />
                    <input
                      className="add-customer-input"
                      placeholder="Enter zip-code"
                      value={form.zipCode}
                      onChange={e => set('zipCode', e.target.value)}
                    />
                  </div>
                </div>
                <div className="add-customer-group">
                  <label className="add-customer-label">Country</label>
                  <div className="input-icon-wrapper">
                    {/* Figma uses a person silhouette icon for Country too */}
                    <User size={18} className="input-icon" />
                    <select
                      className="add-customer-input add-customer-select"
                      value={form.country}
                      onChange={e => set('country', e.target.value)}
                    >
                      <option value="">Select country</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Kenya">Kenya</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown size={16} className="select-chevron" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Add Customer Photo ── */}
            <div className="add-customer-card">
              <h3 className="add-customer-card-title">Add Customer Photo</h3>
              <div className="customer-upload-area" onClick={() => photoInputRef.current?.click()}>
                {/* Colourful landscape illustration matching Figma */}
                <UploadIllustration />
                <p className="upload-text">
                  Drop your images here, or click to{' '}
                  <span className="upload-browse">browse</span>
                </p>
                {/* Single line, no period after pixels, exact Figma copy */}
                <p className="upload-hint">
                  Recommended image size: 1080 x 780 pixels Accepted image formats: JPG, PNG.
                </p>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotosChange}
                  style={{ display: 'none' }}
                />
              </div>
              {photos.length > 0 && (
                <div className="upload-previews">
                  {photos.map((src, i) => (
                    <div key={i} className="upload-preview-item">
                      <img src={src} alt={`Upload ${i + 1}`} />
                      <button
                        type="button"
                        className="upload-preview-remove"
                        onClick={() => removePhoto(i)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
