import { MAX_DAILY_RANGE_DAYS } from '../../constants/analytics.js'

const DAY_MS = 24 * 60 * 60 * 1000
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/

// Parses a strict YYYY-MM-DD string to a UTC midnight Date; returns null when invalid
export const parseDay = (value) => {
  if (typeof value !== 'string' || !DAY_RE.test(value)) return null
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) || formatDay(date) !== value ? null : date
}

export const formatDay = (date) => new Date(date).toISOString().slice(0, 10)

export const addDays = (day, n) => formatDay(new Date(parseDay(day).getTime() + n * DAY_MS))

export const diffDays = (from, to) => Math.round((parseDay(to) - parseDay(from)) / DAY_MS)

// Inclusive range descriptor; "from" and "to" are YYYY-MM-DD strings
export const buildRange = (from, to) => {
  const days = diffDays(from, to) + 1
  return { from, to, days, bucket: days <= MAX_DAILY_RANGE_DAYS ? 'day' : 'week' }
}

// Period of the same length immediately before "from"
export const previousRange = ({ from, days }) => buildRange(addDays(from, -days), addDays(from, -1))

export const defaultRange = (latestDay, days = 30) => buildRange(addDays(latestDay, -(days - 1)), latestDay)

export const listDays = ({ from, days }) => Array.from({ length: days }, (_, i) => addDays(from, i))

// Monday (UTC) of the week containing the day
export const weekStart = (day) => {
  const dow = (parseDay(day).getUTCDay() + 6) % 7 // Monday = 0
  return addDays(day, -dow)
}

export const bucketKey = (day, bucket) => (bucket === 'week' ? weekStart(day) : day)

// Ordered, unique bucket keys covering the range
export const listBuckets = (range) => [...new Set(listDays(range).map(day => bucketKey(day, range.bucket)))]

export const inRange = (day, { from, to }) => day >= from && day <= to

// Splits rows (with Date "date") into the current and previous periods
export const splitRows = (rows, range, previous) => {
  const current = []
  const prior = []
  for (const row of rows) {
    const day = formatDay(row.date)
    if (inRange(day, range)) current.push(row)
    else if (inRange(day, previous)) prior.push(row)
  }
  return { current, previous: prior }
}
