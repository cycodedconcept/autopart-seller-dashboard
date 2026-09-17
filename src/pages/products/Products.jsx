import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { deleteProductThunk, fetchProducts } from '../../features/productSlice'
import { formatNaira, koboToNaira } from '../../config/constant'
import ProductImage from '../../components/products/ProductImage'
import { ErrorNotice, LoadingRows, Pagination } from '../../components/products/CatalogState'

export default function Products() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { list, loading, error, pagination, deletingId, deleteError } = useSelector(state => state.products)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [message, setMessage] = useState(location.state?.message || '')
  const dialog = useRef(null)
  useEffect(() => { dispatch(fetchProducts({ page, limit })) }, [dispatch, page, limit])
  useEffect(() => {
    if (pendingDelete && dialog.current && !dialog.current.open) dialog.current.showModal()
  }, [pendingDelete])
  const remove = async () => {
    const action = await dispatch(deleteProductThunk(pendingDelete.id))
    if (deleteProductThunk.fulfilled.match(action)) {
      setPendingDelete(null); setMessage('Product removed.')
      if (list.length === 1 && page > 1) setPage(page - 1)
      else dispatch(fetchProducts({ page, limit }))
    } else setPendingDelete(null)
  }
  return <div className="catalog-page">
    <header className="catalog-header"><div><h1>Products</h1><p>Manage the active listings in your shop.</p></div>
      <Link className="catalog-button" to="/products/add">Add product</Link></header>
    {message && <div role="status" className="catalog-success">{message}</div>}
    {deleteError && <ErrorNotice message={deleteError.message} />}
    {error ? <ErrorNotice message={error.message} onRetry={() => dispatch(fetchProducts({ page, limit }))} />
      : loading ? <LoadingRows />
        : list.length === 0 ? <div className="catalog-empty"><h2>No products yet</h2><p>Add your first product to start your catalog.</p><Link to="/products/add">Add product</Link></div>
          : <div className="catalog-table-wrap"><table className="catalog-table"><thead><tr>
            <th>Product</th><th>Part number</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
          </tr></thead><tbody>{list.map(product => <tr key={product.id}>
            <td><Link className="catalog-product-link" to={`/products/${product.id}`}><ProductImage src={product.primaryImageUrl} alt={product.title} /><span>{product.title}</span></Link></td>
            <td>{product.partNumber}</td><td>{product.category.name}</td><td>{formatNaira(koboToNaira(product.priceKobo))}</td>
            <td>{product.stockQty} units</td><td><span className="catalog-badge">{product.status}</span></td>
            <td><div className="catalog-actions"><Link className="catalog-button secondary" to={`/products/edit/${product.id}`} aria-label={`Edit ${product.title}`}>Edit</Link>
              <button className="catalog-button danger" disabled={deletingId != null} aria-label={`Delete ${product.title}`} onClick={() => { setMessage(''); setPendingDelete(product) }}>Delete</button></div></td>
          </tr>)}</tbody></table></div>}
    {!error && <Pagination pagination={pagination} page={page} limit={limit} busy={loading || deletingId != null} onPage={setPage} onLimit={value => { setLimit(value); setPage(1) }} />}
    {pendingDelete && <dialog ref={dialog} className="catalog-dialog" aria-labelledby="delete-title" onCancel={event => {
      if (deletingId != null) event.preventDefault(); else setPendingDelete(null)
    }}>
      <h2 id="delete-title">Remove {pendingDelete.title}?</h2>
      <p>This removes the product from your active listings. Its inactive record will remain in inventory.</p>
      <div className="catalog-actions"><button autoFocus className="catalog-button secondary" disabled={deletingId != null} onClick={() => setPendingDelete(null)}>Cancel</button>
        <button className="catalog-button danger" disabled={deletingId != null} onClick={remove}>{deletingId != null ? 'Removing…' : 'Remove product'}</button></div>
    </dialog>}
  </div>
}
