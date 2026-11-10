const LOCALE = 'en-US'

const numberFmt = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 })
const compactFmt = new Intl.NumberFormat(LOCALE, {
  notation: 'compact',
  maximumFractionDigits: 1
})

const isNum = (value) => typeof value === 'number' && Number.isFinite(value)

export const formatNumber = (value) => (isNum(value) ? numberFmt.format(value) : '—')

export const formatCompact = (value) => (isNum(value) ? compactFmt.format(value) : '—')

// `value` is already a percentage (12.2 -> "12.2%")
export const formatPercent = (value, digits = 1) => {
  if (!isNum(value)) return '—'
  return `${new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits
  }).format(value)}%`
}

// Seconds -> "3m 30s" / "45s" / "1h 5m"
export const formatDuration = (seconds) => {
  if (!isNum(seconds)) return '—'
  const total = Math.round(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

// 'YYYY-MM-DD' -> "Oct 12, 2026" (UTC days)
export const formatDate = (iso, options = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!iso) return '—'
  const date = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(LOCALE, { ...options, timeZone: 'UTC' }).format(date)
}

export const formatDateRange = (from, to) => `${formatDate(from)} – ${formatDate(to)}`

// Formats a KPI value according to its meta format
export const formatByType = (value, type) => {
  switch (type) {
    case 'duration': return formatDuration(value)
    case 'percent': return formatPercent(value)
    default: return formatNumber(value)
  }
}
