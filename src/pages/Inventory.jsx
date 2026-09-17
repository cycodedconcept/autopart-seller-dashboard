import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchInventory } from '../features/productSlice'
import { formatNaira, koboToNaira } from '../config/constant'
import ProductImage from '../components/products/ProductImage'
import BulkUpload from '../components/products/BulkUpload'
import { ErrorNotice, LoadingRows, Pagination } from '../components/products/CatalogState'

const summaryCards = [
  ['totalListings', 'Total listings'], ['activeListings', 'Active listings'], ['inactiveListings', 'Inactive listings'],
  ['lowStockListings', 'Low stock'], ['outOfStockListings', 'Out of stock'], ['totalUnitsInStock', 'Units in stock'],
]
export default function Inventory() {
  const dispatch = useDispatch()
  const { inventory, inventorySummary, inventoryPagination, inventoryLoading, inventoryError } = useSelector(state => state.products)
  const [status, setStatus] = useState('all')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  useEffect(() => { dispatch(fetchInventory({ status, lowStockOnly, page, limit })) }, [dispatch, status, lowStockOnly, page, limit])
  const refresh = () => dispatch(fetchInventory({ status, lowStockOnly, page, limit }))
  return <div className="catalog-page"><header className="catalog-header"><div><h1>Inventory</h1><p>Stock levels across active and inactive listings.</p></div></header>
    {inventorySummary && <><div className="catalog-stats">{summaryCards.map(([key, label]) => <div className="catalog-stat" key={key}>
      <span>{label}</span><strong>{inventorySummary[key].toLocaleString()}</strong>
    </div>)}</div><p className="catalog-muted">Low-stock threshold: {inventorySummary.lowStockThreshold} units</p></>}
    <div className="catalog-filters"><label htmlFor="inventory-status">Listing status <select id="inventory-status" value={status} onChange={event => { setStatus(event.target.value); setPage(1) }}>
      <option value="all">All listings</option><option value="active">Active</option><option value="inactive">Inactive</option>
    </select></label><label><input type="checkbox" checked={lowStockOnly} onChange={event => { setLowStockOnly(event.target.checked); setPage(1) }} /> Low stock only</label></div>
    {inventoryError ? <ErrorNotice message={inventoryError.message} onRetry={refresh} />
      : inventoryLoading ? <LoadingRows /> : inventory.length === 0 ? <div className="catalog-empty"><h2>No inventory found</h2><p>Try different filters or upload a product CSV below.</p></div>
        : <div className="catalog-table-wrap"><table className="catalog-table"><thead><tr><th>Product</th><th>Part number</th><th>Category</th><th>Price</th><th>Stock</th><th>Stock status</th><th>Listing status</th><th>Added</th></tr></thead>
          <tbody>{inventory.map(item => <tr key={item.id}>
            <td><div className="catalog-product-link"><ProductImage src={item.primaryImageUrl} alt={item.title} />
              {item.status === 'active' ? <Link to={`/products/${item.id}`}>{item.title}</Link> : <span>{item.title}</span>}</div></td>
            <td>{item.partNumber}</td><td>{item.category.name}</td><td>{formatNaira(koboToNaira(item.priceKobo))}</td><td>{item.stockQty}</td>
            <td><span className={`catalog-badge ${item.isOutOfStock ? 'out' : item.isLowStock ? 'low' : ''}`}>{item.isOutOfStock ? 'Out of stock' : item.isLowStock ? 'Low stock' : 'In stock'}</span></td>
            <td>{item.status}</td><td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td>
          </tr>)}</tbody></table></div>}
    {!inventoryError && <Pagination pagination={inventoryPagination} page={page} limit={limit} busy={inventoryLoading} onPage={setPage} onLimit={value => { setLimit(value); setPage(1) }} />}
    <BulkUpload onComplete={() => { if (page !== 1) setPage(1); else refresh() }} />
  </div>
}
