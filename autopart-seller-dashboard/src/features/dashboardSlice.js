import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/axios'
import {
  STAT_CARD_CONFIG,
  LOW_STOCK_THRESHOLD,
  koboToNaira,
  formatNaira,
  formatNumber,
} from '../config/constant'

const mapApiProductToDashboard = (p) => {
  const stockQty = Number(p.stockQty) || 0
  let status = 'In Stock'
  if (p.status && p.status !== 'active') status = 'Inactive'
  else if (stockQty <= 0) status = 'Out of Stock'
  else if (stockQty <= LOW_STOCK_THRESHOLD) status = 'Low Stock'

  const price = koboToNaira(p.priceKobo)
  const compatibility = p.compatibilityLabel
    || (Array.isArray(p.compatibility) && p.compatibility.length
      ? `${p.compatibility[0].make} ${p.compatibility[0].model}`
      : 'Universal')
  const image = p.primaryImageUrl
    || (Array.isArray(p.photos) && p.photos[0] && (p.photos[0].url || p.photos[0].secure_url || p.photos[0].imageUrl))
    || p.imageUrl
    || `https://placehold.co/600x400/FFF1E0/FF7101?text=${encodeURIComponent(p.title || 'Product')}`

  return {
    id: p.id,
    sku: p.partNumber || `SKU-${p.id}`,
    name: p.title,
    category: p.category?.name || 'General',
    price,
    image,
    location: p.location || 'N/A',
    status,
    stockQty,
    units: stockQty,
    compatibility,
    rating: Number(p.averageRating || 0),
    reviews: Number(p.reviewCount || 0),
    sold: Number(p.soldCount || 0),
    badges: p.tags || [],
  }
}

const mapApiTopCustomer = (c, idx) => ({
  id: c.buyerId || c.id || `cust-${idx}`,
  name: c.fullName || 'Customer',
  email: c.email || '',
  phone: c.phone || '',
  avatar: c.avatar
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.fullName || 'C')}&background=FF7101&color=fff&bold=true`,
  itemsSold: Number(c.totalOrders) || 0,
  itemsRented: 0,
  totalOrders: Number(c.totalOrders) || 0,
  totalItems: Number(c.totalItems) || 0,
  totalSpent: koboToNaira(c.totalSpentKobo),
  sales: koboToNaira(c.totalSpentKobo),
})

export const mapRevenueChart = (chart) => {
  if (!chart || !Array.isArray(chart.points)) return []
  const currentMonth = new Date().getMonth() + 1
  return chart.points.map(p => ({
    name: p.label || '',
    revenue: koboToNaira(p.netSalesKobo || 0),
    active: Number(p.monthNumber) === currentMonth,
    gross: koboToNaira(p.grossSalesKobo || 0),
    commission: koboToNaira(p.commissionKobo || 0),
    totalOrders: p.totalOrders || 0,
    totalItems: p.totalItems || 0,
  }))
}

export const buildOverviewCards = (apiCards) => {
  const cards = []
  const order = ['productsListed', 'totalOrders', 'totalCustomers', 'totalRevenue']
  if (!apiCards || typeof apiCards !== 'object') return cards
  order.forEach(key => {
    const cfg = STAT_CARD_CONFIG[key]
    if (!cfg) return
    const raw = apiCards[key]
    if (!raw) return
    const trend = raw.trend || {}
    const direction = String(trend.direction || '').toLowerCase()
    const isMoney = !!cfg.isMoney
    const rawValue = isMoney ? (raw.valueKobo ?? raw.value) : raw.value
    const numeric = Number(rawValue) || 0
    const value = isMoney
      ? formatNaira(koboToNaira(raw.valueKobo ?? raw.value), true)
      : formatNumber(numeric)

    const changePct = Number(trend.changePercent) || 0
    const changeDown = direction === 'down' || changePct < 0
    const changePctAbs = Math.abs(changePct)
    const change = `${changeDown ? '' : '+'}${changePctAbs.toFixed(changePctAbs % 1 === 0 ? 0 : 1)}%`
    const progressBase = Number(cfg.progressBase) || 0.3
    const changeFactor = Math.min(1, 0.5 + changePctAbs / 100)
    const progressPct = Math.max(4, Math.min(96, Math.round(progressBase * 100 * changeFactor)))

    cards.push({
      key,
      icon: cfg.icon,
      label: raw.label || cfg.label,
      value,
      valueNumeric: isMoney ? koboToNaira(raw.valueKobo ?? raw.value) : numeric,
      change,
      changeDown,
      changeLabel: trend.delta ? `vs last period (Δ ${(Number(trend.delta) || 0).toLocaleString()})` : 'Since last period',
      iconColor: cfg.iconColor,
      lineColor: cfg.lineColor,
      lightColor: cfg.lightColor,
      progressWidth: `${progressPct}%`,
      raw,
    })
  })
  return cards
}

export const fetchDashboard = createAsyncThunk('dashboard/fetchDashboard', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/seller/dashboard')
    return res
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    overviewCards: [],
    overviewCardsMapped: [],
    revenueChart: [],
    productStatus: { totalProducts: 0, inStock: 0, lowStock: 0, outOfStock: 0, lowStockThreshold: LOW_STOCK_THRESHOLD },
    featuredProducts: [],
    topCustomers: [],
    inventory: null,
    orders: null,
    sales: null,
    payouts: null,
    comparison: null,
    seller: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false
        const d = action.payload.data || {}
        state.overviewCards = d.overviewCards || null
        state.overviewCardsMapped = buildOverviewCards(d.overviewCards)
        state.revenueChart = mapRevenueChart(d.revenueChart)
        state.productStatus = d.productStatus || { totalProducts: 0, inStock: 0, lowStock: 0, outOfStock: 0, lowStockThreshold: LOW_STOCK_THRESHOLD }
        state.featuredProducts = Array.isArray(d.featuredProducts) && d.featuredProducts.length
          ? d.featuredProducts.map(mapApiProductToDashboard)
          : []
        state.topCustomers = Array.isArray(d.topCustomers) && d.topCustomers.length
          ? d.topCustomers.map(mapApiTopCustomer)
          : []
        state.inventory = d.inventory || null
        state.orders = d.orders || null
        state.sales = d.sales || null
        state.payouts = d.payouts || null
        state.comparison = d.comparison || null
        state.seller = d.seller || null
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default dashboardSlice.reducer
