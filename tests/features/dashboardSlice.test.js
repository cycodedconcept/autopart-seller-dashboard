import { describe, expect, it } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { http, HttpResponse } from 'msw'
import reducer, { buildOverviewCards, fetchDashboard, mapRevenueChart } from '../../src/features/dashboardSlice'
import { server, endpoint } from '../mocks/server'

const productCard = trend => buildOverviewCards({ productsListed: { value: 250, trend } })[0]

describe('dashboard revenue chart', () => {
  it('uses actual monthly amounts and labels without inventing a day for the tooltip', () => {
    const now = new Date()
    const [point] = mapRevenueChart({ year: now.getFullYear(), points: [{
      label: 'Current month', monthNumber: now.getMonth() + 1,
      netSalesKobo: 62000001, grossSalesKobo: 70000001, commissionKobo: 8000000,
    }] })
    expect(point).toMatchObject({ revenue: 620000.01, gross: 700000.01, commission: 80000,
      periodLabel: `Current month ${now.getFullYear()}`, active: true })
  })
  it('does not mark a month from a historical year as the current month', () => {
    const now = new Date()
    const [point] = mapRevenueChart({ year: now.getFullYear() - 1, points: [{ label: 'Previous year', monthNumber: now.getMonth() + 1, netSalesKobo: 0 }] })
    expect(point).toMatchObject({ revenue: 0, active: false })
  })
})

describe('dashboard card percentages', () => {
  it.each([
    [125, 100, '+25%', false],
    [80, 100, '-20%', true],
    [100, 100, '0%', false],
    [10, 5, '+100%', false],
    [0, 5, '-100%', true],
    [1, 3, '-66.7%', true],
    ['15', '10', '+50%', false],
  ])('compares actual period totals %s and %s', (currentPeriodValue, previousPeriodValue, change, changeDown) => {
    const card = productCard({ currentPeriodValue, previousPeriodValue, changePercent: 100, direction: 'up', label: 'Since last week' })
    expect(card).toMatchObject({ change, changeDown, changeLabel: 'Since last week', value: '250' })
  })

  it.each([
    { currentPeriodValue: 20, previousPeriodValue: 0, changePercent: 100 },
    { currentPeriodValue: 0, previousPeriodValue: 0, changePercent: 0 },
    { changePercent: 100 },
    { currentPeriodValue: 20, previousPeriodValue: null, changePercent: 100 },
    { currentPeriodValue: null, previousPeriodValue: 10 },
    { currentPeriodValue: 20, previousPeriodValue: '' },
    { currentPeriodValue: 20, previousPeriodValue: 'invalid' },
    { currentPeriodValue: 20, previousPeriodValue: -10 },
    { currentPeriodValue: Infinity, previousPeriodValue: 10 },
    { currentPeriodValue: false, previousPeriodValue: 10 },
    undefined,
  ])('omits a percentage without valid comparison totals: %j', trend => {
    expect(productCard(trend)).toMatchObject({ change: null, changeDown: false, value: '250' })
  })

  it('compares revenue in kobo while keeping the card value in naira', () => {
    const [card] = buildOverviewCards({ totalRevenue: {
      valueKobo: 8500000,
      trend: { currentPeriodValue: 8500000, previousPeriodValue: 8000000, changePercent: 6, delta: 500000, label: 'Since last week' },
    } })
    expect(card).toMatchObject({ valueNumeric: 85000, change: '+6.3%', changeLabel: 'Since last week' })
  })

  it('maps the dashboard API response without replacing missing comparisons with fake percentages', async () => {
    server.use(http.get(endpoint('/seller/dashboard'), () => HttpResponse.json({ success: true, data: { overviewCards: {
      productsListed: { value: 20, trend: { currentPeriodValue: 20, previousPeriodValue: 0, changePercent: 100 } },
      totalOrders: { value: 30, trend: { currentPeriodValue: 15, previousPeriodValue: 10, changePercent: 100 } },
    } }, message: 'OK' })))
    const store = configureStore({ reducer: { dashboard: reducer } })
    await store.dispatch(fetchDashboard())
    expect(store.getState().dashboard.error).toBeNull()
    expect(store.getState().dashboard.overviewCardsMapped).toEqual([
      expect.objectContaining({ key: 'productsListed', change: null }),
      expect.objectContaining({ key: 'totalOrders', change: '+50%' }),
    ])
  })
})
