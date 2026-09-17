import { expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import Layout from '../../src/components/Layout'
import { renderScreen } from '../render'

it('shows disputes in the seller sidebar', () => {
  renderScreen(<Layout />)
  expect(screen.getByRole('link', { name: 'Disputes' })).toHaveAttribute('href', '/disputes')
})

it('uses the current local time and seller name in the greeting', () => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 8, 17, 16, 36))
  try {
    renderScreen(<Layout />, { auth: { user: { fullName: 'Ben Safo' } } })
    expect(screen.getByText('Good afternoon, Ben Safo!')).toBeVisible()
  } finally {
    vi.useRealTimers()
  }
})
