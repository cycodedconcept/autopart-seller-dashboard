import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { refreshOrders, updateOrderStatusThunk } from '../../features/orderSlice'
import { orderActionBlockReason } from '../../utils/orders'
import { OrderItemType, SellerOrderType } from '../../types/orders'
import { ErrorNotice } from '../products/CatalogState'

export default function OrderItemActions({ order, item }) {
  const dispatch = useDispatch()
  const { updatingItemId, updateError } = useSelector(state => state.orders)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [message, setMessage] = useState('')
  const dialog = useRef(null)
  const busy = updatingItemId != null
  const saving = String(updatingItemId) === String(item.id)
  const blockReason = orderActionBlockReason(order, item)
  const error = String(updateError?.itemId) === String(item.id) ? updateError : null
  useEffect(() => {
    if (confirmCancel && dialog.current && !dialog.current.open) dialog.current.showModal()
  }, [confirmCancel])

  const update = async itemStatus => {
    if (busy || blockReason) return
    setMessage('')
    const action = await dispatch(updateOrderStatusThunk({ orderItemId: item.id, itemStatus }))
    setConfirmCancel(false)
    if (updateOrderStatusThunk.fulfilled.match(action)) {
      setMessage(itemStatus === 'ready_for_pickup' ? 'Item marked as ready for pickup.' : 'Order item cancelled.')
      dispatch(refreshOrders())
    }
  }

  return <div className="order-item-actions">
    {message && <div role="status" className="catalog-success">{message}</div>}
    {error && <ErrorNotice message={error.message} />}
    {blockReason ? <p className="catalog-muted">{blockReason}</p> : <div className="catalog-actions">
      <button className="catalog-button" disabled={busy} onClick={() => update('ready_for_pickup')}>
        {saving ? 'Updating…' : 'Mark as Ready for Pickup'}
      </button>
      <button className="catalog-button danger" disabled={busy} onClick={() => { setMessage(''); setConfirmCancel(true) }}>Cancel item</button>
    </div>}
    {confirmCancel && <dialog ref={dialog} className="catalog-dialog" aria-labelledby={`cancel-item-${item.id}`} onCancel={event => {
      if (busy) event.preventDefault(); else setConfirmCancel(false)
    }}>
      <h2 id={`cancel-item-${item.id}`}>Cancel {item.title}?</h2>
      <p>This cancels this item in order #{order.id}. Other items in the order are unaffected.</p>
      <div className="catalog-actions">
        <button autoFocus className="catalog-button secondary" disabled={busy} onClick={() => setConfirmCancel(false)}>Keep item</button>
        <button className="catalog-button danger" disabled={busy} onClick={() => update('cancelled')}>{saving ? 'Cancelling…' : 'Confirm cancellation'}</button>
      </div>
    </dialog>}
  </div>
}
OrderItemActions.propTypes = { order: SellerOrderType.isRequired, item: OrderItemType.isRequired }
