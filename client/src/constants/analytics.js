export const PERIOD_PRESETS = [
  { key: '7d', label: '7D', days: 7 },
  { key: '30d', label: '30D', days: 30 },
  { key: '90d', label: '90D', days: 90 },
  { key: '1y', label: '1Y', days: 365 },
  { key: 'all', label: 'All', days: null },
]

export const PERIOD_CUSTOM = 'custom'
export const DEFAULT_PERIOD = '30d'

export const SOURCES = ['direct', 'search', 'social', 'referral', 'email']

export const SOURCE_LABELS = {
  direct: 'Direct',
  search: 'Search',
  social: 'Social',
  referral: 'Referral',
  email: 'Email',
}

export const DEVICE_LABELS = {
  desktop: 'Desktop',
  mobile: 'Mobile',
  tablet: 'Tablet',
}

// Order matches the API contract
export const KPI_META = [
  { key: 'views', label: 'Views', format: 'number' },
  { key: 'uniqueVisitors', label: 'Unique visitors', format: 'number' },
  { key: 'avgReadTimeSec', label: 'Avg. reading time', format: 'duration' },
  { key: 'avgScrollDepth', label: 'Avg. scroll depth', format: 'percent' },
  { key: 'engagementRate', label: 'Engagement rate', format: 'percent' },
  { key: 'subscriptions', label: 'Subscriptions', format: 'number' },
]

export const SORT_COLUMNS = [
  'title',
  'views',
  'uniqueVisitors',
  'avgReadTimeSec',
  'avgScrollDepth',
  'likes',
  'comments',
  'shares',
  'subscriptions',
  'engagementRate',
]

export const DEFAULT_SORT = 'views'
export const DEFAULT_DIR = 'desc'
export const MAX_TAGS = 20

// Series colors tuned for the dark analytics background
export const CHART_COLORS = [
  '#8b8cff',
  '#22d3ee',
  '#f472b6',
  '#fbbf24',
  '#34d399',
  '#fb923c',
  '#a78bfa',
  '#60a5fa',
]

export const SERIES_COLORS = {
  views: '#8b8cff',
  uniqueVisitors: '#22d3ee',
  previous: '#94a3b8',
}

export const DELTA_COLORS = {
  up: 'text-emerald-300',
  down: 'text-rose-300',
  flat: 'text-slate-300',
  new: 'text-cyan-300',
}
