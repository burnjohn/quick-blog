import { sendError } from '../helpers/response.js'

export const POPULAR_LIMIT = { min: 1, max: 20, default: 8 }
export const POPULAR_DAYS = { min: 1, max: 365, default: 30 }

const INTEGER = /^\d+$/

/**
 * Parses an optional integer query param within bounds.
 * Returns { value } or { error } — rejects arrays/objects (NoSQL-injection safe).
 */
function parseBoundedInt(raw, name, { min, max, default: fallback }) {
  if (raw === undefined || raw === '') return { value: fallback }
  if (typeof raw !== 'string' || !INTEGER.test(raw)) {
    return { error: `${name} must be an integer between ${min} and ${max}` }
  }
  const value = Number(raw)
  if (value < min || value > max) {
    return { error: `${name} must be an integer between ${min} and ${max}` }
  }
  return { value }
}

/**
 * Validates GET /api/blog/popular query and attaches req.popularQuery = { limit, days }.
 */
export function validatePopularQuery(req, res, next) {
  const limit = parseBoundedInt(req.query?.limit, 'limit', POPULAR_LIMIT)
  const days = parseBoundedInt(req.query?.days, 'days', POPULAR_DAYS)
  const errors = [limit.error, days.error].filter(Boolean)

  if (errors.length > 0) {
    return sendError(res, errors.join('; '), 400)
  }

  req.popularQuery = { limit: limit.value, days: days.value }
  next()
}
