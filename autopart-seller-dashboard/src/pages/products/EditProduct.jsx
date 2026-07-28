import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateProduct } from '../../features/productSlice'
import {
  Save, X, Upload, Plus, ChevronRight,
  Tag, Package, DollarSign, Hash, MapPin,
  Award, Wrench, Star, Bookmark, CheckCircle,
} from 'lucide-react'
import { initialProducts } from '../../utils/mockData'

const categories = ['Brakes', 'Filters', 'Electrical', 'Ignition', 'Suspension', 'Engine', 'Body', 'Transmission']
const conditions = ['New', 'Used', 'Refurbished']

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const products = useSelector(s =>
    s.products.list.length > 0 ? s.products.list : initialProducts
  )
  const product = products.find(p => p.id === id)

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'Brakes',
    condition: 'New',
    brand: '',
    sku: '',
    units: '',
    location: '',
    compatibility: 'Universal',
    description: '',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=400',
    images: [],
    vehicles: [''],
  })

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        price: product.price?.toString() || '',
        category: product.category || 'Brakes',
        condition: product.condition || 'New',
        brand: product.brand || '',
        sku: product.sku || '',
        units: product.units?.toString() || '',
        location: product.location || '',
        compatibility: product.compatibility || 'Universal',
        description: product.description || '',
        image: product.image,
        images: product.images || [product.image],
        vehicles: product.vehicles?.length ? product.vehicles : [''],
      })
    }
  }, [product])

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleVehicle = (index, value) => {
    const v = [...form.vehicles]
    v[index] = value
    set('vehicles', v)
  }

  const removeVehicle = (index) =>
    set('vehicles', form.vehicles.filter((_, i) => i !== index))

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    const urls = files.map(f => URL.createObjectURL(f))
    set('images', [...form.images, ...urls])
  }

  const removeImage = (index) =>
    set('images', form.images.filter((_, i) => i !== index))

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(updateProduct({
      id,
      ...form,
      price: parseFloat(form.price),
      units: parseInt(form.units),
      vehicles: form.vehicles.filter(Boolean),
      status:
        parseInt(form.units) > 20 ? 'In Stock'
        : parseInt(form.units) > 0 ? 'Low Stock'
        : 'Out of Stock',
    }))
    navigate(`/products/${id}`)
  }

  if (!product) return null

  const previewImage =
    form.images.length > 0 ? form.images[0] : form.image

  return (
    <div className="add-product-page">

      {/* ── Header card ── */}
      <div className="product-detail-header-card">
        <div className="product-header-top-row">
          <div className="product-header-title-section">
            <h1 className="product-detail-title">Edit Product</h1>
            <div className="product-breadcrumb">
              <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
              <ChevronRight size={12} />
              <Link to="/products" className="breadcrumb-link">Products</Link>
              <ChevronRight size={12} />
              <span className="breadcrumb-current">Edit Product</span>
            </div>
          </div>
          <div className="product-header-actions add-header-actions">
            <button
              type="submit"
              form="edit-product-form"
              className="product-header-action-btn add-save-btn"
            >
              <Save size={16} />
              Save Changes
            </button>
            <button
              type="button"
              className="product-header-action-btn add-cancel-btn"
              onClick={() => navigate(-1)}
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* ── Main form grid ── */}
      <form id="edit-product-form" onSubmit={handleSubmit} className="add-product-grid">

        {/* ── Left — live preview card ── */}
        <div className="add-preview-card">
          <div className="preview-image-wrapper">
            <img src={previewImage} alt={form.name} className="preview-hero-image" />
            <div className="preview-bookmark">
              <Bookmark size={16} color="#5F5F5F" />
            </div>
            <div className="preview-badge">
              <span className="preview-badge-pill">{form.condition || 'New'}</span>
            </div>
          </div>

          <div className="preview-body">
            <h2 className="preview-name">{form.name || 'Product Name'}</h2>
            <div className="preview-category">
              <MapPin size={14} />
              {form.category || 'Category'}
            </div>

            <div className="preview-price-label">Price :</div>
            <div className="preview-price">
              ₦{form.price ? parseFloat(form.price).toLocaleString() : '0'}
            </div>

            <div className="preview-chips">
              <div className="preview-chip">
                <Star size={14} fill="#FFB400" stroke="none" />
                4.8
              </div>
              <div className="preview-chip">{form.units || '0'} units</div>
              <div className="preview-chip">{form.brand || 'Brand'}</div>
            </div>

            <div className="preview-actions">
              <button type="submit" form="edit-product-form" className="preview-btn preview-btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="preview-btn preview-btn-secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* ── Right — product information card ── */}
        <div className="add-info-card">
          <h3 className="add-info-card-title">Product Information</h3>

          <div className="add-form-grid">

            {/* Part Name */}
            <div className="add-form-group">
              <label className="add-form-label">Part Name</label>
              <div className="add-input-wrapper">
                <Tag size={16} className="add-input-icon" />
                <input
                  className="add-form-input"
                  placeholder="e.g. OEM Brake Pad Set"
                  required
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div className="add-form-group">
              <label className="add-form-label">Category</label>
              <div className="add-input-wrapper">
                <Package size={16} className="add-input-icon" />
                <select
                  className="add-form-input"
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                >
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Price */}
            <div className="add-form-group">
              <label className="add-form-label">Price (₦)</label>
              <div className="add-input-wrapper">
                <DollarSign size={16} className="add-input-icon" />
                <input
                  className="add-form-input"
                  type="number"
                  placeholder="0"
                  required
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                />
              </div>
            </div>

            {/* Units */}
            <div className="add-form-group">
              <label className="add-form-label">Units in Stock</label>
              <div className="add-input-wrapper">
                <Package size={16} className="add-input-icon" />
                <input
                  className="add-form-input"
                  type="number"
                  placeholder="0"
                  required
                  value={form.units}
                  onChange={e => set('units', e.target.value)}
                />
              </div>
            </div>

            {/* Condition */}
            <div className="add-form-group">
              <label className="add-form-label">Condition</label>
              <div className="add-input-wrapper">
                <CheckCircle size={16} className="add-input-icon" />
                <select
                  className="add-form-input"
                  value={form.condition}
                  onChange={e => set('condition', e.target.value)}
                >
                  {conditions.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Brand */}
            <div className="add-form-group">
              <label className="add-form-label">Brand</label>
              <div className="add-input-wrapper">
                <Award size={16} className="add-input-icon" />
                <input
                  className="add-form-input"
                  placeholder="e.g. Bosch, NGK, OEM"
                  value={form.brand}
                  onChange={e => set('brand', e.target.value)}
                />
              </div>
            </div>

            {/* SKU */}
            <div className="add-form-group">
              <label className="add-form-label">SKU</label>
              <div className="add-input-wrapper">
                <Hash size={16} className="add-input-icon" />
                <input
                  className="add-form-input"
                  placeholder="e.g. BP-OEM-9082"
                  value={form.sku}
                  onChange={e => set('sku', e.target.value)}
                />
              </div>
            </div>

            {/* Store Location */}
            <div className="add-form-group">
              <label className="add-form-label">Store Location</label>
              <div className="add-input-wrapper">
                <MapPin size={16} className="add-input-icon" />
                <input
                  className="add-form-input"
                  placeholder="e.g. Ikeja, Lagos"
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                />
              </div>
            </div>

            {/* Compatibility — full width */}
            <div className="add-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="add-form-label">Compatibility</label>
              <div className="add-input-wrapper">
                <Wrench size={16} className="add-input-icon" />
                <input
                  className="add-form-input"
                  placeholder="e.g. Universal or Toyota Camry 2018-2024"
                  value={form.compatibility}
                  onChange={e => set('compatibility', e.target.value)}
                />
              </div>
            </div>

            {/* Description — full width */}
            <div className="add-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="add-form-label">Product Description</label>
              <textarea
                className="add-form-input"
                rows={4}
                placeholder="Describe the product, its features, quality..."
                value={form.description}
                onChange={e => set('description', e.target.value)}
                style={{ height: 'auto', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '16px', resize: 'vertical' }}
              />
            </div>

            {/* Vehicle Compatibility — full width */}
            <div className="add-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="add-form-label">Vehicle Compatibility</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {form.vehicles.map((vehicle, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div className="add-input-wrapper" style={{ flex: 1 }}>
                      <Wrench size={16} className="add-input-icon" />
                      <input
                        className="add-form-input"
                        placeholder="e.g. Toyota Camry 2018-2024"
                        value={vehicle}
                        onChange={e => handleVehicle(i, e.target.value)}
                      />
                    </div>
                    {form.vehicles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVehicle(i)}
                        style={{
                          width: '36px', height: '48px', borderRadius: '10px',
                          border: '1px solid #ECECEC', background: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: '#EF4444', flexShrink: 0,
                        }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => set('vehicles', [...form.vehicles, ''])}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '8px 14px', borderRadius: '8px',
                    border: '1px dashed #ECECEC', background: 'transparent',
                    color: '#FF7101', fontSize: '0.85rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit', width: 'fit-content',
                  }}
                >
                  <Plus size={14} />
                  Add Vehicle
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ── Photo upload section ── */}
        <div className="add-photo-section">
          <h3 className="add-info-card-title">Product Photos</h3>
          <div className="add-upload-box">
            <input
              type="file"
              accept="image/*"
              multiple
              className="add-upload-input"
              id="edit-photo-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="edit-photo-upload" className="add-upload-label">
              <Upload size={48} className="add-upload-icon" />
              <span className="add-upload-text">
                Drop your images here,<br />or click to browse
              </span>
            </label>
            <div className="add-upload-info">
              <span>Recommended: <strong>1080 × 780</strong></span>
              <span>Formats: <strong>PNG JPG</strong></span>
            </div>
          </div>
          {form.images.length > 0 && (
            <div className="add-upload-previews">
              {form.images.map((img, i) => (
                <div key={i} className="add-upload-preview-item">
                  <img src={img} alt="" />
                  <button
                    type="button"
                    className="add-upload-remove"
                    onClick={() => removeImage(i)}
                  >
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
