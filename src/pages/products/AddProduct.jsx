import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addProduct } from '../../features/productSlice'
import { ArrowLeft, Upload, Plus, X } from 'lucide-react'

const categories = ['Brakes', 'Filters', 'Electrical', 'Ignition', 'Suspension', 'Engine', 'Body', 'Transmission']
const conditions = ['New', 'Used', 'Refurbished']

export default function AddProduct() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
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
    images: ['https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=400'],
    vehicles: [''],
  })

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleVehicle = (index, value) => {
    const newVehicles = [...form.vehicles]
    newVehicles[index] = value
    set('vehicles', newVehicles)
  }

  const removeVehicle = (index) => {
    set('vehicles', form.vehicles.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(addProduct({
      ...form,
      id: `prod-${Date.now()}`,
      price: parseFloat(form.price),
      units: parseInt(form.units),
      vehicles: form.vehicles.filter(Boolean),
      status: parseInt(form.units) > 20 ? 'In Stock' : parseInt(form.units) > 0 ? 'Low Stock' : 'Out of Stock',
    }))
    navigate('/products')
  }

  return (
    <div className="add-product-page">
      <button className="product-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        Back to Products
      </button>

      <div className="add-product-header">
        <h1 className="add-product-title">Add New Product</h1>
        <p className="add-product-subtitle">Fill in the details to list a new auto-part</p>
      </div>

      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="add-product-grid">
          {/* Left Column */}
          <div className="add-product-left">
            {/* Image Upload Area */}
            <div className="add-product-card">
              <h3 className="add-product-card-title">Product Images</h3>
              <div className="image-upload-area">
                <Upload size={32} className="upload-icon" />
                <div className="upload-text">Drag & drop images or click to browse</div>
                <div className="upload-subtext">PNG, JPG up to 10MB</div>
              </div>
              <div className="preview-images">
                {form.images.map((img, i) => (
                  <div key={i} className="preview-image-container">
                    <img src={img} alt="" className="preview-image" />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="add-product-card">
              <h3 className="add-product-card-title">Description</h3>
              <label className="form-label">Product Description</label>
              <textarea
                className="form-textarea"
                rows={5}
                placeholder="Describe the product, its features, quality..."
                value={form.description}
                onChange={e => set('description', e.target.value)}
              />
            </div>

            {/* Vehicle Compatibility */}
            <div className="add-product-card">
              <h3 className="add-product-card-title">Vehicle Compatibility</h3>
              <div className="vehicles-list">
                {form.vehicles.map((vehicle, i) => (
                  <div key={i} className="vehicle-input-container">
                    <input
                      className="form-input"
                      placeholder="e.g. Toyota Camry 2018-2024"
                      value={vehicle}
                      onChange={e => handleVehicle(i, e.target.value)}
                    />
                    {form.vehicles.length > 1 && (
                      <button type="button" className="remove-vehicle-btn" onClick={() => removeVehicle(i)}>
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" className="add-vehicle-btn" onClick={() => set('vehicles', [...form.vehicles, ''])}>
                <Plus size={16} />
                Add Vehicle
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="add-product-right">
            <div className="add-product-card">
              <h3 className="add-product-card-title">Product Information</h3>
              
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  className="form-input"
                  placeholder="e.g. OEM Brake Pad Set"
                  required
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (₦) *</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="0"
                    required
                    value={form.price}
                    onChange={e => set('price', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Units in Stock *</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="0"
                    required
                    value={form.units}
                    onChange={e => set('units', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                    {categories.map(cat => <option key={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Condition *</label>
                  <select className="form-input" value={form.condition} onChange={e => set('condition', e.target.value)}>
                    {conditions.map(cond => <option key={cond}>{cond}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Bosch, NGK, OEM"
                    value={form.brand}
                    onChange={e => set('brand', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SKU</label>
                  <input
                    className="form-input"
                    placeholder="e.g. BP-OEM-9082"
                    value={form.sku}
                    onChange={e => set('sku', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Store Location</label>
                <input
                  className="form-input"
                  placeholder="e.g. Ikeja, Lagos"
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Compatibility</label>
                <input
                  className="form-input"
                  placeholder="Universal or specific"
                  value={form.compatibility}
                  onChange={e => set('compatibility', e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="publish-btn">
                Publish Product
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
