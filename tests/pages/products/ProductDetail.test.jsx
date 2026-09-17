import { it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import ProductDetail from '../../../src/pages/products/ProductDetail'
import { renderScreen } from '../../render'
import { productDetail, success } from '../../mocks/fixtures'
import { server, endpoint } from '../../mocks/server'
it('loads detail on direct navigation, preserves zero values and shows the real gallery', async () => {
  server.use(http.get(endpoint('/products/:id'), () => HttpResponse.json(success({ ...productDetail, priceKobo: 0, stockQty: 0 })) ))
  renderScreen(<ProductDetail />, { path: '/products/4010', route: '/products/:id' })
  expect(await screen.findByText(productDetail.description)).toBeVisible()
  expect(screen.getByText('₦0')).toBeVisible()
  expect(screen.getByText('0 units')).toBeVisible()
  expect(screen.getAllByRole('button', { name: /Show photo/ })).toHaveLength(2)
  expect(screen.getByText('Mazda CX-5 Signature · 2018–2021')).toBeVisible()
})
