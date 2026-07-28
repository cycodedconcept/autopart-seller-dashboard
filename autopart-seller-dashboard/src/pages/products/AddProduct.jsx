import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addProduct } from '../../features/productSlice'
import {
  Upload, X, ChevronRight, MapPin, Star, Bookmark, Tag,
  DollarSign, Package, Calendar, Truck, Award, Wrench,
  CheckCircle, Hash, Weight, Barcode, Globe, Save
} from 'lucide-react'

const categories = ['Brakes', 'Filters', 'Electrical', 'Ignition', 'Suspension', 'Engine', 'Body', 'Transmission']

export default function AddProduct() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    name: '',
    category: 'Brakes',
    price: '',
    partType: '',
    year: '',
    model: '',
    brand: '',
    engineType: '',
    condition: 'New',
    partNumber: '',
    stockQuantity: '',
    weight: '',
    fitment: '',
    warehouseLocation: '',
    barcode: '',
    country: '',
    images: [],
  })

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(addProduct({
      ...form,
      id: `prod-${Date.now()}`,
      price: parseFloat(form.price) || 0,
      units: parseInt(form.stockQuantity) || 0,
      status: parseInt(form.stockQuantity) > 20 ? 'In Stock' : parseInt(form.stockQuantity) > 0 ? 'Low Stock' : 'Out of Stock',
    }))
    navigate('/products')
  }

  const previewImage = form.images.length > 0
    ? form.images[0]
    : 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=600'

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map(f => URL.createObjectURL(f))
    set('images', [...form.images, ...newImages])
  }

  const removeImage = (index) => {
    set('images', form.images.filter((_, i) => i !== index))
  }

  return (
    <div className="add-product-page">
      {/* Header */}
      <div className="product-detail-header-card">
        <div className="product-header-top-row">
          <div className="product-header-title-section">
            <h1 className="product-detail-title">Products Details</h1>
            <div className="product-breadcrumb">
              <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
              <ChevronRight size={12} />
              <Link to="/products" className="breadcrumb-link">Products Details</Link>
              <ChevronRight size={12} />
              <span className="breadcrumb-current">Add Products</span>
            </div>
          </div>
          <div className="product-header-actions add-header-actions">
            <button type="submit" form="add-product-form" className="product-header-action-btn add-save-btn">
              <Save size={16} />
              Save
            </button>
            <button className="product-header-action-btn add-cancel-btn" onClick={() => navigate('/products')}>
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <form id="add-product-form" onSubmit={handleSubmit} className="add-product-grid">
        {/* Left — Preview Card */}
        <div className="add-preview-card">
          <div className="preview-image-wrapper">
            <img src={previewImage} alt={form.name} className="preview-hero-image" />
            <div className="preview-bookmark">
              <Bookmark size={16} color="#5F5F5F" />
            </div>
            <div className="preview-badge">
              <span className="preview-badge-pill">New</span>
            </div>
          </div>

          <div className="preview-body">
            <h2 className="preview-name">{form.name || 'Bosch Brake Pad Set'}</h2>
            <div className="preview-category">
              <MapPin size={14} />
              {form.category || 'Brakes'} & Rotors
            </div>

            <div className="preview-price-label">Price :</div>
            <div className="preview-price">₦{form.price ? parseFloat(form.price).toLocaleString() : '7,526'}</div>

            <div className="preview-chips">
              <div className="preview-chip">
                <Star size={14} fill="#FFB400" stroke="none" />
                4.8
              </div>
              <div className="preview-chip">25</div>
              <div className="preview-chip">2.5 lbs</div>
            </div>

            <div className="preview-actions">
              <button type="submit" className="preview-btn preview-btn-primary">
                Add Product
              </button>
              <button type="button" className="preview-btn preview-btn-secondary" onClick={() => navigate('/products')}>
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Right — Product Information */}
        <div className="add-info-card">
          <h3 className="add-info-card-title">Product Information</h3>
          <div className="add-form-grid">
            <div className="add-form-group">
              <label className="add-form-label">Part Name</label>
              <div className="add-input-wrapper">
                <Tag size={16} className="add-input-icon" />
                <input className="add-form-input" placeholder="Enter part name" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
            </div>
            <div className="add-form-group">
              <label className="add-form-label">Category</label>
              <div className="add-input-wrapper">
                <Package size={16} className="add-input-icon" />
                <select className="add-form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                  {categories.map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div className="add-form-group">
              <label className="add-form-label">Price</label>
              <div className="add-input-wrapper">
                <DollarSign size={16} className="add-input-icon" />
                <input className="add-form-input" type="number" placeholder="Enter price" value={form.price} onChange={e => set('price', e.target.value)} />
              </div>
            </div>
            <div className="add-form-group">
              <label className="add-form-label">Part Type</label>
              <div className="add-input-wrapper">
                <Package size={16} className="add-input-icon" />
                <input className="add-form-input" placeholder="Enter part type" value={form.partType} onChange={e => set('partType', e.target.value)} />
              </div>
            </div>
            <div className="add-form-group">
              <label className="add-form-label">Year</label>
              <div className="add-input-wrapper">
                <Calendar size={16} className="add-input-icon" />
                <input className="add-form-input" placeholder="Enter year" value={form.year} onChange={e => set('year', e.target.value)} />
              </div>
            </div>
            <div className="add-form-group">
              <label className="add-form-label">Model</label>
              <div className="add-input-wrapper">
                <Truck size={16} className="add-input-icon" />
                <input className="add-form-input" placeholder="Enter model" value={form.model} onChange={e => set('model', e.target.value)} />
              </div>
            </div>
            <div className="add-form-group">
              <label className="add-form-label">Brand</label>
              <div className="add-input-wrapper">
                <Award size={16} className="add-input-icon" />
                <input className="add-form-input" placeholder="Enter brand name" value={form.brand} onChange={e => set('brand', e.target.value)} />
              </div>
            </div>
            <div className="add-form-group">
              <label className="add-form-label">Engine Type</label>
              <div className="add-input-wrapper">
                <Wrench size={16} className="add-input-icon" />
                <input className="add-form-input" placeholder="Enter engine type" value={form.engineType} onChange={e => set('engineType', e.target.value)} />
              </div>
            </div>

            {/* Mobile-only fields */}
            <div className="add-form-group add-field-mobile">
              <label className="add-form-label">Condition</label>
              <div className="add-input-wrapper">
                <CheckCircle size={16} className="add-input-icon" />
                <select className="add-form-input" value={form.condition} onChange={e => set('condition', e.target.value)}>
                  <option>New</option>
                  <option>Used</option>
                  <option>Refurbished</option>
                </select>
              </div>
            </div>
            <div className="add-form-group add-field-mobile">
              <label className="add-form-label">Part Number</label>
              <div className="add-input-wrapper">
                <Hash size={16} className="add-input-icon" />
                <input className="add-form-input" placeholder="Enter part number" value={form.partNumber} onChange={e => set('partNumber', e.target.value)} />
              </div>
            </div>
            <div className="add-form-group add-field-mobile">
              <label className="add-form-label">Stock Quantity</label>
              <div className="add-input-wrapper">
                <Package size={16} className="add-input-icon" />
                <input className="add-form-input" type="number" placeholder="Enter quantity" value={form.stockQuantity} onChange={e => set('stockQuantity', e.target.value)} />
              </div>
            </div>
            <div className="add-form-group add-field-mobile">
              <label className="add-form-label">Weight</label>
              <div className="add-input-wrapper">
                <Weight size={16} className="add-input-icon" />
                <input className="add-form-input" placeholder="Enter weight" value={form.weight} onChange={e => set('weight', e.target.value)} />
              </div>
            </div>
            <div className="add-form-group add-field-mobile">
              <label className="add-form-label">Fitment / Compatibility</label>
              <div className="add-input-wrapper">
                <Wrench size={16} className="add-input-icon" />
                <input className="add-form-input" placeholder="Enter fitment" value={form.fitment} onChange={e => set('fitment', e.target.value)} />
              </div>
            </div>
            <div className="add-form-group add-field-mobile">
              <label className="add-form-label">Warehouse Location</label>
              <div className="add-input-wrapper">
                <MapPin size={16} className="add-input-icon" />
                <input className="add-form-input" placeholder="Enter location" value={form.warehouseLocation} onChange={e => set('warehouseLocation', e.target.value)} />
              </div>
            </div>
            <div className="add-form-group add-field-mobile">
              <label className="add-form-label">Barcode / UPC</label>
              <div className="add-input-wrapper">
                <Barcode size={16} className="add-input-icon" />
                <input className="add-form-input" placeholder="Enter barcode" value={form.barcode} onChange={e => set('barcode', e.target.value)} />
              </div>
            </div>
            <div className="add-form-group add-field-mobile">
              <label className="add-form-label">Country</label>
              <div className="add-input-wrapper">
                <Globe size={16} className="add-input-icon" />
                <input className="add-form-input" placeholder="Enter country" value={form.country} onChange={e => set('country', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="add-photo-section">
          <h3 className="add-info-card-title">Add Product Photo</h3>
          <div className="add-upload-box">
            <input
              type="file"
              accept="image/*"
              multiple
              className="add-upload-input"
              id="add-photo-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="add-photo-upload" className="add-upload-label">
              <Upload size={48} className="add-upload-icon" />
              <span className="add-upload-text">Drop your images here,<br />or click to browse</span>
            </label>
            <div className="add-upload-info">
              <span>Recommended image size: <strong>1080 × 780</strong></span>
              <span>Accepted formats: <strong>PNG JPG</strong></span>
            </div>
          </div>
          {form.images.length > 0 && (
            <div className="add-upload-previews">
              {form.images.map((img, i) => (
                <div key={i} className="add-upload-preview-item">
                  <img src={img} alt="" />
                  <button type="button" className="add-upload-remove" onClick={() => removeImage(i)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}