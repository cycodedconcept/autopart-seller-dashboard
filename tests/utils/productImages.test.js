import { expect, it } from 'vitest'
import { API_ORIGIN } from '../../src/config/constant'
import { productImageUrl, PRODUCT_PLACEHOLDER } from '../../src/utils/productImages'
it.each(['uploads/photo.png', '/uploads/photo.png'])('resolves %s against the API origin', path => expect(productImageUrl(path)).toBe(`${API_ORIGIN}/uploads/photo.png`))
it.each(['https://example.com/photo.png', 'http://example.com/photo.png'])('preserves %s', path => expect(productImageUrl(path)).toBe(path))
it.each([null, undefined, '', '  '])('uses placeholder for %s', path => expect(productImageUrl(path)).toBe(PRODUCT_PLACEHOLDER))
it('keeps the placeholder stable when resolving an already mapped image', () => expect(productImageUrl(productImageUrl(null))).toBe(PRODUCT_PLACEHOLDER))
