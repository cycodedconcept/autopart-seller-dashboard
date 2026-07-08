import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Upload, Image as ImageIcon, Phone, Mail, MapPin, MessageSquare, Users, X, Search } from 'lucide-react'

export default function AddCustomer() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: 'Chukwuemeka Okafor',
    email: '',
    phone: '',
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

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/customers')
  }

  return (
    <div className="add-customer-page">
      <div className="add-customer-breadcrumb">
        <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Add New Customer</span>
      </div>

      <h1 className="add-customer-title">Add New Customer</h1>

      <form onSubmit={handleSubmit} className="add-customer-form">
        <div className="add-customer-layout">
          <div className="add-customer-left">
            <div className="add-customer-card">
              <div className="card-header">
                <h3 className="add-customer-card-title">Customer Profile</h3>
                <button type="button" className="card-close-btn">
                  <X size={18} />
                </button>
              </div>
              
              <div className="customer-profile-preview">
                <div className="customer-avatar-preview">
                  <img src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200" alt="Customer" />
                </div>
                <h4 className="customer-preview-name">{form.name}</h4>
                <p className="customer-preview-role">(Customer)</p>
              </div>

              <div className="customer-contact-links">
                <button type="button" className="contact-link-btn">
                  <Phone size={16} />
                  Call Customer
                </button>
                <button type="button" className="contact-link-btn">
                  <Mail size={16} />
                  Message
                </button>
              </div>

              <div className="customer-email-preview">
                <Mail size={14} />
                <span>chuk.okafor@gmail.com</span>
              </div>

              <div className="customer-phone-preview">
                <Phone size={14} />
                <span>+234 803 456 7890</span>
              </div>

              <div className="customer-location-preview">
                <MapPin size={14} />
                <span>Lagos, Nigeria</span>
              </div>

              <div className="customer-social-links">
                <span className="social-label">Follow Social Media</span>
                <div className="social-buttons">
                  <button type="button" className="social-btn">
                    <MessageSquare size={16} />
                  </button>
                  <button type="button" className="social-btn">
                    <Search size={16} />
                  </button>
                  <button type="button" className="social-btn">
                    <Users size={16} />
                  </button>
                  <button type="button" className="social-btn">
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="profile-actions">
                <button type="button" className="add-customer-btn-primary">Add Customer</button>
                <button type="button" className="add-customer-btn-secondary" onClick={() => navigate('/customers')}>Cancel</button>
              </div>
            </div>
          </div>

          <div className="add-customer-right">
            <div className="add-customer-card">
              <h3 className="add-customer-card-title">Customer Information</h3>
              
              <div className="add-customer-row">
                <div className="add-customer-group">
                  <label className="add-customer-label">Customer Name</label>
                  <input
                    className="add-customer-input"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                  />
                </div>
                <div className="add-customer-group">
                  <label className="add-customer-label">Customer Email</label>
                  <input
                    className="add-customer-input"
                    type="email"
                    placeholder="Enter email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="add-customer-row">
                <div className="add-customer-group">
                  <label className="add-customer-label">Customer Number</label>
                  <input
                    className="add-customer-input"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                  />
                </div>
                <div className="add-customer-group">
                  <label className="add-customer-label">Products Number</label>
                  <input
                    className="add-customer-input"
                    placeholder="Enter products number"
                    value={form.ownProducts}
                    onChange={e => set('ownProducts', e.target.value)}
                  />
                </div>
              </div>

              <div className="add-customer-row">
                <div className="add-customer-group">
                  <label className="add-customer-label">Own Products</label>
                  <input
                    className="add-customer-input"
                    placeholder="Enter own products"
                    value={form.ownProducts}
                    onChange={e => set('ownProducts', e.target.value)}
                  />
                </div>
                <div className="add-customer-group">
                  <label className="add-customer-label">Invest Property</label>
                  <input
                    className="add-customer-input"
                    placeholder="Enter invest price"
                    value={form.investProperty}
                    onChange={e => set('investProperty', e.target.value)}
                  />
                </div>
              </div>

              <div className="add-customer-row">
                <div className="add-customer-group">
                  <label className="add-customer-label">Customer Address</label>
                  <input
                    className="add-customer-input"
                    placeholder="Enter address"
                    value={form.address}
                    onChange={e => set('address', e.target.value)}
                  />
                </div>
                <div className="add-customer-group">
                  <label className="add-customer-label">City</label>
                  <input
                    className="add-customer-input"
                    placeholder="Select city"
                    value={form.city}
                    onChange={e => set('city', e.target.value)}
                  />
                </div>
              </div>

              <div className="add-customer-row">
                <div className="add-customer-group">
                  <label className="add-customer-label">Zip-Code</label>
                  <input
                    className="add-customer-input"
                    placeholder="Enter zip-code"
                    value={form.zipCode}
                    onChange={e => set('zipCode', e.target.value)}
                  />
                </div>
                <div className="add-customer-group">
                  <label className="add-customer-label">Country</label>
                  <input
                    className="add-customer-input"
                    placeholder="Select country"
                    value={form.country}
                    onChange={e => set('country', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="add-customer-card">
              <h3 className="add-customer-card-title">Add Customer Photo</h3>
              <div className="customer-upload-area">
                <div className="upload-icon-wrapper">
                  <ImageIcon size={48} color="#FF6B00" />
                </div>
                <p className="upload-text">Drop your images here, or click to <span className="upload-browse">browse</span></p>
                <p className="upload-hint">Recommended image size: 1080 x 780 pixels. Accepted image formats: JPG, PNG.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="add-customer-actions-bottom">
          <button type="button" className="add-customer-cancel" onClick={() => navigate('/customers')}>Cancel</button>
          <button type="submit" className="add-customer-save">Save</button>
        </div>
      </form>
    </div>
  )
}
