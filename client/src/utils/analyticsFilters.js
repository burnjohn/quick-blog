import {
  PERIOD_PRESETS,
  PERIOD_CUSTOM,
  DEFAULT_PERIOD,
  SOURCES,
  SORT_COLUMNS,
  DEFAULT_SORT,
  DEFAULT_DIR,
  MAX_TAGS,
} from '../constants/analytics'

export const DEFAULT_FILTERS = {
  period: DEFAULT_PERIOD,
  from: null,
  to: null,
  compare: true,
  tags: [],
  authors: [],
  sources: [],
  sort: DEFAULT_SORT,
  dir: DEFAULT_DIR,
  post: null,
}

const DAY_MS = 24 * 60 * 60 * 1000
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const ID_RE = /^[a-f0-9]{24}$/i

export const isValidDate = (value) => {
  if (typeof value !== 'string' || !DATE_RE.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export const addDays = (iso, days) =>
  new Date(new Date(`${iso}T00:00:00Z`).getTime() + days * DAY_MS).toISOString().slice(0, 10)

const todayUtc = () => new Date().toISOString().slice(0, 10)

const splitList = (value) =>
  (value || '').split(',').map((item) => item.trim()).filter(Boolean)

const unique = (items) => [...new Set(items)]

export const parseFilters = (searchParams) => {
  const get = (key) => searchParams.get(key)
  const from = get('from')
  const to = get('to')
  const rangeValid = isValidDate(from) && isValidDate(to) && from <= to
  const periodParam = get('period')

  let period = DEFAULT_PERIOD
  if (periodParam === PERIOD_CUSTOM && rangeValid) period = PERIOD_CUSTOM
  else if (PERIOD_PRESETS.some((preset) => preset.key === periodParam)) period = periodParam

  const sort = SORT_COLUMNS.includes(get('sort')) ? get('sort') : DEFAULT_SORT
  const dir = ['asc', 'desc'].includes(get('dir')) ? get('dir') : DEFAULT_DIR
  const post = ID_RE.test(get('post') || '') ? get('post') : null

  return {
    period,
    from: period === PERIOD_CUSTOM ? from : null,
    to: period === PERIOD_CUSTOM ? to : null,
    compare: get('compare') !== '0',
    tags: unique(splitList(get('tags'))).slice(0, MAX_TAGS),
    authors: unique(splitList(get('authors')).filter((id) => ID_RE.test(id))),
    sources: unique(splitList(get('sources')).filter((src) => SOURCES.includes(src))),
    sort,
    dir,
    post,
  }
}

// Only non-default values are written to the URL
export const serializeFilters = (filters) => {
  const params = new URLSearchParams()
  const f = { ...DEFAULT_FILTERS, ...filters }

  if (f.period === PERIOD_CUSTOM && f.from && f.to) {
    params.set('period', PERIOD_CUSTOM)
    params.set('from', f.from)
    params.set('to', f.to)
  } else if (f.period !== DEFAULT_PERIOD) {
    params.set('period', f.period)
  }
  if (!f.compare) params.set('compare', '0')
  if (f.tags.length) params.set('tags', f.tags.join(','))
  if (f.authors.length) params.set('authors', f.authors.join(','))
  if (f.sources.length) params.set('sources', f.sources.join(','))
  if (f.sort !== DEFAULT_SORT) params.set('sort', f.sort)
  if (f.dir !== DEFAULT_DIR) params.set('dir', f.dir)
  if (f.post) params.set('post', f.post)
  return params
}

// Resolves the period to concrete from/to and returns API query params
export const toQueryParams = (filters, dateBounds) => {
  const max = dateBounds?.max || todayUtc()
  let from
  let to

  if (filters.period === PERIOD_CUSTOM && filters.from && filters.to) {
    ;({ from, to } = filters)
  } else if (filters.period === 'all') {
    if (dateBounds?.min && dateBounds?.max) {
      from = dateBounds.min
      to = dateBounds.max
    }
  } else {
    const preset = PERIOD_PRESETS.find((item) => item.key === filters.period)
    const days = preset?.days ?? 30
    to = max
    from = addDays(max, -(days - 1))
  }

  const params = {}
  if (from && to) {
    params.from = from
    params.to = to
  }
  if (filters.tags.length) params.tags = filters.tags.join(',')
  if (filters.authors.length) params.authors = filters.authors.join(',')
  if (filters.sources.length) params.sources = filters.sources.join(',')
  return params
}

// Request identity: sort, post and compare never refetch
export const toQueryKey = (params) =>
  [params.from, params.to, params.tags, params.authors, params.sources]
    .map((part) => part ?? '')
    .join('|')
