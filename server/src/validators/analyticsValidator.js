import { sendError } from '../helpers/response.js'
import { ERROR_MESSAGES } from '../constants/messages.js'
import { parseChartDateToRange } from '../helpers/analyticsAggregations.js'

const PERIODS = ['7', '30', '90', '365', 'all']
const CATEGORIES = ['All', 'Technology', 'Startup', 'Lifestyle', 'Finance']

const YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/

function parseDate(str) {
  const match = str?.match?.(YYYY_MM_DD)
  if (!match) return null
  const d = new Date(str + 'T00:00:00.000Z')
  return isNaN(d.getTime()) ? null : d
}

/**
 * Middleware to validate analytics query params and attach req.analyticsFilter.
 * Query: period | (from, to), category
 */
export function validateAnalyticsQuery(req, res, next) {
  const period = req.query?.period ?? '30'
  const fromStr = req.query?.from
  const toStr = req.query?.to
  const category = (req.query?.category ?? 'All').trim()

  const errors = []

  if (!PERIODS.includes(period)) {
    errors.push(`period must be one of: ${PERIODS.join(', ')}`)
  }

  if (!CATEGORIES.includes(category)) {
    errors.push(`category must be one of: ${CATEGORIES.join(', ')}`)
  }

  let from
  let to

  if (period === 'all') {
    from = new Date(0)
    to = new Date()
  } else if (fromStr || toStr) {
    from = parseDate(fromStr)
    to = parseDate(toStr)
    if (fromStr && !from) errors.push('from must be a valid YYYY-MM-DD date')
    if (toStr && !to) errors.push('to must be a valid YYYY-MM-DD date')
    if (from && to && from > to) {
      errors.push('from must be less than or equal to to')
    }
    if (!fromStr && toStr) errors.push('from is required when to is provided')
    if (fromStr && !toStr) to = new Date()
    if (!fromStr && !toStr) {
      const days = parseInt(period, 10)
      to = new Date()
      from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000)
    }
  } else {
    const days = parseInt(period, 10)
    to = new Date()
    from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000)
  }

  if (errors.length > 0) {
    return sendError(res, errors.join('; '), 400)
  }

  req.analyticsFilter = {
    from,
    to,
    category: category === 'All' ? 'All' : category
  }
  next()
}

/**
 * Middleware to validate drill-down date query param (YYYY-MM-DD, YYYY-Wnn, or YYYY-MM).
 */
export function validateDrillDownQuery(req, res, next) {
  const dateStr = req.query?.date
  const range = parseChartDateToRange(dateStr)
  if (!range) {
    return sendError(res, ERROR_MESSAGES.INVALID_DRILL_DOWN_DATE, 400)
  }
  next()
}
