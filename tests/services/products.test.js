import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server, endpoint } from '../mocks/server'
import { formValues, productDetail, listItem, pagination, success } from '../mocks/fixtures'
import * as service from '../../src/services/products'
import { API_ORIGIN } from '../../src/config/constant'

const png = () => new File(['image'], 'photo.png', { type: 'image/png' })
describe('seller product services', () => {
  it('requests active products with server pagination and bearer authentication', async () => {
    server.use(http.get(endpoint('/seller/products'), ({ request }) => {
      expect(request.headers.get('Authorization')).toBe('Bearer test-seller-token')
      expect(Object.fromEntries(new URL(request.url).searchParams)).toEqual({ status: 'active', page: '2', limit: '25' })
      return HttpResponse.json(success({ products: [listItem], pagination }))
    }))
    expect(await service.listProducts({ page: 2, limit: 25 })).toEqual({ products: [listItem], pagination })
  })
  it('fetches the full documented detail shape', async () => expect(await service.getProduct(4010)).toEqual(productDetail))
  it.each(['create', 'update'])('%s sends multipart data, integer kobo, string compatibility and repeated photos', async method => {
    const handler = method === 'create' ? http.post : http.patch
    server.use(handler(endpoint(`/seller/products${method === 'update' ? '/4010' : ''}`), async ({ request }) => {
      expect(request.headers.get('Authorization')).toBe('Bearer test-seller-token')
      expect(request.headers.get('Content-Type')).toMatch(/^multipart\/form-data; boundary=/)
      const body = await request.formData()
      expect(body.get('priceKobo')).toBe('8500001')
      expect(body.get('categoryId')).toBe('1006')
      expect(body.get('partNumber')).toBe(productDetail.partNumber)
      expect(typeof body.get('compatibility')).toBe('string')
      expect(JSON.parse(body.get('compatibility'))[0]).toEqual({ make: 'Mazda', model: 'CX-5 Signature', yearFrom: 2018, yearTo: 2021 })
      expect(body.getAll('photos')).toHaveLength(2)
      return HttpResponse.json(success(productDetail))
    }))
    const body = await service.buildProductFormData(formValues, { files: [png(), png()], replacePhotos: true })
    const result = method === 'create' ? await service.createProduct(body) : await service.updateProduct(4010, body)
    expect(result).toEqual(productDetail)
  })
  it('deletes with the seller token and unwraps the inactive response', async () => {
    server.use(http.delete(endpoint('/seller/products/4010'), ({ request }) => {
      expect(request.headers.get('Authorization')).toBe('Bearer test-seller-token')
      return HttpResponse.json(success({ ...productDetail, status: 'inactive' }))
    }))
    expect((await service.deleteProduct(4010)).status).toBe('inactive')
  })
  it('sends every inventory query parameter', async () => {
    server.use(http.get(endpoint('/seller/inventory'), ({ request }) => {
      expect(request.headers.get('Authorization')).toBe('Bearer test-seller-token')
      expect(Object.fromEntries(new URL(request.url).searchParams)).toEqual({ status: 'inactive', lowStockOnly: 'true', page: '3', limit: '50' })
      return HttpResponse.json(success({ inventory: [] }))
    }))
    expect(await service.getInventory({ status: 'inactive', lowStockOnly: true, page: 3, limit: 50 })).toEqual({ inventory: [] })
  })
  it('uploads the CSV under the file field', async () => {
    server.use(http.post(endpoint('/seller/inventory/bulk'), async ({ request }) => {
      expect(request.headers.get('Authorization')).toBe('Bearer test-seller-token')
      const body = await request.formData()
      expect(Array.from(body.keys())).toEqual(['file'])
      expect(body.get('file').name).toBe('inventory.csv')
      return HttpResponse.json(success({ createdCount: 2, products: [] }))
    }))
    expect(await service.bulkUpload(new File(['title\nRadiator'], 'inventory.csv', { type: 'text/csv' }))).toMatchObject({ createdCount: 2 })
  })
  it('retains images securely when replacing the photo set', async () => {
    server.use(http.get(`${API_ORIGIN}/uploads/keep.png`, ({ request }) => {
      expect(request.headers.has('Authorization')).toBe(false)
      expect(request.credentials).toBe('omit')
      return new HttpResponse(new Uint8Array([137, 80, 78, 71]), { headers: { 'Content-Type': 'image/png' } })
    }))
    const body = await service.buildProductFormData(formValues, { retainedPhotos: [{ url: 'uploads/keep.png' }], files: [png()], replacePhotos: true })
    expect(body.getAll('photos')).toHaveLength(2)
    expect(body.getAll('photos')[0].name).toBe('retained-0.png')
  })
  it('blocks PATCH preparation when retaining an image fails', async () => {
    server.use(http.get(`${API_ORIGIN}/uploads/broken.png`, () => new HttpResponse(null, { status: 404 })))
    await expect(service.buildProductFormData(formValues, { retainedPhotos: [{ url: 'uploads/broken.png' }], replacePhotos: true })).rejects.toThrow('could not be retained')
  })
  it('does not upload unchanged photos', async () => {
    const body = await service.buildProductFormData(formValues)
    expect(body.has('photos')).toBe(false)
    expect(body.get('description')).toBe(productDetail.description)
  })
  it.each([200, 422])('rejects a failure envelope with HTTP %s and preserves fields', async status => {
    server.use(http.post(endpoint('/seller/products'), () => HttpResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid title.', errors: { title: ['Title is too short.'] } } }, { status })))
    await expect(service.createProduct(new FormData())).rejects.toMatchObject({ message: 'Invalid title.', code: 'VALIDATION_ERROR', fieldErrors: { title: 'Title is too short.' } })
  })
  it('surfaces the actual malformed CSV row message', async () => {
    server.use(http.post(endpoint('/seller/inventory/bulk'), () => HttpResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'CSV row 2: title is required' } }, { status: 422 })))
    await expect(service.bulkUpload(new File(['bad'], 'bad.csv', { type: 'text/csv' }))).rejects.toMatchObject({ message: 'CSV row 2: title is required' })
  })
})
