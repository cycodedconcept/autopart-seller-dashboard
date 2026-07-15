import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Upload, Phone, Mail, MapPin, MessageSquare, X, User, Package, DollarSign, Hash, Globe, ChevronDown } from 'lucide-react'
import { FaWhatsapp, FaFacebook, FaLinkedin, FaInstagram, FaXTwitter } from 'react-icons/fa6'

export default function AddCustomer() {
  const navigate = useNavigate()
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
    twitter: '',
    instagram: '',
    linkedin: ''
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
    navigate('/customers')
  }

  return (
    <div className="add-customer-page">
      <div className="add-customer-header-card">
        <div className="add-customer-header-top">
          <h1 className="add-customer-title">Add New Customer</h1>
          <div className="add-customer-header-actions">
            <button type="button" className="add-customer-cancel-btn" onClick={() => navigate('/customers')}>Cancel</button>
            <button type="submit" form="add-customer-form" className="add-customer-save-btn">Save</button>
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
                <span>{form.email || 'customer@email.com'}</span>
              </div>

              <div className="customer-phone-preview">
                <Phone size={14} />
                <span>{form.phone || '+234 XXX XXX XXXX'}</span>
              </div>

              <div className="customer-location-preview">
                <MapPin size={14} />
                <span>{form.city ? form.city + ', ' + form.country : 'City, Country'}</span>
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

          <div className="add-customer-right">
            <div className="add-customer-card">
              <h3 className="add-customer-card-title">Customer Information</h3>
              
              <div className="add-customer-row">
                <div className="add-customer-group">
                  <label className="add-customer-label">Customer Name</label>
                  <div className="input-icon-wrapper">
                    <User size={18} className="input-icon" />
                    <input className="add-customer-input" placeholder="Enter full name" value={form.name} onChange={e => set('name', e.target.value)} />
                  </div>
                </div>
                <div className="add-customer-group">
                  <label className="add-customer-label">Customer Email</label>
                  <div className="input-icon-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input className="add-customer-input" type="email" placeholder="Enter email" value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="add-customer-row">
                <div className="add-customer-group">
                  <label className="add-customer-label">Customer Number</label>
                  <div className="input-icon-wrapper">
                    <Phone size={18} className="input-icon" />
                    <input className="add-customer-input" placeholder="Enter phone number" value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                </div>
                <div className="add-customer-group">
                  <label className="add-customer-label">Products Number</label>
                  <div className="input-icon-wrapper">
                    <Package size={18} className="input-icon" />
                    <input className="add-customer-input" placeholder="Enter products number" value={form.productsNumber} onChange={e => set('productsNumber', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="add-customer-row">
                <div className="add-customer-group">
                  <label className="add-customer-label">Own Products</label>
                  <div className="input-icon-wrapper">
                    <Package size={18} className="input-icon" />
                    <input className="add-customer-input" placeholder="Enter own products" value={form.ownProducts} onChange={e => set('ownProducts', e.target.value)} />
                  </div>
                </div>
                <div className="add-customer-group">
                  <label className="add-customer-label">Invest Property</label>
                  <div className="input-icon-wrapper">
                    <DollarSign size={18} className="input-icon" />
                    <input className="add-customer-input" placeholder="Enter invest price" value={form.investProperty} onChange={e => set('investProperty', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="add-customer-row">
                <div className="add-customer-group">
                  <label className="add-customer-label">Customer Address</label>
                  <div className="input-icon-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <input className="add-customer-input" placeholder="Enter address" value={form.address} onChange={e => set('address', e.target.value)} />
                  </div>
                </div>
                <div className="add-customer-group">
                  <label className="add-customer-label">City</label>
                  <div className="input-icon-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <select className="add-customer-input add-customer-select" value={form.city} onChange={e => set('city', e.target.value)}>
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

              <div className="add-customer-row">
                <div className="add-customer-group">
                  <label className="add-customer-label">Zip-Code</label>
                  <div className="input-icon-wrapper">
                    <Hash size={18} className="input-icon" />
                    <input className="add-customer-input" placeholder="Enter zip-code" value={form.zipCode} onChange={e => set('zipCode', e.target.value)} />
                  </div>
                </div>
                <div className="add-customer-group">
                  <label className="add-customer-label">Country</label>
                  <div className="input-icon-wrapper">
                    <Globe size={18} className="input-icon" />
                    <select className="add-customer-input add-customer-select" value={form.country} onChange={e => set('country', e.target.value)}>
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

            <div className="add-customer-card">
              <h3 className="add-customer-card-title">Add Customer Photo</h3>
              <div className="customer-upload-area" onClick={() => photoInputRef.current?.click()}>
                <div className="upload-icon-wrapper">
                  <Upload size={40} color="#FF6B00" />
                </div>
                <p className="upload-text">Drop your images here, or click to <span className="upload-browse">browse</span></p>
                <p className="upload-hint">Recommended image size: 1080 x 780 pixels. Accepted image formats: JPG, PNG.</p>
                <input ref={photoInputRef} type="file" accept="image/*" multiple onChange={handlePhotosChange} style={{ display: 'none' }} />
              </div>
              {photos.length > 0 && (
                <div className="upload-previews">
                  {photos.map((src, i) => (
                    <div key={i} className="upload-preview-item">
                      <img src={src} alt={`Upload ${i+1}`} />
                      <button type="button" className="upload-preview-remove" onClick={() => removePhoto(i)}>
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
