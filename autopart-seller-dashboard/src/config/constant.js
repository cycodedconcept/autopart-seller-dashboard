export const API_URL = process.env.NODE_ENV === 'development' 
  ? '/api' 
  : 'https://autoparts.zubitechnologies.com/api/v1'

export const LOW_STOCK_THRESHOLD = 5

export const KOBO_PER_NAIRA = 100

export const koboToNaira = (kobo) => Math.floor((Number(kobo) || 0) / KOBO_PER_NAIRA)

export const formatNaira = (naira, compact = false) => {
  const n = Number(naira) || 0
  if (compact) {
    if (n >= 1e9) return `₦${(n / 1e9).toFixed(1).replace(/\.0$/, '')}B`
    if (n >= 1e6) return `₦${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M`
    if (n >= 1e3) return `₦${(n / 1e3).toFixed(1).replace(/\.0$/, '')}K`
  }
  return `₦${n.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`
}

export const formatNumber = (n) => (Number(n) || 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })

export const STAT_CARD_CONFIG = {
  productsListed: {
    key: 'productsListed',
    icon: 'Package',
    label: 'Products Listed',
    iconColor: '#FF7101',
    lineColor: '#FF7101',
    lightColor: '#FFD3B0',
    progressBase: 0.5,
  },
  totalOrders: {
    key: 'totalOrders',
    icon: 'ShoppingBag',
    label: 'Total Orders',
    iconColor: '#7ED321',
    lineColor: '#7ED321',
    lightColor: '#D7F1BA',
    progressBase: 0.3,
  },
  totalCustomers: {
    key: 'totalCustomers',
    icon: 'Users',
    label: 'Total Customers',
    iconColor: '#007AFF',
    lineColor: '#007AFF',
    lightColor: '#B0D6FF',
    progressBase: 0.8,
  },
  totalRevenue: {
    key: 'totalRevenue',
    icon: 'DollarSign',
    label: 'Total Revenue',
    iconColor: '#FFCC00',
    lineColor: '#FFCC00',
    lightColor: '#FFEFB0',
    progressBase: 0.15,
    isMoney: true,
  },
}

export const ITEM_STATUS_LABELS = {
  pending: 'Pending',
  ready_for_pickup: 'Ready for Pickup',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  failed: 'Failed',
  returned: 'Returned',
}

export const ITEM_STATUS_COLORS = {
  pending: { bg: '#FFF8E1', fg: '#B45309' },
  ready_for_pickup: { bg: '#DBEAFE', fg: '#1D4ED8' },
  picked_up: { bg: '#EDE9FE', fg: '#6D28D9' },
  in_transit: { bg: '#E0E7FF', fg: '#4338CA' },
  out_for_delivery: { bg: '#CFFAFE', fg: '#0E7490' },
  delivered: { bg: '#DCFCE7', fg: '#15803D' },
  cancelled: { bg: '#FEE2E2', fg: '#B91C1C' },
  failed: { bg: '#FECACA', fg: '#991B1B' },
  returned: { bg: '#F3F4F6', fg: '#374151' },
}
