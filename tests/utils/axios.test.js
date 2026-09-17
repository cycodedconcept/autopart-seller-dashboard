import { expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import api, { AUTH_UNAUTHORIZED_EVENT } from '../../src/utils/axios'
import { endpoint, server } from '../mocks/server'

it('clears an expired protected session without reloading the browser', async () => {
  localStorage.setItem('user', '{"id":9}')
  localStorage.setItem('sellerProfile', '{"id":3}')
  const unauthorized = vi.fn()
  window.addEventListener(AUTH_UNAUTHORIZED_EVENT, unauthorized, { once: true })
  server.use(http.get(endpoint('/seller/me'), () => HttpResponse.json({
    success: false,
    error: { code: 'UNAUTHORIZED', message: 'Your session has expired.' },
  }, { status: 401 })))

  await expect(api.get('/seller/me')).rejects.toMatchObject({ message: 'Your session has expired.', status: 401 })
  expect(unauthorized).toHaveBeenCalledOnce()
  expect(localStorage.getItem('token')).toBeNull()
  expect(localStorage.getItem('user')).toBeNull()
  expect(localStorage.getItem('sellerProfile')).toBeNull()
  expect(window.location.pathname).toBe('/')
})

it('does not clear the current session or emit logout for a rejected login request', async () => {
  const unauthorized = vi.fn()
  window.addEventListener(AUTH_UNAUTHORIZED_EVENT, unauthorized, { once: true })
  server.use(http.post(endpoint('/auth/login'), () => HttpResponse.json({
    success: false,
    error: { code: 'UNAUTHORIZED', message: 'Email or password is incorrect.' },
  }, { status: 401 })))

  await expect(api.post('/auth/login', {})).rejects.toMatchObject({ message: 'Email or password is incorrect.' })
  expect(unauthorized).not.toHaveBeenCalled()
  expect(localStorage.getItem('token')).toBe('test-seller-token')
})
