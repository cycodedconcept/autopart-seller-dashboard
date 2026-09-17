import { describe, it, expect } from 'vitest'
import { koboToNaira, nairaToKobo, formatNaira } from '../../src/config/constant'

describe('money conversion', () => {
  it.each([0, 1, 99, 100, 8500000, 8500001, 123456789012345])('round trips %s kobo', kobo => {
    expect(nairaToKobo(koboToNaira(kobo))).toBe(kobo)
  })
  it('converts decimal input without floating point rounding', () => {
    expect(nairaToKobo('1.15')).toBe(115)
    expect(nairaToKobo('85000.01')).toBe(8500001)
    expect(formatNaira(koboToNaira(8500001))).toBe('₦85,000.01')
  })
  it.each(['', '1,000', '₦200', '1.001', 'NaN', '1e3', '90071992547410'])('rejects invalid input %s', value => expect(() => nairaToKobo(value)).toThrow())
  it('rejects non-integer kobo', () => expect(() => koboToNaira(1.5)).toThrow())
})
