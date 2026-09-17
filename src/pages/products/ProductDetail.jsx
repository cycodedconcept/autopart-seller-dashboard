import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProduct } from '../../features/productSlice'
import { formatNaira, koboToNaira } from '../../config/constant'
import ProductImage from '../../components/products/ProductImage'
import { ErrorNotice, LoadingRows } from '../../components/products/CatalogState'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { detail, detailLoading, detailError } = useSelector(state => state.products)
  const [selected, setSelected] = useState(null)
  useEffect(() => { dispatch(fetchProduct(id)); setSelected(null) }, [dispatch, id])
  const product = String(detail?.id) === id ? detail : null
  const photos = [...(product?.photos || [])].sort((a, b) => a.position - b.position)
  return <div className="catalog-page"><header className="catalog-header"><div><h1>Product details</h1><Link to="/products">Back to products</Link></div>
    {product && !detailLoading && !detailError && <Link className="catalog-button" to={`/products/edit/${id}`}>Edit product</Link>}</header>
    {detailError ? <ErrorNotice message={detailError.message} onRetry={() => dispatch(fetchProduct(id))} />
      : detailLoading || !product ? <LoadingRows /> : <div className="catalog-detail">
        <section className="catalog-panel"><ProductImage src={selected || photos[0]?.url || product.primaryImageUrl} alt={product.title} className="catalog-hero" />
          <div className="catalog-gallery">{photos.map((photo, index) => <button key={photo.id} className="catalog-gallery-button" onClick={() => setSelected(photo.url)} aria-label={`Show photo ${index + 1}`}>
            <ProductImage src={photo.url} alt={`${product.title}, photo ${index + 1}`} /></button>)}</div></section>
        <section className="catalog-panel"><span className="catalog-muted">{product.category.name}</span><h2>{product.title}</h2>
          <p className="catalog-price">{formatNaira(koboToNaira(product.priceKobo))}</p>
          <dl className="catalog-facts"><dt>Part number</dt><dd>{product.partNumber}</dd><dt>Condition</dt><dd>{product.condition}</dd>
            <dt>Stock</dt><dd>{product.stockQty} units</dd><dt>Location</dt><dd>{product.location}</dd>
            {product.createdAt && <><dt>Created</dt><dd>{new Date(product.createdAt).toLocaleString()}</dd></>}
          </dl><h3>Description</h3><p className="catalog-description">{product.description}</p>
          <h3>Vehicle compatibility</h3><ul>{product.compatibility.map((row, index) => <li key={row.id ?? index}>{row.make} {row.model} · {row.yearFrom}–{row.yearTo}</li>)}</ul>
        </section></div>}
  </div>
}
