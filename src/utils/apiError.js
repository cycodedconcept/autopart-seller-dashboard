const textMessages = (value) => {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(textMessages).filter(Boolean).join(' ')
  if (value && typeof value.message === 'string') return value.message
  return ''
}

export const apiError = (body, status, fallback = 'Something went wrong.') => {
  const source = body?.error
  const fields = body?.errors || source?.errors || source?.details?.errors || {}
  const fieldErrors = Object.fromEntries(Object.entries(fields)
    .map(([field, value]) => [field, textMessages(value)]).filter(([, message]) => message))
  const message = textMessages(source) || textMessages(body?.message)
    || Object.values(fieldErrors).join(' ') || fallback
  // The current Joi middleware sends quoted field paths in a single message.
  // Preserve structured errors when present, and recover those named paths otherwise.
  if (!Object.keys(fieldErrors).length && source?.code === 'VALIDATION_ERROR') {
    for (const part of message.split(/,\s*(?="[\w.[\]]+")/)) {
      const match = part.match(/^"([\w.[\]]+)"\s+(.+)$/)
      if (match) {
        const field = match[1].replace(/^body\./, '').replace(/\[(\d+)\]/g, '.$1')
        fieldErrors[field] = part.replace(/^"body\./, '"')
      }
    }
  }
  return Object.assign(new Error(message), {
    status, code: source?.code, fieldErrors, details: source?.details,
  })
}

export const serializeApiError = (error) => ({
  message: error?.message || 'Something went wrong.',
  code: error?.code,
  status: error?.status,
  fieldErrors: error?.fieldErrors || {},
  details: error?.details,
})
