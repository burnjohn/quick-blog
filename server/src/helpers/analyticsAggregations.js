// Pure utilities for analytics endpoints — no DB access here.

export const BLOG_CATEGORIES = ['All', 'Technology', 'Startup', 'Lifestyle', 'Finance']
export const VALID_CATEGORIES = ['Technology', 'Startup', 'Lifestyle', 'Finance']

const DAY_MS = 24 * 60 * 60 * 1000
const TWO_YEARS_MS = 2 * 365 * DAY_MS

const PERIOD_TO_DAYS = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '1y': 365
}

const parseDate = (value) => {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

// Resolve a {from, to} range from period preset or explicit from/to.
// Returns { from, to } or { error } for 400s.
export const getDateRange = (period, from, to) => {
  const hasExplicit = Boolean(from) || Boolean(to)

  if (hasExplicit) {
    const start = from ? parseDate(from) : null
    if (from && !start) return { error: 'Invalid from date' }

    const end = to ? parseDate(to) : new Date()
    if (to && !end) return { error: 'Invalid to date' }

    if (start && end && start > end) {
      return { error: 'from must be less than or equal to to' }
    }
    if (start && end && end.getTime() - start.getTime() > TWO_YEARS_MS) {
      start.setTime(end.getTime() - TWO_YEARS_MS)
    }
    return { from: start, to: end }
  }

  const now = new Date()
  if (!period || period === 'all') {
    return { from: null, to: now }
  }
  const days = PERIOD_TO_DAYS[period]
  if (!days) return { error: 'Invalid period' }
  return { from: new Date(now.getTime() - days * DAY_MS), to: now }
}

// Previous period of the same duration, ending immediately before `from`.
export const getPreviousPeriod = (from, to) => {
  if (!from || !to) return { from: null, to: null }
  const duration = to.getTime() - from.getTime()
  const prevTo = new Date(from.getTime() - 1)
  const prevFrom = new Date(from.getTime() - duration)
  return { from: prevFrom, to: prevTo }
}

// Mongo filter for Blog docs (by createdAt window and optional category).
export const buildBlogFilter = ({ from, to, category } = {}) => {
  const filter = {}
  if (from || to) {
    filter.createdAt = {}
    if (from) filter.createdAt.$gte = from
    if (to) filter.createdAt.$lte = to
  }
  if (category && category !== 'All' && VALID_CATEGORIES.includes(category)) {
    filter.category = category
  }
  return filter
}

// Mongo filter for BlogView docs. Always excludes admin-flagged views.
export const buildViewFilter = ({ from, to } = {}, blogIds = null) => {
  const filter = { isAdminView: { $ne: true } }
  if (from || to) {
    filter.viewedAt = {}
    if (from) filter.viewedAt.$gte = from
    if (to) filter.viewedAt.$lte = to
  }
  if (Array.isArray(blogIds)) {
    filter.blog = { $in: blogIds }
  }
  return filter
}

// Adaptive bucket size for time-series charts.
export const getBucketSize = (from, to) => {
  if (!from || !to) return 'month'
  const days = (to.getTime() - from.getTime()) / DAY_MS
  if (days <= 30) return 'day'
  if (days <= 180) return 'week'
  return 'month'
}

// Trend against prior period. Rounds percentChange to 1 decimal, returns absolute value.
export const calculateTrend = (current, previous) => {
  const curr = Number(current) || 0
  const prev = Number(previous) || 0

  if (prev === 0) {
    if (curr === 0) return { direction: 'neutral', percentChange: 0 }
    return { direction: 'up', percentChange: 100 }
  }

  const change = ((curr - prev) / prev) * 100
  const rounded = Math.round(change * 10) / 10
  const direction = rounded > 0 ? 'up' : rounded < 0 ? 'down' : 'neutral'
  return { direction, percentChange: Math.abs(rounded) }
}

export const isValidCategory = (category) =>
  !category || category === 'All' || VALID_CATEGORIES.includes(category)
