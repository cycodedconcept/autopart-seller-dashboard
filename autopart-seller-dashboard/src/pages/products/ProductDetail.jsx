import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { deleteProduct } from '../../features/productSlice'
import { 
  ArrowLeft, MapPin, Tag, Package, Trash2, Edit, Star, 
  CheckCircle, Share2, MessageSquare, ChevronRight, ChevronLeft
} from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const products = useSelector(s => s.products.list.length > 0 ? s.products.list : [])
  const product = products.find(p => p.id === id) || products[0]
  
  const [activeImg, setActiveImg] = useState(0)
  
  // Prepare product images - use product.images if available, otherwise create from product.image
  const productImages = product?.images && product.images.length > 0 
    ? product.images 
    : (product?.image 
      ? [product.image] 
      : [
          'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=400',
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400',
          'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&q=80&w=400',
          'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?auto=format&fit=crop&q=80&w=400'
        ])
  
  const reviews = [
    { 
      id: 1, 
      name: "Adewale O.", 
      avatar: "https://picsum.photos/80/80?random=401", 
      rating: 5, 
      date: "2 weeks ago", 
      text: "Excellent product! Works perfectly as described. The quality is top-notch and installation was straightforward." 
    },
    { 
      id: 2, 
      name: "Chukwuemeka N.", 
      avatar: "https://picsum.photos/80/80?random=402", 
      rating: 4, 
      date: "1 month ago", 
      text: "Good product, delivery was fast. Would recommend to anyone looking for reliable auto parts." 
    }
  ]
  
  const handleDelete = () => {
    if (product && window.confirm(`Delete "${product.name}"?`)) {
      dispatch(deleteProduct(product.id))
      navigate('/products')
    }
  }
  
  const handlePrevImage = () => {
    setActiveImg(prev => (prev === 0 ? productImages.length - 1 : prev - 1))
  }
  
  const handleNextImage = () => {
    setActiveImg(prev => (prev === productImages.length - 1 ? 0 : prev + 1))
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '60vh',
          gap: '16px'
        }}>
          <h2>Product not found</h2>
          <button 
            className="product-back-btn" 
            onClick={() => navigate('/products')}
          >
            <ArrowLeft size={18} />
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <div className="product-breadcrumb">
        <Link to="/products" className="breadcrumb-link">Products</Link>
        <ChevronRight size={14} />
        <span className="breadcrumb-current">{product.name}</span>
      </div>
      
      {/* Header */}
      <div className="product-detail-header">
        <div className="product-header-left">
          <button className="product-back-btn" onClick={() => navigate('/products')}>
            <ArrowLeft size={18} />
          </button>
          <div className="product-header-text">
            <h1 className="product-detail-title">{product.name}</h1>
            <div className="product-detail-meta">
              <span className="product-detail-sku">{product.sku}</span>
              <div className="product-detail-rating">
                <Star size={16} fill="#FFD700" />
                <span>{product.reviews || 4.7}</span>
                <span className="product-rating-count">({product.sold || 128} reviews)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="product-header-right">
          <button className="product-share-btn">
            <Share2 size={18} />
            Share
          </button>
          <Link to={`/products/edit/${product.id}`} className="product-edit-btn-header">
            <Edit size={18} />
            Edit
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="product-detail-layout">
        {/* Left Column */}
        <div className="product-detail-left">
          {/* Image Gallery */}
          <div className="product-gallery-card">
            <div className="product-main-image-wrapper">
              <img
                src={productImages[activeImg]}
                alt={product.name}
                className="product-main-image"
              />
              {productImages.length > 1 && (
                <>
                  <button className="product-img-nav-btn left" onClick={handlePrevImage}>
                    <ChevronLeft size={24} />
                  </button>
                  <button className="product-img-nav-btn right" onClick={handleNextImage}>
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              <span className={`product-status-badge ${
                product.status === 'In Stock' ? 'status-in-stock' :
                product.status === 'Low Stock' ? 'status-low-stock' : 'status-out'
              }`}>
                {product.status}
              </span>
            </div>
            {productImages.length > 1 && (
              <div className="product-thumbnails">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    className={`product-thumbnail ${activeImg === index ? 'active' : ''}`}
                    onClick={() => setActiveImg(index)}
                  >
                    <img src={img} alt={`View ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product features/specs */}
          <div className="product-specs-card">
            <h3 className="specs-title">Specifications</h3>
            <div className="specs-grid">
              <div className="spec-row">
                <span className="spec-label">Brand</span>
                <span className="spec-value">{product.brand || 'N/A'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Category</span>
                <span className="spec-value">{product.category || 'N/A'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Condition</span>
                <span className="spec-value">{product.condition || 'New'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Compatibility</span>
                <span className="spec-value">{product.compatibility || 'Universal'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Year</span>
                <span className="spec-value">{product.year || '2020-2024'}</span>
              </div>
            </div>
          </div>
          
          {/* Vehicle compatibility */}
          <div className="product-compatibility-card">
            <div className="compatibility-header">
              <h3 className="compatibility-title">Vehicle Compatibility</h3>
              <div className="compatibility-count">10+ vehicles</div>
            </div>
            <div className="compatibility-list">
              <div className="compatibility-item">
                <CheckCircle size={16} color="#10B981" />
                <span>Toyota Camry 2018-2024 (7 cars)</span>
              </div>
              <div className="compatibility-item">
                <CheckCircle size={16} color="#10B981" />
                <span>Lexus ES350 2019-2023 (3 cars)</span>
              </div>
              <div className="view-more-btn">
                View More <ChevronRight size={14} />
              </div>
            </div>
          </div>
          
          {/* Gallery grid */}
          <div className="product-gallery-section">
            <h3 className="gallery-title">Gallery</h3>
            <div className="product-gallery-grid">
              {productImages.map((img, index) => (
                <div 
                  key={index} 
                  className="gallery-item"
                  onClick={() => setActiveImg(index)}
                >
                  <img src={img} alt={`Gallery ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Location */}
          <div className="product-location-card">
            <h3 className="location-title">Location</h3>
            <div className="location-wrapper">
              <div className="location-map">
                <div className="map-placeholder">
                  <div className="map-pin">
                    <MapPin size={24} color="#FF7101" />
                  </div>
                </div>
              </div>
              <div className="location-details">
                <div className="location-name">
                  <MapPin size={16} />
                  {product.location || 'Ikeja, Lagos'}
                </div>
                <div className="location-stats">
                  <div className="location-stat">
                    <Star size={14} fill="#FFD700" />
                    <span>4.9</span>
                  </div>
                  <div className="location-stat">
                    <Package size={14} />
                    <span>346 products</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="product-detail-right">
          {/* Seller details */}
          <div className="product-seller-card">
            <h3 className="seller-title">Seller Details</h3>
            <div className="seller-info">
              <div className="seller-avatar">
                <img 
                  src="https://picsum.photos/80/80?random=501" 
                  alt="Seller"
                />
              </div>
              <div className="seller-details">
                <div className="seller-name">Kamal Okelola</div>
                <div className="seller-badge">
                  <CheckCircle size={14} color="#10B981" />
                  Verified Seller
                </div>
                <div className="seller-stats">
                  <div className="seller-stat">
                    <Star size={12} fill="#FFD700" />
                    <span>4.8</span>
                  </div>
                  <div className="seller-stat">
                    <MessageSquare size={12} />
                    <span>2.3k</span>
                  </div>
                  <div className="seller-stat">
                    <Package size={12} />
                    <span>952</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product info */}
          <div className="product-info-card">
            <div className="product-info-tags">
              <span className={`product-info-status ${
                product.status === 'In Stock' ? 'status-in-stock' :
                product.status === 'Low Stock' ? 'status-low-stock' : 'status-out'
              }`}>
                {product.status}
              </span>
              <span className="product-info-category">{product.category}</span>
            </div>
            
            <div className="product-price-section">
              <span className="product-price-currency">₦</span>
              <span className="product-price-value">
                {product.price ? product.price.toLocaleString() : '0'}
              </span>
            </div>
            
            <p className="product-info-description">
              {product.description || 'High-quality auto part designed for reliable performance and durability.'}
            </p>
            
            <hr className="product-info-divider" />
            
            <div className="product-info-stats">
              <div className="product-stat-item">
                <div className="stat-number">{product.units || 52}</div>
                <div className="stat-label">In Stock</div>
              </div>
              <div className="product-stat-divider" />
              <div className="product-stat-item">
                <div className="stat-number">{product.sold || 76}</div>
                <div className="stat-label">Sold</div>
              </div>
              <div className="product-stat-divider" />
              <div className="product-stat-item">
                <div className="stat-number">{product.reviews ? Math.round(product.reviews * 25) : 128}</div>
                <div className="stat-label">Reviews</div>
              </div>
            </div>
            
            <hr className="product-info-divider" />
            
            <div className="product-info-actions">
              <Link to={`/products/edit/${product.id}`} className="product-action-btn edit">
                <Edit size={18} />
                Edit Product
              </Link>
              <button className="product-action-btn delete" onClick={handleDelete}>
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
          
          {/* Customer reviews */}
          <div className="product-reviews-card">
            <h3 className="reviews-title">Customer Reviews</h3>
            <div className="reviews-header">
              <div className="reviews-rating-summary">
                <div className="rating-number">{product.reviews || 4.7}</div>
                <div>
                  <div className="reviews-stars-large">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={16} fill={i <= Math.round(product.reviews || 4.7) ? '#FFD700' : '#e0e0e0'} />
                    ))}
                  </div>
                  <div className="reviews-count-text">{reviews.length} reviews</div>
                </div>
              </div>
            </div>
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review.id} className="review-item">
                  <img src={review.avatar} alt={review.name} className="review-avatar" />
                  <div className="review-content">
                    <div className="review-header">
                      <div className="review-name">{review.name}</div>
                      <div className="review-date">{review.date}</div>
                    </div>
                    <div className="review-stars">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#FFD700" />
                      ))}
                    </div>
                    <div className="review-text">{review.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
