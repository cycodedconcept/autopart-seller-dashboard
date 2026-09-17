import { it, expect } from 'vitest'
import { http, HttpResponse, delay } from 'msw'
import { configureStore } from '@reduxjs/toolkit'
import reducer, { fetchProducts, fetchInventory } from '../../src/features/productSlice'
import { server, endpoint } from '../mocks/server'
import { listItem, pagination, success } from '../mocks/fixtures'
it('ignores an older product response that arrives after the latest page', async () => {
  server.use(http.get(endpoint('/seller/products'), async ({ request }) => {
    const page = Number(new URL(request.url).searchParams.get('page'))
    await delay(page === 1 ? 100 : 10)
    return HttpResponse.json(success({ products: [{ ...listItem, id: page }], pagination: { ...pagination, page } }))
  }))
  const store = configureStore({ reducer: { products: reducer } })
  await Promise.all([store.dispatch(fetchProducts({ page: 1 })), store.dispatch(fetchProducts({ page: 2 }))])
  expect(store.getState().products.list[0].id).toBe(2)
  expect(store.getState().products.pagination.page).toBe(2)
})
it('keeps product pagination separate from inventory pagination', async () => {
  server.use(http.get(endpoint('/seller/products'), () => HttpResponse.json(success({ products: [listItem], pagination: { ...pagination, total: 88 } }))))
  const store = configureStore({ reducer: { products: reducer } })
  await store.dispatch(fetchProducts())
  await store.dispatch(fetchInventory())
  expect(store.getState().products.pagination.total).toBe(88)
  expect(store.getState().products.inventoryPagination.total).toBe(1)
})
