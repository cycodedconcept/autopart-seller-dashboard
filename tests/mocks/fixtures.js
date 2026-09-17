export const productDetail = {
  id: 4010, title: 'Mazda radiator', description: 'OEM radiator for Mazda CX-5 vehicles.',
  category: { id: 1006, name: 'Radiators', slug: 'radiators' }, partNumber: 'RAD-1789105240', condition: 'new',
  priceKobo: 8500001, stockQty: 30, location: 'Lagos', status: 'active',
  seller: { id: 1, businessName: 'Auto shop', rating: 0 },
  primaryImageUrl: 'uploads/radiator.png',
  photos: [{ id: 5016, url: 'uploads/second.png', position: 2 }, { id: 5015, url: 'uploads/radiator.png', position: 1 }],
  compatibility: [{ id: 6001, make: 'Mazda', model: 'CX-5 Signature', yearFrom: 2018, yearTo: 2021 }, { id: 6002, make: 'Toyota', model: 'Camry', yearFrom: 2009, yearTo: 2012 }],
  createdAt: '2026-07-09T16:20:17.000Z', updatedAt: '2026-07-09T16:20:17.000Z',
}
export const listItem = Object.fromEntries(Object.entries(productDetail).filter(([key]) => !['description', 'photos', 'compatibility'].includes(key)))
export const inventoryItem = { ...listItem, lowStockThreshold: 5, isLowStock: false, isOutOfStock: false }
export const summary = { totalListings: 7, activeListings: 5, inactiveListings: 2, lowStockListings: 3, outOfStockListings: 1, totalUnitsInStock: 96, lowStockThreshold: 5 }
export const pagination = { page: 1, limit: 10, total: 1, totalPages: 1 }
export const formValues = { title: productDetail.title, description: productDetail.description, categoryId: '1006', partNumber: productDetail.partNumber, condition: 'new', price: '85000.01', stockQty: '30', location: 'Lagos', compatibility: productDetail.compatibility }
export const success = data => ({ success: true, data, message: 'Success.' })
