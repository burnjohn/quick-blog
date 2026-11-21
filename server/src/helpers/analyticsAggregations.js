const CATEGORIES = ['All', 'Technology', 'Startup', 'Lifestyle', 'Finance']

/**
 * Returns { from, to } Date range from period or explicit from/to.
 * @param {string} period - '7'|'30'|'90'|'365'|'all'
 * @param {Date|null} from
 * @param {Date|null} to
 */
export function getDateRange(period, from, to) {
  if (period === 'all') {
    return {
      from: new Date(0),
      to: new Date()
    }
  }
  if (from && to) {
    return { from, to }
  }
  const days = parseInt(period, 10) || 30
  const toDate = to || new Date()
  const fromDate = from || new Date(toDate.getTime() - days * 24 * 60 * 60 * 1000)
  return { from: fromDate, to: toDate }
}

/**
 * Returns the previous period (same length) for trend comparison.
 */
export function getPreviousPeriod(from, to) {
  const ms = to.getTime() - from.getTime()
  return {
    from: new Date(from.getTime() - ms),
    to: new Date(from.getTime())
  }
}

/**
 * Calculates trend between current and previous values.
 */
export function calculateTrend(current, previous) {
  if (previous === 0) {
    return { direction: current > 0 ? 'up' : 'unchanged', percentChange: current > 0 ? 100 : 0 }
  }
  const percentChange = ((current - previous) / previous) * 100
  let direction = 'unchanged'
  if (percentChange > 0) direction = 'up'
  else if (percentChange < 0) direction = 'down'
  return { direction, percentChange: Math.round(percentChange * 100) / 100 }
}

/**
 * Returns bucket size for time-series based on range length.
 */
export function getBucketSize(from, to) {
  const days = (to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000)
  if (days <= 31) return 'day'
  if (days <= 90) return 'week'
  return 'month'
}

/**
 * Builds Mongoose query filter for blog scope (createdAt within range, optional category).
 */
export function buildBlogFilter(filter) {
  const { from, to, category } = filter
  const q = {
    createdAt: { $gte: from, $lte: to }
  }
  if (category && category !== 'All') {
    q.category = category
  }
  return q
}

/**
 * Builds Mongoose query filter for BlogView (isAdminView: false, blog in blogIds, viewedAt in range).
 */
export function buildViewFilter(filter, blogIds) {
  const { from, to } = filter
  return {
    isAdminView: false,
    blog: { $in: blogIds },
    viewedAt: { $gte: from, $lte: to }
  }
}

/**
 * Parses a chart date string (YYYY-MM-DD | YYYY-Wnn | YYYY-MM) into { from, to }.
 */
export function parseChartDateToRange(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null
  const trimmed = dateStr.trim()

  // Day: 2025-01-15
  const dayMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (dayMatch) {
    const from = new Date(trimmed + 'T00:00:00.000Z')
    const to = new Date(from.getTime() + 24 * 60 * 60 * 1000 - 1)
    return { from, to }
  }

  // Week: 2025-W03 (ISO week)
  const weekMatch = trimmed.match(/^(\d{4})-W(\d{1,2})$/)
  if (weekMatch) {
    const year = parseInt(weekMatch[1], 10)
    const week = parseInt(weekMatch[2], 10)
    const jan4 = new Date(Date.UTC(year, 0, 4))
    const dayOfJan4 = jan4.getUTCDay() || 7
    const mondayOfWeek1 = new Date(jan4)
    mondayOfWeek1.setUTCDate(jan4.getUTCDate() - dayOfJan4 + 1)
    const from = new Date(mondayOfWeek1)
    from.setUTCDate(from.getUTCDate() + (week - 1) * 7)
    const to = new Date(from)
    to.setUTCDate(to.getUTCDate() + 6)
    to.setUTCHours(23, 59, 59, 999)
    return { from, to }
  }

  // Month: 2025-01
  const monthMatch = trimmed.match(/^(\d{4})-(\d{2})$/)
  if (monthMatch) {
    const [, year, month] = monthMatch
    const from = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, 1))
    const to = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10), 0, 23, 59, 59, 999))
    return { from, to }
  }

  return null
}

export { CATEGORIES }
