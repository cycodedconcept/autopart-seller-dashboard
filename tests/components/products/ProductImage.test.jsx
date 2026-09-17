import { it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductImage from '../../../src/components/products/ProductImage'
import { PRODUCT_PLACEHOLDER } from '../../../src/utils/productImages'
it('shows loading, then the loaded image, and falls back after failure', () => {
  const { rerender } = render(<ProductImage src="uploads/a.png" alt="Product" />)
  expect(screen.getByAltText('Product').parentElement).toHaveAttribute('aria-busy', 'true')
  fireEvent.load(screen.getByAltText('Product'))
  expect(screen.getByAltText('Product').parentElement).toHaveAttribute('aria-busy', 'false')
  rerender(<ProductImage src="uploads/b.png" alt="Product" />)
  expect(screen.getByAltText('Product').parentElement).toHaveAttribute('aria-busy', 'true')
  fireEvent.error(screen.getByAltText('Product'))
  expect(screen.getByAltText('Product')).toHaveAttribute('src', PRODUCT_PLACEHOLDER)
})
