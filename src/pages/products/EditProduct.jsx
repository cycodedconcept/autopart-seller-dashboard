import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchProduct, updateProductThunk } from '../../features/productSlice'
import ProductForm from '../../components/products/ProductForm'
import { ErrorNotice, LoadingRows } from '../../components/products/CatalogState'

export default function EditProduct() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { detail, detailLoading, detailError } = useSelector(state => state.products)
  useEffect(() => { dispatch(fetchProduct(id)) }, [dispatch, id])
  const product = String(detail?.id) === id ? detail : null
  return <div className="catalog-page"><header className="catalog-header"><div><h1>Edit product</h1><p>Update your listing details and photos.</p></div><Link to="/products">Back to products</Link></header>
    {detailError ? <ErrorNotice message={detailError.message} onRetry={() => dispatch(fetchProduct(id))} />
      : detailLoading || !product ? <LoadingRows />
        : <ProductForm key={id} product={product} onSubmit={async formData => {
          await dispatch(updateProductThunk({ id, formData })).unwrap()
          navigate('/products', { state: { message: 'Product updated.' } })
        }} />}
  </div>
}
