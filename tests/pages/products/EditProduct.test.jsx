import { it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import EditProduct from '../../../src/pages/products/EditProduct'
import { renderScreen } from '../../render'
import { listItem, productDetail } from '../../mocks/fixtures'
import { server, endpoint } from '../../mocks/server'
it('loads full details on direct navigation even when only a reduced list item is cached', async () => {
  renderScreen(<EditProduct />, { path: '/products/edit/4010', route: '/products/edit/:id', products: { list: [listItem] } })
  expect(screen.getByRole('status', { name: 'Loading products' })).toBeVisible()
  expect(await screen.findByLabelText('Description')).toHaveValue(productDetail.description)
  expect(screen.getByLabelText('Model 1')).toHaveValue('CX-5 Signature')
  expect(screen.getAllByAltText(/Existing photo/)).toHaveLength(2)
})
it('does not render an editable form after a detail error', async () => {
  server.use(http.get(endpoint('/products/:id'), () => HttpResponse.json({ success: false, error: { message: 'Product was not found.' } }, { status: 404 })))
  renderScreen(<EditProduct />, { path: '/products/edit/4010', route: '/products/edit/:id' })
  expect(await screen.findByRole('alert')).toHaveTextContent('Product was not found.')
  expect(screen.queryByRole('button', { name: 'Save changes' })).not.toBeInTheDocument()
})
