import PropTypes from 'prop-types'

const id = PropTypes.oneOfType([PropTypes.number, PropTypes.string])
export const CategoryType = PropTypes.shape({ id: id.isRequired, name: PropTypes.string.isRequired, slug: PropTypes.string.isRequired })
export const SellerType = PropTypes.shape({ id: id.isRequired, businessName: PropTypes.string, rating: PropTypes.number })
export const PhotoType = PropTypes.shape({ id: id.isRequired, url: PropTypes.string.isRequired, position: PropTypes.number.isRequired })
export const CompatibilityType = PropTypes.shape({ id, make: PropTypes.string.isRequired, model: PropTypes.string.isRequired, yearFrom: PropTypes.number.isRequired, yearTo: PropTypes.number.isRequired })
const listFields = {
  id: id.isRequired, title: PropTypes.string.isRequired, category: CategoryType.isRequired,
  partNumber: PropTypes.string.isRequired, condition: PropTypes.string.isRequired,
  priceKobo: PropTypes.number.isRequired, stockQty: PropTypes.number.isRequired,
  location: PropTypes.string, seller: SellerType, primaryImageUrl: PropTypes.string,
  status: PropTypes.string, createdAt: PropTypes.string, updatedAt: PropTypes.string,
}
export const ProductListItemType = PropTypes.shape(listFields)
export const ProductDetailType = PropTypes.shape({
  ...listFields, description: PropTypes.string.isRequired,
  photos: PropTypes.arrayOf(PhotoType).isRequired,
  compatibility: PropTypes.arrayOf(CompatibilityType).isRequired,
})
export const InventoryItemType = PropTypes.shape({ ...listFields,
  lowStockThreshold: PropTypes.number.isRequired, isLowStock: PropTypes.bool.isRequired, isOutOfStock: PropTypes.bool.isRequired,
})
export const PaginationType = PropTypes.shape({ page: PropTypes.number, limit: PropTypes.number, total: PropTypes.number, totalPages: PropTypes.number })
export const InventorySummaryType = PropTypes.shape(Object.fromEntries([
  'totalListings', 'activeListings', 'inactiveListings', 'outOfStockListings',
  'lowStockListings', 'totalUnitsInStock', 'lowStockThreshold',
].map(key => [key, PropTypes.number.isRequired])))
export const ProductListResponseType = PropTypes.shape({ products: PropTypes.arrayOf(ProductListItemType), pagination: PaginationType })
export const InventoryResponseType = PropTypes.shape({ inventory: PropTypes.arrayOf(InventoryItemType), summary: InventorySummaryType, pagination: PaginationType })
export const BulkUploadResultType = PropTypes.shape({ createdCount: PropTypes.number.isRequired, lowStockThreshold: PropTypes.number, products: PropTypes.arrayOf(InventoryItemType) })
export const ApiErrorType = PropTypes.shape({ message: PropTypes.string.isRequired, code: PropTypes.string, status: PropTypes.number, fieldErrors: PropTypes.objectOf(PropTypes.string) })
export const successEnvelopeType = (payload) => PropTypes.shape({ success: PropTypes.bool.isRequired, data: payload, message: PropTypes.string })
export const FailureEnvelopeType = PropTypes.shape({ success: PropTypes.bool.isRequired, error: PropTypes.shape({ code: PropTypes.string, message: PropTypes.string.isRequired }) })
