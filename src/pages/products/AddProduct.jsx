import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createProduct } from '../../features/productSlice'
import ProductForm from '../../components/products/ProductForm'

export default function AddProduct() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  return <div className="catalog-page"><header className="catalog-header"><div><h1>Add product</h1><p>Create a listing for your shop.</p></div></header>
    <ProductForm onSubmit={async formData => {
      await dispatch(createProduct(formData)).unwrap()
      navigate('/products', { state: { message: 'Product created.' } })
    }} />
  </div>
}
