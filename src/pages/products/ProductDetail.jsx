import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { deleteProduct } from '../../features/productSlice'
import { 
  ArrowLeft, MapPin, Tag, Package, Trash2, Edit, Star, StarHalf, 
  MessageSquare, CheckCircle, ChevronRight, Share2
} from 'lucide-react'
import { initialProducts } from '../../utils/mockData'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const products = useSelector(s => s.products.list.length > 0 ? s.products.list : initialProducts)
  const product = products.find(p => p.id === id) || products[0]
  
  const [activeImg, setActiveImg] = useState(0)
  const [showShareMenu, setShowShareMenu] = useState(false)

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <div className="page-title">Product not found</div>
        <Link to="/products" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: 20 }}>
          Back to Products
        </Link>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      dispatch(deleteProduct(product.id))
      navigate('/products')
    }
  }

  const productImages = product.images || [product.image]
  
  const reviews = [
    { id: 1, name: 'Adewale O.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', rating: 5, date: '2 weeks ago', text: 'Excellent product! Works perfectly as described.' },
    { id: 2, name: 'Fatima A.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', rating: 4, date: '3 weeks ago', text: 'Great quality, arrived on time. Would recommend.' },
    { id: 3, name: 'Chidera N.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', rating: 5, date: '1 month ago', text: 'Best auto parts I have purchased so far.' },
  ]

  const recommendedProducts = products.filter(p => p.id !== product.id).slice(0, 3)

  return (
    <div className="product-detail-page">
      {/* Back nav */}
      <button className="product-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        Back to Products
      </button>

      <div className="product-detail-layout">
        {/* Left Column */}
        <div className="product-detail-left">
          {/* Image Gallery */}
          <div className="product-gallery-card">
            <div className="product-main-image-container">
              <img
                src={productImages[activeImg]}
                alt={product.name}
                className="product-main-image"
              />
            </div>
            {productImages.length > 1 && (
              <div className="product-thumbnails">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    className={`product-thumbnail ${activeImg === index ? 'active' : ''}`}
                    onClick={() => setActiveImg(index)}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Specs */}
          <div className="product-specs-card">
            <h3 className="specs-title">Specifications</h3>
            <div className="specs-grid">
              {[
                ['SKU', product.sku],
                ['Brand', product.brand],
                ['Condition', product.condition],
                ['Category', product.category],
                ['Compatibility', product.compatibility],
                ['Units Available', product.units],
              ].map(([key, value]) => (
                <div key={key} className="spec-row">
                  <div className="spec-label">{key}</div>
                  <div className="spec-value">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Compatibility */}
          <div className="product-compatibility-card">
            <h3 className="compatibility-title">Vehicle Compatibility</h3>
            <div className="compatibility-list">
              {product.vehicles.map((vehicle, index) => (
                <div key={index} className="compatibility-item">
                  <CheckCircle size={16} color="#10B981" />
                  <span>{vehicle}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="product-reviews-card">
            <div className="reviews-header">
              <div className="reviews-title">Customer Reviews</div>
              <div className="reviews-rating-summary">
                <div className="reviews-stars">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <div className="reviews-count">(4.8 · 127 reviews)</div>
              </div>
            </div>
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review.id} className="review-item">
                  <img src={review.avatar} alt="" className="review-avatar" />
                  <div className="review-content">
                    <div className="review-header">
                      <div className="review-name">{review.name}</div>
                      <div className="review-date">{review.date}</div>
                    </div>
                    <div className="review-stars">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                      ))}
                    </div>
                    <div className="review-text">{review.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="product-detail-right">
          {/* Product Info */}
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
            <h1 className="product-info-title">{product.name}</h1>
            <div className="product-info-price">₦{product.price.toLocaleString()}</div>
            <p className="product-info-description">
              {product.description}
            </p>

            <hr className="product-info-divider" />

            <div className="product-info-meta">
              <div className="product-meta-item">
                <MapPin size={16} />
                <span>{product.location}</span>
              </div>
              <div className="product-meta-item">
                <Tag size={16} />
                <span>{product.sku}</span>
              </div>
              <div className="product-meta-item">
                <Package size={16} />
                <span>{product.units} units</span>
              </div>
            </div>

            <hr className="product-info-divider" />

            <div className="product-info-actions">
              <Link to={`/products/edit/${product.id}`} className="product-edit-btn">
                <Edit size={16} />
                Edit Product
              </Link>
              <button className="product-delete-btn" onClick={handleDelete}>
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>

          {/* Store Info */}
          <div className="product-store-card">
            <h3 className="store-title">Store Information</h3>
            <div className="store-header">
              <div className="store-avatar">
                <span>A</span>
              </div>
              <div className="store-info">
                <div className="store-name">AutoParts Hub Lagos</div>
                <div className="store-status">
                  <span className="status-dot"></span>
                  Verified Seller
                </div>
                <div className="store-location">{product.location}</div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="product-map-card">
            <div className="map-container">
              <MapPin size={32} color="var(--brand)" />
              <div className="map-location">{product.location}</div>
            </div>
          </div>

          {/* Recommended Products */}
          <div className="product-recommended-card">
            <h3 className="recommended-title">You May Also Like</h3>
            <div className="recommended-grid">
              {recommendedProducts.map(p => (
                <Link key={p.id} to={`/products/${p.id}`} className="recommended-item">
                  <img src={p.image} alt={p.name} className="recommended-img" />
                  <div className="recommended-name">{p.name}</div>
                  <div className="recommended-price">₦{p.price.toLocaleString()}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
