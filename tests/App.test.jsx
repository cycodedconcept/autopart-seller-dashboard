import { expect, it } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import App from '../src/App'
import authReducer from '../src/features/authSlice'
import { endpoint, server } from './mocks/server'

it('ends an expired session on the login route without reloading the page', async () => {
  window.history.replaceState({}, '', '/login')
  localStorage.setItem('token', 'expired-token')
  const initial = authReducer(undefined, { type: 'init' })
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { ...initial, token: 'expired-token', user: null, sellerProfile: null } },
  })
  server.use(http.get(endpoint('/seller/me'), () => HttpResponse.json({
    success: false,
    error: { code: 'UNAUTHORIZED', message: 'Your session has expired.' },
  }, { status: 401 })))

  render(<Provider store={store}><App /></Provider>)

  expect(screen.getByRole('heading', { name: 'Login Into AutoParts' })).toBeVisible()
  await waitFor(() => expect(store.getState().auth.token).toBeNull())
  expect(window.location.pathname).toBe('/login')
})
