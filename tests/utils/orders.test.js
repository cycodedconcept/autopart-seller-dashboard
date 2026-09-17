import { expect, it } from 'vitest'
import { formatOrderDate, orderActionBlockReason, orderAddress, orderCsvCell } from '../../src/utils/orders'
import { orderItem, sellerOrder } from '../mocks/orders'

it('uses the documented street field and formats dates locally', () => {
  expect(orderAddress(sellerOrder.deliveryAddress)).toBe('10 Test Street, Ikeja, Lagos')
  expect(orderAddress(null)).toBe('Not provided')
  expect(formatOrderDate(sellerOrder.createdAt)).toBe(new Date(sellerOrder.createdAt).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  }))
  expect(formatOrderDate('invalid')).toBe('Not available')
  expect(formatOrderDate(null)).toBe('Not available')
})
it('allows only paid pending item actions on eligible orders', () => {
  expect(orderActionBlockReason(sellerOrder, orderItem)).toBe('')
  expect(orderActionBlockReason({ ...sellerOrder, paymentStatus: 'pending' }, orderItem)).toContain('Awaiting payment')
  expect(orderActionBlockReason({ ...sellerOrder, status: 'delivered' }, orderItem)).toContain('no longer')
  expect(orderActionBlockReason(sellerOrder, { ...orderItem, itemStatus: 'ready_for_pickup' })).toContain('Ready for courier pickup')
  expect(orderActionBlockReason(sellerOrder, { ...orderItem, itemStatus: 'picked_up' })).toContain('No seller actions')
})
it('quotes CSV cells and prevents formulas from product titles', () => {
  expect(orderCsvCell('Brake, "front"')).toBe('"Brake, ""front"""')
  expect(orderCsvCell('=1+2')).toBe('"\'=1+2"')
  expect(orderCsvCell(85000.01)).toBe('"85000.01"')
})
