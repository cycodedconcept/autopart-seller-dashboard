import { expect, it } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import Login from '../../../src/pages/auth/Login'
import authReducer from '../../../src/features/authSlice'
import { endpoint, server } from '../../mocks/server'
import { success } from '../../mocks/fixtures'

const renderLogin = (auth = {}) => {
  const initial = authReducer(undefined, { type: 'init' })
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { ...initial, token: null, user: null, sellerProfile: null, ...auth } },
  })
  render(<Provider store={store}><MemoryRouter initialEntries={['/login']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<h1>Seller dashboard</h1>} />
      <Route path="/pending-verification" element={<h1>Pending verification</h1>} />
    </Routes>
  </MemoryRouter></Provider>)
  return store
}

it('does not leave the login page merely because a stale token exists', () => {
  renderLogin({ token: 'stale-token' })
  expect(screen.getByRole('heading', { name: 'Login Into AutoParts' })).toBeVisible()
  expect(screen.queryByText('Seller dashboard')).not.toBeInTheDocument()
})

it('navigates only after a successful login', async () => {
  server.use(http.post(endpoint('/auth/login'), () => HttpResponse.json(success({
    token: 'fresh-token',
    user: { id: 9, fullName: 'Seller User', email: 'seller@example.com' },
    sellerProfile: { id: 3, verificationStatus: 'approved' },
  }))))
  renderLogin()
  const user = userEvent.setup()
  await user.type(screen.getByPlaceholderText('Enter your email'), 'seller@example.com')
  await user.type(screen.getByPlaceholderText('Enter your password'), 'password123')
  await user.click(screen.getByRole('button', { name: 'Sign In' }))
  expect(await screen.findByRole('heading', { name: 'Seller dashboard' })).toBeVisible()
  expect(localStorage.getItem('token')).toBe('fresh-token')
})

it('keeps the form visible and shows the API message after a rejected login', async () => {
  server.use(http.post(endpoint('/auth/login'), () => HttpResponse.json({
    success: false,
    error: { code: 'UNAUTHORIZED', message: 'Email or password is incorrect.' },
  }, { status: 401 })))
  renderLogin()
  const user = userEvent.setup()
  await user.type(screen.getByPlaceholderText('Enter your email'), 'seller@example.com')
  await user.type(screen.getByPlaceholderText('Enter your password'), 'wrong-password')
  await user.click(screen.getByRole('button', { name: 'Sign In' }))
  expect(await screen.findByText('Email or password is incorrect.')).toBeVisible()
  expect(screen.getByRole('heading', { name: 'Login Into AutoParts' })).toBeVisible()
})
