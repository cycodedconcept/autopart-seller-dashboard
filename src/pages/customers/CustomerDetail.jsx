import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateCustomer, toggleCustomerStatus } from '../../features/customerSlice'
import { ArrowLeft, Upload, Plus, X, Edit, CheckCircle, XCircle, MapPin, Mail, Phone } from 'lucide-react'
import { initialCustomers } from '../../utils/mockData'

export default function CustomerDetail() {
  const { refNumber } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const customers = useSelector(s => s.customers.list.length > 0 ? s.customers.list : initialCustomers)
  const customer = customers.find(c => c.refNumber === refNumber)

  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', state: '', zipCode: '', country: 'Nigeria',
    twitter: '', instagram: '', linkedin: ''
  })

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        zipCode: customer.zipCode || '',
        country: customer.country || 'Nigeria',
        twitter: customer.socials?.twitter || '',
        instagram: customer.socials?.instagram || '',
        linkedin: customer.socials?.linkedin || ''
      })
    }
  }, [customer])

  if (!customer) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Customer not found</h2>
        <Link to="/customers" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Customers
        </Link>
      </div>
    )
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = (e) => {
    e.preventDefault()
    dispatch(updateCustomer({
      refNumber: customer.refNumber,
      ...form,
      socials: { twitter: form.twitter, instagram: form.instagram, linkedin: form.linkedin }
    }))
    setIsEditing(false)
  }

  const handleToggleStatus = () => {
    dispatch(toggleCustomerStatus(customer.refNumber))
  }

  return (
    <div className="customer-detail-page">
      <button className="customer-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back to Customers
      </button>

      <div className="customer-detail-layout">
        <div className="customer-detail-left">
          <div className="customer-profile-card">
            <div className="customer-profile-header">
              <div className="customer-profile-avatar">
                <img src={customer.avatar} alt={customer.name} />
              </div>
              <div className="customer-profile-info">
                <h2 className="customer-profile-name">{customer.name}</h2>
                <div className="customer-profile-meta">
                  <span className={`customer-status-badge ${customer.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                    {customer.status}
                  </span>
                  <span className="customer-ref-label">{customer.refNumber}</span>
                </div>
              </div>
            </div>

            <div className="customer-profile-actions">
              <button
                className={`customer-toggle-status-btn ${customer.status === 'Active' ? 'deactivate' : 'activate'}`}
                onClick={handleToggleStatus}
              >
                {customer.status === 'Active' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                {customer.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                className="customer-edit-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit size={16} />
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>

          <div className="customer-contact-card">
            <h3 className="customer-section-title">Contact Information</h3>
            <div className="customer-contact-list">
              <div className="customer-contact-item">
                <Mail size={18} />
                <div>
                  <div className="customer-contact-label">Email</div>
                  {isEditing ? (
                    <input
                      className="customer-input"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                    />
                  ) : (
                    <div className="customer-contact-value">{customer.email}</div>
                  )}
                </div>
              </div>
              <div className="customer-contact-item">
                <Phone size={18} />
                <div>
                  <div className="customer-contact-label">Phone</div>
                  {isEditing ? (
                    <input
                      className="customer-input"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                    />
                  ) : (
                    <div className="customer-contact-value">{customer.phone}</div>
                  )}
                </div>
              </div>
              <div className="customer-contact-item">
                <MapPin size={18} />
                <div>
                  <div className="customer-contact-label">Address</div>
                  {isEditing ? (
                    <>
                      <input
                        className="customer-input"
                        value={form.address}
                        onChange={e => set('address', e.target.value)}
                        style={{ marginBottom: '8px' }}
                      />
                      <input
                        className="customer-input"
                        value={form.city}
                        onChange={e => set('city', e.target.value)}
                        style={{ marginBottom: '8px' }}
                      />
                      <input
                        className="customer-input"
                        value={form.state}
                        onChange={e => set('state', e.target.value)}
                        style={{ marginBottom: '8px' }}
                      />
                      <input
                        className="customer-input"
                        value={form.zipCode}
                        onChange={e => set('zipCode', e.target.value)}
                      />
                    </>
                  ) : (
                    <div className="customer-contact-value">
                      {customer.address}
                      <br />
                      {customer.city}, {customer.state} {customer.zipCode}
                      <br />
                      {customer.country}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="customer-detail-right">
          <div className="customer-info-card">
            <h3 className="customer-section-title">Customer Profile</h3>
            <div className="customer-info-list">
              <div className="customer-info-row">
                <div className="customer-info-label">Full Name</div>
                {isEditing ? (
                  <input
                    className="customer-input"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                  />
                ) : (
                  <div className="customer-info-value">{customer.name}</div>
                )}
              </div>
              <div className="customer-info-row">
                <div className="customer-info-label">Join Date</div>
                <div className="customer-info-value">{customer.dateJoined}</div>
              </div>
            </div>

            <hr className="customer-divider" />

            <h3 className="customer-section-title">Social Profiles</h3>
            <div className="customer-social-list">
              <div className="customer-social-item">
                <div className="customer-social-label">Twitter</div>
                {isEditing ? (
                  <input
                    className="customer-input"
                    value={form.twitter}
                    onChange={e => set('twitter', e.target.value)}
                  />
                ) : (
                  <div className="customer-social-value">{customer.socials?.twitter || '-'}</div>
                )}
              </div>
              <div className="customer-social-item">
                <div className="customer-social-label">Instagram</div>
                {isEditing ? (
                  <input
                    className="customer-input"
                    value={form.instagram}
                    onChange={e => set('instagram', e.target.value)}
                  />
                ) : (
                  <div className="customer-social-value">{customer.socials?.instagram || '-'}</div>
                )}
              </div>
              <div className="customer-social-item">
                <div className="customer-social-label">LinkedIn</div>
                {isEditing ? (
                  <input
                    className="customer-input"
                    value={form.linkedin}
                    onChange={e => set('linkedin', e.target.value)}
                  />
                ) : (
                  <div className="customer-social-value">{customer.socials?.linkedin || '-'}</div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="customer-save-actions">
                <button className="customer-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="customer-save-btn" onClick={handleSave}>Save Changes</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
