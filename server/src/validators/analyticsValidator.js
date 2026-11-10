import { sendError } from '../helpers/response.js'
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/messages.js'
import { SOURCES, MAX_TAG_FILTERS, MAX_RANGE_DAYS, MIN_YEAR, MAX_YEAR } from '../constants/analytics.js'
import { parseDay, buildRange, diffDays } from '../utils/analytics/dateRange.js'

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/

const toList = (value) => {
  if (value === undefined || value === null) return []
  const raw = Array.isArray(value) ? value.join(',') : String(value)
  return [...new Set(raw.split(',').map(item => item.trim()).filter(Boolean))]
}

const yearOutOfBounds = (day) => {
  const year = Number(day.slice(0, 4))
  return year < MIN_YEAR || year > MAX_YEAR
}

const fail = (res, message) => sendError(res, message, HTTP_STATUS.BAD_REQUEST)

// Normalizes and validates analytics query params into req.analyticsQuery
export const validateAnalyticsQuery = (req, res, next) => {
  const { from, to } = req.query
  const hasFrom = from !== undefined && from !== ''
  const hasTo = to !== undefined && to !== ''
  let range = null

  if (hasFrom !== hasTo) return fail(res, ERROR_MESSAGES.ANALYTICS_RANGE_INCOMPLETE)
  if (hasFrom) {
    if (!parseDay(from) || !parseDay(to)) return fail(res, ERROR_MESSAGES.ANALYTICS_INVALID_DATE)
    if (from > to) return fail(res, ERROR_MESSAGES.ANALYTICS_INVALID_RANGE)
    if (yearOutOfBounds(from) || yearOutOfBounds(to) || diffDays(from, to) + 1 > MAX_RANGE_DAYS) {
      return fail(res, ERROR_MESSAGES.ANALYTICS_RANGE_OUT_OF_BOUNDS)
    }
    range = buildRange(from, to)
  }

  const tags = toList(req.query.tags)
  const authors = toList(req.query.authors)
  const sources = toList(req.query.sources)

  if (tags.length > MAX_TAG_FILTERS) return fail(res, ERROR_MESSAGES.ANALYTICS_TOO_MANY_TAGS)
  if (authors.some(id => !OBJECT_ID_RE.test(id))) return fail(res, ERROR_MESSAGES.ANALYTICS_INVALID_AUTHOR)
  if (sources.some(source => !SOURCES.includes(source))) return fail(res, ERROR_MESSAGES.ANALYTICS_INVALID_SOURCE)

  req.analyticsQuery = { range, tags, authors, sources }
  next()
}

export const validatePostId = (req, res, next) => {
  if (!OBJECT_ID_RE.test(req.params.id)) return fail(res, ERROR_MESSAGES.ANALYTICS_INVALID_POST_ID)
  next()
}
