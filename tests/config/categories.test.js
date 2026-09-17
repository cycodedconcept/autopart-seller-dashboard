import { it, expect } from 'vitest'
import { generatePartNumber } from '../../src/config/categories'
it.each([['radiators', 'RAD'], ['brake-system', 'BRAKE'], ['filters', 'FILTER'], ['suspension-steering', 'SUSP'], ['unknown-category', 'UNKN']])('generates the prefix for %s', (slug, prefix) => {
  expect(generatePartNumber(slug, 1789105240999)).toBe(`${prefix}-1789105240`)
})
