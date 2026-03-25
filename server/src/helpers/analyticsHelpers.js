const DAY_MS = 24 * 60 * 60 * 1000

const PERIOD_DAYS = {
  '7d':   7,
  '30d':  30,
  '90d':  90,
  '365d': 365
}

/**
 * Returns { startDate, endDate } for a given period or custom date range.
 * Defaults to 30d if no period or custom range is provided.
 */
export const getDateRange = (period, from, to) => {
  if (from && to) {
    const startDate = new Date(from)
    const endDate = new Date(to)
    endDate.setHours(23, 59, 59, 999)
    return { startDate, endDate }
  }

  if (period === 'all') {
    return { startDate: new Date(0), endDate: new Date() }
  }

  const days = PERIOD_DAYS[period] ?? 30
  return {
    startDate: new Date(Date.now() - days * DAY_MS),
    endDate: new Date()
  }
}

/**
 * Returns the equal-duration window immediately before the current window,
 * used for trend arrow calculation (e.g. comparing this week vs last week).
 */
export const getPreviousPeriod = (startDate, endDate) => {
  const durationMs = endDate - startDate
  return {
    startDate: new Date(startDate - durationMs),
    endDate: new Date(+startDate)
  }
}

/**
 * Builds a Mongoose query filter for the Blog model.
 * Always includes isPublished: true.
 */
export const buildBlogFilter = (category, dateRange) => {
  const filter = { isPublished: true }

  if (category && category !== 'all') {
    filter.category = category
  }

  if (dateRange) {
    filter.createdAt = { $gte: dateRange.startDate, $lte: dateRange.endDate }
  }

  return filter
}

/**
 * Builds a Mongoose query filter for the BlogView model.
 * Always excludes admin views.
 *
 * Note: category filtering for views requires a $lookup in the controller —
 * this helper only handles non-join filters.
 */
export const buildViewFilter = (category, dateRange) => {
  const filter = { isAdminView: false }

  if (dateRange) {
    filter.viewedAt = { $gte: dateRange.startDate, $lte: dateRange.endDate }
  }

  return filter
}

/**
 * Returns the appropriate time bucket size for charting based on the
 * duration of the date range: 'day', 'week', or 'month'.
 */
export const getBucketSize = (startDate, endDate) => {
  const days = (endDate - startDate) / DAY_MS

  if (days <= 14) return 'day'
  if (days <= 90) return 'week'
  return 'month'
}
