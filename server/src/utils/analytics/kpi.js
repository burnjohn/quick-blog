import { formatDay, listDays } from './dateRange.js'

export const KPI_KEYS = ['views', 'uniqueVisitors', 'avgReadTimeSec', 'avgScrollDepth', 'engagementRate', 'subscriptions']

const SUM_FIELDS = ['views', 'uniqueVisitors', 'readTimeSec', 'scrollDepthSum', 'engagedReads', 'likes', 'comments', 'shares', 'subscriptions']

export const round1 = (n) => Math.round(n * 10) / 10

export const emptyTotals = () => Object.fromEntries(SUM_FIELDS.map(field => [field, 0]))

export const addRow = (totals, row) => {
  for (const field of SUM_FIELDS) totals[field] += row[field] || 0
  return totals
}

export const sumRows = (rows) => rows.reduce(addRow, emptyTotals())

export const interactionsOf = (totals) => totals.likes + totals.comments + totals.shares

// Value of one KPI from totals; averages are 0 when there are no views
export const kpiValue = (key, totals) => {
  const { views } = totals
  switch (key) {
    case 'avgReadTimeSec': return views ? round1(totals.readTimeSec / views) : 0
    case 'avgScrollDepth': return views ? round1(totals.scrollDepthSum / views) : 0
    case 'engagementRate': return views ? round1((interactionsOf(totals) / views) * 100) : 0
    default: return totals[key]
  }
}

// previous 0 & current > 0 -> "new"; both 0 -> flat; otherwise signed percent (1 dp)
export const computeDelta = (current, previous) => {
  if (!previous) return current > 0 ? { direction: 'new', percent: null } : { direction: 'flat', percent: 0 }
  const percent = round1(((current - previous) / previous) * 100)
  if (Math.abs(percent) < 0.05) return { direction: 'flat', percent: 0 }
  return { direction: percent > 0 ? 'up' : 'down', percent }
}

export const dailyTotals = (rows) => {
  const byDay = new Map()
  for (const row of rows) {
    const day = formatDay(row.date)
    byDay.set(day, addRow(byDay.get(day) || emptyTotals(), row))
  }
  return byDay
}

export const buildKpis = (currentRows, previousRows, range) => {
  const current = sumRows(currentRows)
  const previous = sumRows(previousRows)
  const byDay = dailyTotals(currentRows)
  const days = listDays(range)
  return KPI_KEYS.map(key => {
    const value = kpiValue(key, current)
    const prev = kpiValue(key, previous)
    return {
      key,
      value,
      previous: prev,
      delta: computeDelta(value, prev),
      sparkline: days.map(date => ({ date, value: byDay.has(date) ? kpiValue(key, byDay.get(date)) : 0 }))
    }
  })
}
