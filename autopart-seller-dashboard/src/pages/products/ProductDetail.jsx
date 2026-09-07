import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  ArrowLeft, MapPin, Package, Star, CheckCircle2, Share2, 
  MessageSquare, ChevronRight, Heart, MoreHorizontal, Phone, Bookmark, RefreshCw,
  Zap, Tag
} from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const { list: products, loading, error } = useSelector(s => s.products)
  const product = products.find(p => p.id === id)
  
  const fallbackImages = [
    product?.image || 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?auto=format&fit=crop&q=80&w=800'
  ]

  const productImages = product?.images && product.images.length >= 4 
    ? product.images 
    : fallbackImages

  const [selectedImage, setSelectedImage] = useState(productImages[0])

  const reviews = [
    { 
      id: 1, 
      name: "Herry Kane", 
      avatar: "https://picsum.photos/80/80?random=401", 
      rating: 5, 
      date: "09 Mar 2024 - 08 Jan 2025"
    },
    { 
      id: 2, 
      name: "Anwar Hussen", 
      avatar: "https://picsum.photos/80/80?random=402", 
      rating: 4, 
      date: "09 Mar 2024 - 08 Jan 2025"
    },
    { 
      id: 3, 
      name: "Jahid Khan", 
      avatar: "https://picsum.photos/80/80?random=403", 
      rating: 5, 
      date: "09 Mar 2024 - 08 Jan 2025"
    }
  ]

  if (loading && products.length === 0) {
    return (
      <div className="product-detail-page">
        <div className="loading-spinner-container"><div className="loading-spinner" /></div>
      </div>
    )
  }

  if (error && products.length === 0) {
    return (
      <div className="product-detail-page">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
          <h2>Error loading product</h2>
          <p style={{ color: '#EF4444' }}>{error}</p>
          <button className="product-back-btn" onClick={() => navigate('/products')}>
            <ArrowLeft size={18} /> Back to Products
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
          <h2>Product not found</h2>
          <button className="product-back-btn" onClick={() => navigate('/products')}>
            <ArrowLeft size={18} /> Back to Products
          </button>
        </div>
      </div>
    )
  }

  const metaChips = [
    { icon: Package, label: `${product.units || 8} In Stock` },
    { icon: Package, label: '5.8kg' },
    { icon: Zap, label: 'Electrical' },
    { icon: Star, label: `${product.reviews || 4.7} Rating` },
    { icon: Tag, label: product.condition || 'New' }
  ]

  return (
    <div className="product-detail-page">
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
              <span className="breadcrumb-current">{product.name}</span>
            </div>
          </div>
          <div className="product-header-actions">
            <button className="product-header-action-btn update-info-btn">
              <Share2 size={16} />
              Update Info
            </button>
            <button className="product-header-action-btn refresh-btn">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>
      
      {/* Content Grid — Sidebar + Product Card */}
      <div className="product-detail-layout">
        {/* Left Sidebar */}
        <div className="product-detail-left">
          {/* Seller Card */}
          <div className="detail-card seller-card">
            <h3 className="detail-card-title">Seller Details</h3>
            <div className="seller-card-inner">
              <div className="seller-avatar-large">
                <img 
                  src="https://picsum.photos/80/80?random=501" 
                  alt="Seller"
                />
              </div>
              <div className="seller-name-large">Kamal Okelola</div>
              <div className="seller-role">Owner</div>
              <div className="seller-social-icons">
                <button className="seller-social-btn"><WhatsAppIcon /></button>
                <button className="seller-social-btn"><FacebookIcon /></button>
                <button className="seller-social-btn"><LinkedInIcon /></button>
                <button className="seller-social-btn"><InstagramIcon /></button>
                <button className="seller-social-btn"><XIcon /></button>
              </div>
              <div className="seller-action-buttons">
                <button className="seller-action-btn call-btn">
                  <Phone size={14} />
                  Call Us
                </button>
                <button className="seller-action-btn message-btn">
                  <MessageSquare size={14} />
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="detail-card reviews-card-sidebar">
            <h3 className="detail-card-title">Customer Reviews</h3>
            <div className="reviews-sidebar-list">
              {reviews.map(review => (
                <div key={review.id} className="review-sidebar-item">
                  <img src={review.avatar} alt={review.name} className="review-sidebar-avatar" />
                  <div className="review-sidebar-content">
                    <div className="review-sidebar-name">{review.name}</div>
                    <div className="review-sidebar-stars">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={12} fill={i <= review.rating ? '#FFB400' : 'none'} stroke={i <= review.rating ? 'none' : '#E0E0E0'} />
                      ))}
                    </div>
                    <div className="review-sidebar-date">{review.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Features */}
          <div className="detail-card features-card">
            <h3 className="detail-card-title">Product Features</h3>
            <div className="features-grid-two-col">
              <div className="feature-checkbox-item">
                <CheckCircle2 size={18} className="feature-check-icon" />
                <span>OEM Compatible</span>
              </div>
              <div className="feature-checkbox-item">
                <CheckCircle2 size={18} className="feature-check-icon" />
                <span>5.8 kg Weight</span>
              </div>
              <div className="feature-checkbox-item">
                <CheckCircle2 size={18} className="feature-check-icon" />
                <span>RoHS Certified</span>
              </div>
              <div className="feature-checkbox-item">
                <CheckCircle2 size={18} className="feature-check-icon" />
                <span>Bulk Available</span>
              </div>
              <div className="feature-checkbox-item">
                <CheckCircle2 size={18} className="feature-check-icon" />
                <span>ISO 9001</span>
              </div>
              <div className="feature-checkbox-item">
                <CheckCircle2 size={18} className="feature-check-icon" />
                <span>Invoice Issued</span>
              </div>
              <div className="feature-checkbox-item">
                <CheckCircle2 size={18} className="feature-check-icon" />
                <span>Brand New</span>
              </div>
              <div className="feature-checkbox-item">
                <CheckCircle2 size={18} className="feature-check-icon" />
                <span>Tracked Ship</span>
              </div>
              <div className="feature-checkbox-item">
                <CheckCircle2 size={18} className="feature-check-icon" />
                <span>Fast Dispatch</span>
              </div>
              <div className="feature-checkbox-item">
                <CheckCircle2 size={18} className="feature-check-icon" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Product Card */}
        <div className="product-detail-main-column">
          <div className="detail-card product-main-card">
            {/* Hero Image */}
            <div className="product-hero-wrapper">
              <img
                src={selectedImage}
                alt={product.name}
                className="product-hero-image"
              />
              <div className="product-hero-bookmark">
                <Bookmark size={18} color="#5F5F5F" />
              </div>
              <div className="product-hero-badge">
                <span className="hero-badge-pill badge-in-stock">In Stock</span>
              </div>
            </div>

            {/* Product Info Row */}
            <div className="product-info-row">
              <h2 className="product-info-title">{product.name || 'Alternator 12V'}</h2>
              <div className="product-action-icons">
                <button className="product-action-icon-btn"><Share2 size={18} /></button>
                <button className="product-action-icon-btn"><Heart size={18} /></button>
                <button className="product-action-icon-btn"><Star size={18} /></button>
                <button className="product-action-icon-btn"><MoreHorizontal size={18} /></button>
              </div>
            </div>

            {/* Category */}
            <div className="product-category-line">
              <MapPin size={14} />
              12V • {product.category || 'Electrical'}
            </div>

            {/* Price Row */}
            <div className="product-price-row">
              <span className="product-price-large">₦{product.price ? product.price.toLocaleString() : '7,526'}</span>
              <span className="product-margin-badge">34% margin</span>
            </div>

            {/* Meta Chips */}
            <div className="product-meta-chips">
              {metaChips.map((chip, i) => (
                <div key={i} className="meta-chip">
                  <chip.icon size={14} />
                  {chip.label}
                </div>
              ))}
            </div>

            {/* Stock Section */}
            <div className="product-stock-section">
              <div className="product-stock-header">
                <span className="product-stock-label">Stock Level — {product.units || 8} units remaining</span>
                <span className="product-stock-percent">10% in stock</span>
              </div>
              <div className="product-stock-bar">
                <div className="product-stock-fill" style={{ width: '10%' }} />
              </div>
            </div>

            {/* Description */}
            <div className="product-description-section">
              <h3 className="description-heading">Description</h3>
              <p className="description-text">
                {product.description || 'OEM-spec 12V alternator for reliable charging performance. Tested for 100,000+ hours of operation.'}
              </p>
            </div>

            {/* Vehicle Compatibility */}
            <div className="product-compatibility-section">
              <h3 className="compatibility-heading">Vehicle Compatibility</h3>
              <p className="compatibility-subtext">
                Ford Focus 2012–2019, Kia Sportage 2011–2018, Hyundai Tucson 2010–2017. Also fits select models from Chevrolet, Nissan, and Honda.
              </p>
            </div>

            {/* Footer */}
            <div className="product-card-footer">
              <span className="product-view-more">View More Details <ChevronRight size={14} /></span>
              <div className="product-card-meta">
                <span>Warranty: {product.warranty || '18 months'}</span>
                <span>SKU: {product.sku || 'ELC-089'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section — Full Width */}
      <div className="detail-card gallery-section-full">
        <h3 className="detail-card-title">Gallery</h3>
        <div className="gallery-grid-full">
          {productImages.map((img, index) => (
            <div
              key={index}
              className={`gallery-thumb ${selectedImage === img ? 'active' : ''}`}
              onClick={() => setSelectedImage(img)}
            >
              <img src={img} alt={`Gallery ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Location Section — Full Width */}
      <div className="detail-card location-section-full">
        <h3 className="detail-card-title">Location</h3>
        <div className="location-map-container">
          <div className="location-map-area">
            <iframe
              title="map"
              className="location-map-iframe"
              src="https://www.openstreetmap.org/export/embed.html?bbox=3.33,6.58,3.37,6.62&layer=mapnik&marker=6.6018,3.3515"
              loading="lazy"
            />
            <div className="map-pin-center">
              <MapPin size={28} color="#FF7101" />
            </div>
            <div className="location-info-float">
              <div className="location-info-header">
                <MapPin size={16} color="#FF7101" />
                <span className="location-info-title">Lagos, Nigeria</span>
              </div>
              <div className="location-info-subtitle">AutoParts Pro Warehouse</div>
              <div className="location-info-rating">
                <Star size={12} fill="#FFB400" stroke="none" />
                <span className="location-rating-value">5.0</span>
                <span className="location-rating-count">6546 reviews</span>
              </div>
              <div className="location-info-link">View larger map</div>
            </div>
            <div className="location-preview-float">
              <div className="preview-map-thumb" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#000000">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="url(#instagramGradient)">
      <defs>
        <linearGradient id="instagramGradient" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor="#F58529"/>
          <stop offset="50%" stopColor="#DD2A7B"/>
          <stop offset="100%" stopColor="#8134AF"/>
        </linearGradient>
      </defs>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}
