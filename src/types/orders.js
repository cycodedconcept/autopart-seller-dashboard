import PropTypes from 'prop-types'
import { PaginationType, SellerType } from './products'

const id = PropTypes.oneOfType([PropTypes.number, PropTypes.string])
const parentFields = {
  id: id.isRequired, status: PropTypes.string.isRequired,
  paymentMethod: PropTypes.string, paymentReference: PropTypes.string, paymentStatus: PropTypes.string.isRequired,
}
const itemFields = {
  id: id.isRequired, productId: id, title: PropTypes.string.isRequired, partNumber: PropTypes.string,
  condition: PropTypes.string, location: PropTypes.string, quantity: PropTypes.number.isRequired,
  unitPriceKobo: PropTypes.number.isRequired, lineTotalKobo: PropTypes.number.isRequired,
  itemStatus: PropTypes.string.isRequired, primaryImageUrl: PropTypes.string, seller: SellerType,
}
export const OrderItemType = PropTypes.shape(itemFields)
export const OrderAddressType = PropTypes.shape({
  id, label: PropTypes.string, street: PropTypes.string, city: PropTypes.string, state: PropTypes.string, phone: PropTypes.string,
})
export const SellerOrderType = PropTypes.shape({
  ...parentFields,
  subtotalKobo: PropTypes.number, deliveryFeeKobo: PropTypes.number, totalKobo: PropTypes.number,
  totalItems: PropTypes.number, sellerLineItems: PropTypes.number, sellerTotalItems: PropTypes.number,
  sellerTotalKobo: PropTypes.number, deliveryAddress: OrderAddressType,
  items: PropTypes.arrayOf(OrderItemType).isRequired, createdAt: PropTypes.string, updatedAt: PropTypes.string,
})
export const SellerOrderListType = PropTypes.shape({ orders: PropTypes.arrayOf(SellerOrderType).isRequired, pagination: PaginationType.isRequired })
export const OrderItemUpdateType = PropTypes.shape({
  ...itemFields, order: PropTypes.shape(parentFields).isRequired, createdAt: PropTypes.string, updatedAt: PropTypes.string,
})
