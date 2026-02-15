import { BLOG_CATEGORIES, ERROR_MESSAGES, HTTP_STATUS } from '../constants/messages.js'
import { sendError } from './response.js'

/**
 * Build a MongoDB date-range filter from query params.
 * Returns an object like { createdAt: { $gte: ..., $lte: ... } } or {}.
 */
export const buildDateFilter = (startDate, endDate, field = 'createdAt') => {
  const filter = {}
  if (startDate) filter[field] = { ...filter[field], $gte: new Date(startDate) }
  if (endDate) {
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)
    filter[field] = { ...filter[field], $lte: end }
  }
  return filter
}

/**
 * Build a category equality filter.
 * Rejects non-string values (NoSQL injection prevention) and unknown categories.
 */
export const buildCategoryFilter = (category) => {
  if (typeof category !== 'string' || !category.trim() || category === 'All') return {}
  const trimmed = category.trim()
  if (!BLOG_CATEGORIES.includes(trimmed)) return {}
  return { category: trimmed }
}

/**
 * Determine grouping granularity based on date range span.
 */
export const getGranularity = (startDate, endDate) => {
  if (!startDate || !endDate) return 'month'
  const diffDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  if (diffDays <= 14) return 'day'
  if (diffDays <= 90) return 'week'
  return 'month'
}

/**
 * Get MongoDB $dateToString format for a given granularity.
 */
export const getDateFormat = (granularity) => {
  switch (granularity) {
    case 'day': return '%Y-%m-%d'
    case 'week': return '%Y-W%V'
    case 'month': return '%Y-%m'
    default: return '%Y-%m'
  }
}

/**
 * Compute percent change between current and previous period values.
 */
export const percentChange = (current, previous) => {
  if (previous === 0 && current > 0) return 100
  if (previous === 0 && current === 0) return 0
  return Math.round(((current - previous) / previous) * 1000) / 10
}

/**
 * Build a $match stage for blogDoc fields after a $lookup + $unwind.
 */
export const buildBlogDocMatch = (dateFilter, categoryFilter) => {
  const match = {}
  if (dateFilter.createdAt) match['blogDoc.createdAt'] = dateFilter.createdAt
  if (categoryFilter.category) match['blogDoc.category'] = categoryFilter.category
  return Object.keys(match).length ? match : {}
}

/**
 * Validate that a date string parses to a valid Date.
 */
export const isValidDate = (value) => !isNaN(new Date(value).getTime())

/**
 * Validate that startDate <= endDate when both are provided.
 * Partial ranges (either missing) are OK and return true.
 * @returns {boolean} true if valid or partial; false only when both present and startDate > endDate
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true
  return new Date(startDate) <= new Date(endDate)
}

/**
 * Validate date query params (startDate, endDate). Sends error response if invalid.
 * @returns {boolean} true when valid, false when invalid (error already sent)
 */
export const validateDateParams = (req, res) => {
  const { startDate, endDate } = req.query
  if (startDate && !isValidDate(startDate)) {
    sendError(res, ERROR_MESSAGES.INVALID_DATE_PARAM, HTTP_STATUS.BAD_REQUEST)
    return false
  }
  if (endDate && !isValidDate(endDate)) {
    sendError(res, ERROR_MESSAGES.INVALID_DATE_PARAM, HTTP_STATUS.BAD_REQUEST)
    return false
  }
  if (!isValidDateRange(startDate, endDate)) {
    sendError(res, ERROR_MESSAGES.INVALID_DATE_RANGE, HTTP_STATUS.BAD_REQUEST)
    return false
  }
  return true
}
