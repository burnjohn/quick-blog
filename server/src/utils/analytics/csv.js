export const CSV_HEADER = [
  'Title', 'Category', 'Tags', 'Author', 'Published', 'Views', 'Unique visitors', 'Avg read time (s)',
  'Avg scroll depth (%)', 'Likes', 'Comments', 'Shares', 'Subscriptions', 'Engagement rate (%)'
]

const FORMULA_RE = /^[=+\-@\t\r]/

// Neutralizes spreadsheet formula injection for string fields only (numbers stay numeric)
const guardFormula = (value) => (typeof value === 'string' && FORMULA_RE.test(value) ? `'${value}` : value)

// RFC 4180: quote fields containing comma, quote, CR or LF; double inner quotes
export const escapeCsvField = (value) => {
  const guarded = guardFormula(value)
  const text = guarded === null || guarded === undefined ? '' : String(guarded)
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export const postToCsvRow = (post) => [
  post.title, post.category, post.tags.join('; '), post.author.name, post.publishedAt, post.views,
  post.uniqueVisitors, post.avgReadTimeSec, post.avgScrollDepth, post.likes, post.comments, post.shares,
  post.subscriptions, post.engagementRate
]

export const buildCsv = (posts) =>
  [CSV_HEADER, ...posts.map(postToCsvRow)].map(row => row.map(escapeCsvField).join(',')).join('\r\n')

export const exportFilename = (from, to) => `analytics-${from}-${to}.csv`
