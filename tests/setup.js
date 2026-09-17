import '@testing-library/jest-dom/vitest'
import { Blob, File } from 'node:buffer'
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './mocks/server'

// Keep multipart binary types compatible with Node's Request parser used by MSW.
const NativeFormData = (await new Response('', { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).formData()).constructor
Object.assign(globalThis, { Blob, File, FormData: NativeFormData })

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => { cleanup(); server.resetHandlers(); vi.unstubAllGlobals() })
afterAll(() => server.close())
beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('token', 'test-seller-token')
  URL.createObjectURL = vi.fn(() => 'blob:test-photo')
  URL.revokeObjectURL = vi.fn()
})
HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
