import { nairaToKobo } from '../config/constant'

export const MAX_PHOTOS = 6
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const validatePhoto = (file) => {
  if (!IMAGE_TYPES.includes(file.type)) return 'Choose a JPEG, PNG or WebP image.'
  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) return 'Each photo must be non-empty and 2 MB or smaller.'
  return ''
}

export const validateCsv = (file) => {
  if (!file || !/\.csv$/i.test(file.name) || (file.type && !['text/csv', 'application/csv', 'application/vnd.ms-excel', 'text/plain'].includes(file.type))) return 'Choose a CSV file.'
  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) return 'The CSV must be non-empty and 2 MB or smaller.'
  return ''
}

export const validateProduct = (values, photoCount) => {
  const errors = {}
  const length = (key, label, min, max) => {
    const size = String(values[key] ?? '').trim().length
    if (size < min || size > max) errors[key] = `${label} must contain ${min}–${max} characters.`
  }
  length('title', 'Title', 3, 255)
  length('description', 'Description', 10, 5000)
  length('partNumber', 'Part number', 2, 100)
  length('location', 'Location', 2, 120)
  if (!Number.isSafeInteger(Number(values.categoryId)) || Number(values.categoryId) <= 0) errors.categoryId = 'Choose a category.'
  // The backend also accepts uppercase OEM; preserve existing OEM listings on edit.
  if (!['new', 'used', 'OEM'].includes(values.condition)) errors.condition = 'Choose a supported condition.'
  try {
    if (nairaToKobo(values.price) < 0) errors.price = 'Price cannot be negative.'
  } catch (error) { errors.price = error.message }
  if (!/^\d+$/.test(String(values.stockQty)) || !Number.isSafeInteger(Number(values.stockQty))) errors.stockQty = 'Enter a whole number of units, zero or greater.'
  if (!values.compatibility.length) errors.compatibility = 'Add at least one compatible vehicle.'
  values.compatibility.forEach((row, index) => {
    for (const key of ['make', 'model']) {
      if (!row[key].trim() || row[key].trim().length > 80) errors[`compatibility.${index}.${key}`] = 'Enter 1–80 characters.'
    }
    for (const key of ['yearFrom', 'yearTo']) {
      const year = Number(row[key])
      if (!Number.isInteger(year) || year < 1900 || year > 2100) errors[`compatibility.${index}.${key}`] = 'Enter a year from 1900 to 2100.'
    }
    if (Number(row.yearFrom) > Number(row.yearTo)) errors[`compatibility.${index}.yearTo`] = 'End year must be on or after the start year.'
  })
  if (photoCount < 1 || photoCount > MAX_PHOTOS) errors.photos = 'Keep between one and six photos.'
  return errors
}
