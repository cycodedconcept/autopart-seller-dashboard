import { expect, it } from 'vitest'
import { isEvening, timeGreeting } from '../../src/utils/greeting'

it.each([
  [0, 'Good morning'],
  [11, 'Good morning'],
  [12, 'Good afternoon'],
  [16, 'Good afternoon'],
  [17, 'Good evening'],
  [23, 'Good evening'],
])('uses the correct greeting at hour %i', (hour, expected) => {
  expect(timeGreeting(new Date(2026, 8, 17, hour, 30))).toBe(expected)
})

it('uses the evening icon period from 5pm', () => {
  expect(isEvening(new Date(2026, 8, 17, 16, 59))).toBe(false)
  expect(isEvening(new Date(2026, 8, 17, 17))).toBe(true)
})
