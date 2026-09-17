import { it, expect } from 'vitest'
import { apiError } from '../../src/utils/apiError'
it('preserves the API message, code, HTTP status and structured fields', () => {
  const error = apiError({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid fields.', errors: { title: ['Too short.'] } } }, 422)
  expect(error).toMatchObject({ message: 'Invalid fields.', code: 'VALIDATION_ERROR', status: 422, fieldErrors: { title: 'Too short.' } })
})
it('never turns a raw error object into display text', () => {
  expect(apiError({ error: { details: { secret: 'not a message' } } }, 500).message).toBe('Something went wrong.')
})
it('maps the backend Joi field paths without inventing field names', () => {
  const error = apiError({ error: { code: 'VALIDATION_ERROR', message: '"body.title" is required, "body.compatibility[0].yearTo" must be greater than or equal to yearFrom' } }, 422)
  expect(error.fieldErrors).toEqual({ title: '"title" is required', 'compatibility.0.yearTo': '"compatibility[0].yearTo" must be greater than or equal to yearFrom' })
})
