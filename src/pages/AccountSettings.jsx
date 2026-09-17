import React, { useState } from 'react'
import { Upload, Check, X, Bell, Shield, Globe, User, Lock, Trash2 } from 'lucide-react'

const currentUser = {
  email: 'you@autoparts.local',
  phone: '0800 000 0000',
  address: 'Lagos, Nigeria',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80',
}

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('account')
  const [accountForm, setAccountForm] = useState({
    firstName: 'Kamal',
    lastName: 'Okelola',
    email: currentUser.email,
    contactNumber: currentUser.phone,
    country: 'Nigeria',
    city: 'Lagos',
    address: currentUser.address,
    timeZone: 'Lagos/Nigeria (GMT+1)',
    description: ''
  })
  const [profileImage, setProfileImage] = useState(currentUser.avatar)
  const [notifications, setNotifications] = useState({
    orderConfirmed: true,
    partShipped: true,
    priceDrop: false,
    newReview: true,
    returnApproved: false
  })
  const [saveStatus, setSaveStatus] = useState(null)
  const [errors, setErrors] = useState({})

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfileImage(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeletePhoto = () => {
    if (window.confirm('Are you sure you want to delete your profile photo?')) {
      setProfileImage(currentUser.avatar)
    }
  }

  const handleAccountChange = (e) => {
    const { name, value } = e.target
    setAccountForm(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateAccountForm = () => {
    const newErrors = {}
    if (!accountForm.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!accountForm.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!accountForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Please enter a valid email'
    if (!accountForm.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveAccount = () => {
    if (!validateAccountForm()) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }
    setSaveStatus('saving')
    setTimeout(() => {
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
    }, 1000)
  }

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSaveNotifications = () => {
    setSaveStatus('saving')
    setTimeout(() => {
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
    }, 500)
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion requested - this is a demo')
    }
  }

  const handleLogOutAll = () => {
    if (window.confirm('Are you sure you want to log out of all sessions?')) {
      alert('Logged out of all sessions - this is a demo')
    }
  }

  const handleChangePassword = () => {
    alert('Password change modal would open - this is a demo')
  }

  const handleEnable2FA = () => {
    alert('2FA setup modal would open - this is a demo')
  }

  return (
    <div className="account-settings-page">
      <div className="settings-grid">
        {/* Settings Sidebar */}
        <div className="settings-sidebar">
          <h3 className="settings-sidebar-title">Settings Menu</h3>
          <button
            className={`settings-sidebar-item ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <User size={18} />
            <span>Account</span>
          </button>
          <button
            className={`settings-sidebar-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} />
            <span>Notifications</span>
          </button>
          <button
            className={`settings-sidebar-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} />
            <span>Security</span>
          </button>
          <button
            className={`settings-sidebar-item ${activeTab === 'language' ? 'active' : ''}`}
            onClick={() => setActiveTab('language')}
          >
            <Globe size={18} />
            <span>Language</span>
          </button>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="settings-tab-content">
              <div className="settings-tab-header">
                <h2>Account</h2>
                <p>Real-time information and activities of your property.</p>
              </div>

              {/* Profile Picture */}
              <div className="settings-card">
                <div className="profile-section">
                  <div className="profile-image-wrapper">
                    <img src={profileImage} alt="Profile" className="profile-image-large" />
                  </div>
                  <div className="profile-info">
                    <h4>Profile picture</h4>
                    <p className="profile-type">PNG, JPEG under 10MB</p>
                    <div className="profile-buttons">
                      <label className="btn-upload">
                        <Upload size={16} />
                        Upload new picture
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          hidden
                        />
                      </label>
                      <button className="btn-delete" onClick={handleDeletePhoto}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="settings-card">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={accountForm.firstName}
                      onChange={handleAccountChange}
                      placeholder="Enter your first name"
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={accountForm.lastName}
                      onChange={handleAccountChange}
                      placeholder="Enter your last name"
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={accountForm.email}
                      onChange={handleAccountChange}
                      placeholder="Enter your email"
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={accountForm.contactNumber}
                      onChange={handleAccountChange}
                      placeholder="Enter your number"
                      className={errors.contactNumber ? 'error' : ''}
                    />
                    {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Country</label>
                    <select
                      name="country"
                      value={accountForm.country}
                      onChange={handleAccountChange}
                    >
                      <option>Select Country</option>
                      <option>Nigeria</option>
                      <option>Ghana</option>
                      <option>Kenya</option>
                      <option>South Africa</option>
                      <option>Egypt</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={accountForm.city}
                      onChange={handleAccountChange}
                      placeholder="Enter your city name"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Time Zone</label>
                  <select
                    name="timeZone"
                    value={accountForm.timeZone}
                    onChange={handleAccountChange}
                  >
                    <option>Lagos/Nigeria (GMT+1)</option>
                    <option>Accra/Ghana (GMT)</option>
                    <option>Nairobi/Kenya (GMT+3)</option>
                    <option>Johannesburg/South Africa (GMT+2)</option>
                    <option>Cairo/Egypt (GMT+2)</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={accountForm.address}
                    onChange={handleAccountChange}
                    placeholder="Enter your address"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <div className="textarea-wrapper">
                    <textarea
                      name="description"
                      value={accountForm.description}
                      onChange={handleAccountChange}
                      placeholder="Typing..."
                      rows={4}
                    />
                    <span className="char-count">0/250</span>
                  </div>
                </div>

                <div className="settings-actions">
                  <button className="btn-cancel" onClick={() => {
                    setAccountForm({
                      firstName: 'Kamal',
                      lastName: 'Okelola',
                      email: currentUser.email,
                      contactNumber: currentUser.phone,
                      country: 'Nigeria',
                      city: 'Lagos',
                      address: currentUser.address,
                      timeZone: 'Lagos/Nigeria (GMT+1)',
                      description: ''
                    })
                    setErrors({})
                  }}>
                    Cancel
                  </button>
                  <button
                    className={`btn-save ${saveStatus === 'success' ? 'success' : saveStatus === 'error' ? 'error' : ''}`}
                    onClick={handleSaveAccount}
                    disabled={saveStatus === 'saving'}
                  >
                    {saveStatus === 'saving' && <span>Saving...</span>}
                    {saveStatus === 'success' && <><Check size={18} /> Changes Saved</>}
                    {!saveStatus && 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="settings-tab-content">
              <div className="settings-tab-header">
                <h2>Notifications</h2>
                <p>Real-time updates and activities for your auto parts orders.</p>
              </div>

              <div className="settings-card">
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Your Order Has Been Confirmed</h4>
                    <p>Your auto parts order has been successfully placed. Track your shipment and estimated delivery time.</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.orderConfirmed}
                      onChange={() => handleNotificationToggle('orderConfirmed')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Part Has Been Shipped</h4>
                    <p>Great news! Your ordered part is on its way. Check the tracking details to monitor your delivery.</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.partShipped}
                      onChange={() => handleNotificationToggle('partShipped')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Price Drop on Saved Item</h4>
                    <p>An item in your saved list has dropped in price. Grab it before it sells out.</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.priceDrop}
                      onChange={() => handleNotificationToggle('priceDrop')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>New Review on Your Listing</h4>
                    <p>A buyer has left a review on one of your listed parts. Check the feedback and respond at your earliest convenience.</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.newReview}
                      onChange={() => handleNotificationToggle('newReview')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Return Request Approved</h4>
                    <p>Your return request has been approved. Follow the instructions to ship the part back and receive your refund.</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.returnApproved}
                      onChange={() => handleNotificationToggle('returnApproved')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="settings-actions right">
                  <button className="btn-save" onClick={handleSaveNotifications}>
                    {saveStatus === 'saving' && 'Saving...'}
                    {saveStatus === 'success' && <><Check size={18} /> Saved</>}
                    {!saveStatus && 'Save'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="settings-tab-content">
              <div className="settings-tab-header">
                <h2>Security</h2>
                <p>Real-time information and activities of your property.</p>
              </div>

              <div className="settings-card">
                <div className="security-item">
                  <div className="security-info">
                    <h4>Password</h4>
                    <p>Change the password for your account</p>
                  </div>
                  <button className="btn-outline" onClick={handleChangePassword}>
                    Change Password
                  </button>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>Require authentication when you login</p>
                  </div>
                  <button className="btn-outline" onClick={handleEnable2FA}>
                    Enable
                  </button>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <h4>Security</h4>
                    <p>Log out of all sessions except this current browser</p>
                  </div>
                  <button className="btn-outline" onClick={handleLogOutAll}>
                    Log out all sessions
                  </button>
                </div>

                <div className="security-danger">
                  <h4>Delete Account</h4>
                  <p>Permanently delete the account and remove access from all workspace</p>
                  <button className="btn-danger" onClick={handleDeleteAccount}>
                    <Trash2 size={16} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Language Tab */}
          {activeTab === 'language' && (
            <div className="settings-tab-content">
              <div className="settings-tab-header">
                <h2>Language</h2>
                <p>Select your preferred language.</p>
              </div>
              <div className="settings-card">
                <div className="form-group">
                  <label>Select Language</label>
                  <select defaultValue="en">
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
                <div className="settings-actions">
                  <button className="btn-save" onClick={() => {
                    setSaveStatus('saving')
                    setTimeout(() => {
                      setSaveStatus('success')
                      setTimeout(() => setSaveStatus(null), 3000)
                    }, 500)
                  }}>
                    Save Language
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountSettings
