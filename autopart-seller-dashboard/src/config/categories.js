export const CATEGORIES = [
  { id: 1001, name: 'Engine Components' },
  { id: 1002, name: 'Brake System' },
  { id: 1003, name: 'Suspension & Steering' },
  { id: 1004, name: 'Electrical & Lighting' },
  { id: 1005, name: 'Filters' },
]

export const CATEGORY_NAMES = CATEGORIES.map(c => c.name)

export const CATEGORY_IDS = Object.fromEntries(CATEGORIES.map(c => [c.name, c.id]))