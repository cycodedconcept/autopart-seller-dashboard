export const CATEGORIES = [
  { id: 1001, name: 'Engine Components', slug: 'engine-components' },
  { id: 1002, name: 'Brake System', slug: 'brake-system' },
  { id: 1003, name: 'Suspension & Steering', slug: 'suspension-steering' },
  { id: 1004, name: 'Electrical & Lighting', slug: 'electrical-lighting' },
  { id: 1005, name: 'Filters', slug: 'filters' },
  { id: 1006, name: 'Radiators', slug: 'radiators' },
]

export const CATEGORY_NAMES = CATEGORIES.map(c => c.name)

export const CATEGORY_IDS = Object.fromEntries(CATEGORIES.map(c => [c.name, c.id]))

export const CATEGORY_PREFIXES = {
  radiators: 'RAD',
  'brake-system': 'BRAKE',
  filters: 'FILTER',
  'suspension-steering': 'SUSP',
}

export const categoryPrefix = (slug) => CATEGORY_PREFIXES[slug]
  || String(slug || '').replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 4)

export const generatePartNumber = (slug, now = Date.now()) =>
  `${categoryPrefix(slug)}-${Math.floor(now / 1000)}`
