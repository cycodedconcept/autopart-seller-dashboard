export const orderItem = {
  id: 7, productId: 4010, title: 'Mazda radiator', partNumber: 'RAD-1789105240',
  condition: 'new', location: 'Lagos', quantity: 1, unitPriceKobo: 8500001,
  lineTotalKobo: 8500001, itemStatus: 'pending', primaryImageUrl: 'uploads/radiator.png',
  seller: { id: 9, businessName: 'Test seller', rating: 4.5 },
}
export const secondOrderItem = {
  ...orderItem, id: 8, productId: 4011, title: 'Brake pads', partNumber: 'BRAKE-1789105240',
  quantity: 2, unitPriceKobo: 2125001, lineTotalKobo: 4250002, itemStatus: 'ready_for_pickup',
  primaryImageUrl: 'https://example.com/disc-1.png',
}
export const sellerOrder = {
  id: 42, status: 'confirmed', paymentMethod: 'card', paymentReference: 'TEST-REFERENCE', paymentStatus: 'paid',
  subtotalKobo: 12750003, deliveryFeeKobo: 200000, totalKobo: 12950003, totalItems: 3,
  sellerLineItems: 2, sellerTotalItems: 3, sellerTotalKobo: 12750003,
  deliveryAddress: { id: 5, label: 'Workshop', street: '10 Test Street', city: 'Ikeja', state: 'Lagos', phone: '+2348000000000' },
  items: [orderItem, secondOrderItem], createdAt: '2026-09-11T10:00:00.000Z', updatedAt: '2026-09-11T10:00:00.000Z',
}
export const orderPagination = { page: 1, limit: 10, total: 1, totalPages: 1 }
export const orderUpdate = (itemStatus = 'ready_for_pickup', item = orderItem) => ({
  ...item, itemStatus,
  order: { id: sellerOrder.id, status: sellerOrder.status, paymentMethod: sellerOrder.paymentMethod, paymentReference: sellerOrder.paymentReference, paymentStatus: sellerOrder.paymentStatus },
  createdAt: sellerOrder.createdAt, updatedAt: '2026-09-11T10:15:00.000Z',
})
