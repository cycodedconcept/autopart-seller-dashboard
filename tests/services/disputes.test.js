import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server, endpoint } from '../mocks/server'
import { success } from '../mocks/fixtures'
import { disputeDetail, disputePagination } from '../mocks/disputes'
import { evidenceRequestUrl, getDisputeEvidence, getSellerDispute, listSellerDisputes, respondToSellerDispute } from '../../src/services/disputes'

describe('seller dispute services', () => {
  it('lists seller disputes with bearer auth and server filters', async () => {
    server.use(http.get(endpoint('/seller/disputes'), ({ request }) => {
      expect(request.headers.get('Authorization')).toBe('Bearer test-seller-token')
      expect(Object.fromEntries(new URL(request.url).searchParams)).toEqual({ status: 'in_review', dateFrom: '2026-09-01', dateTo: '2026-09-17', page: '2', limit: '25' })
      return HttpResponse.json(success({ disputes: [], pagination: disputePagination, filters: {} }))
    }))
    await listSellerDisputes({ status: 'in_review', dateFrom: '2026-09-01', dateTo: '2026-09-17', page: 2, limit: 25 })
  })

  it('loads and unwraps one seller dispute', async () => {
    server.use(http.get(endpoint('/seller/disputes/7'), ({ request }) => {
      expect(request.headers.get('Authorization')).toBe('Bearer test-seller-token')
      return HttpResponse.json(success(disputeDetail))
    }))
    expect(await getSellerDispute(7)).toEqual(disputeDetail)
  })

  it('submits a trimmed message and repeated evidence fields as multipart data', async () => {
    const first = new File(['one'], 'one.png', { type: 'image/png' })
    const second = new File(['two'], 'two.webp', { type: 'image/webp' })
    server.use(http.post(endpoint('/seller/disputes/1/respond'), async ({ request }) => {
      expect(request.headers.get('Authorization')).toBe('Bearer test-seller-token')
      expect(request.headers.get('Content-Type')).toContain('multipart/form-data')
      const body = await request.formData()
      expect(body.get('message')).toBe('This is a complete seller response.')
      expect(body.getAll('evidence').map(file => file.name)).toEqual(['one.png', 'two.webp'])
      return HttpResponse.json(success(disputeDetail))
    }))
    expect(await respondToSellerDispute(1, { message: '  This is a complete seller response.  ', files: [first, second] })).toEqual(disputeDetail)
  })

  it('loads private evidence through the existing authenticated API client', async () => {
    expect(evidenceRequestUrl('https://autoparts.zubitechnologies.com/api/v1/dispute-evidence/photo.png')).toBe('/dispute-evidence/photo.png')
    expect(evidenceRequestUrl('/api/v1/dispute-evidence/photo.png')).toBe('/dispute-evidence/photo.png')
    server.use(http.get(endpoint('/dispute-evidence/photo.png'), ({ request }) => {
      expect(request.headers.get('Authorization')).toBe('Bearer test-seller-token')
      return new HttpResponse(new Blob(['private-image'], { type: 'image/png' }))
    }))
    const blob = await getDisputeEvidence('/api/v1/dispute-evidence/photo.png')
    expect(blob).toBeInstanceOf(Blob)
  })
})
