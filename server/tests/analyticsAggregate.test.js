import { describe, it, expect } from 'vitest'
import { buildRange, previousRange } from '../src/utils/analytics/dateRange.js'
import { sumRows, computeDelta, kpiValue, buildKpis, KPI_KEYS } from '../src/utils/analytics/kpi.js'
import { buildSeries } from '../src/utils/analytics/series.js'
import {
  sourceBreakdown, deviceBreakdown, countryBreakdown, tagBreakdown, categoryBreakdown
} from '../src/utils/analytics/breakdowns.js'
import { filterBlogs, filterRows, buildPosts } from '../src/utils/analytics/posts.js'
import { buildHeatmap } from '../src/utils/analytics/heatmap.js'
import { buildFunnel } from '../src/utils/analytics/funnel.js'

const hours = (h, n) => Object.assign(new Array(24).fill(0), { [h]: n })
const row = (day, over = {}) => ({
  blog: 'b1', date: new Date(`${day}T00:00:00Z`), source: 'search', views: 100, uniqueVisitors: 80, readTimeSec: 10000,
  scrollDepthSum: 6000, engagedReads: 40, likes: 5, comments: 2, shares: 3, subscriptions: 1,
  countries: { US: 60, DE: 40 }, devices: { desktop: 70, mobile: 30, tablet: 0 }, hours: hours(10, 100), ...over
})
const blogs = [
  { _id: 'b1', title: 'One', category: 'Technology', tags: ['react', 'js'], author: 'u1', authorName: 'Ann', createdAt: new Date('2026-01-01') },
  { _id: 'b2', title: 'Two', category: 'Startup', tags: ['js'], author: 'u2', authorName: 'Bob', createdAt: new Date('2026-01-05') }
]
const blogsById = new Map(blogs.map(b => [b._id, b]))

describe('kpi', () => {
  it('sums totals and computes averages, interactions and engagement rate', () => {
    const totals = sumRows([row('2026-03-01'), row('2026-03-02', { views: 300, readTimeSec: 30000, scrollDepthSum: 18000 })])
    expect(totals.views).toBe(400)
    expect(kpiValue('avgReadTimeSec', totals)).toBe(100)
    expect(kpiValue('avgScrollDepth', totals)).toBe(60)
    expect(kpiValue('engagementRate', totals)).toBe(5) // (20 / 400) * 100
    expect(kpiValue('views', sumRows([]))).toBe(0)
    expect(kpiValue('avgScrollDepth', sumRows([]))).toBe(0)
  })

  it('computes deltas including previous 0', () => {
    expect(computeDelta(120, 100)).toEqual({ direction: 'up', percent: 20 })
    expect(computeDelta(80, 100)).toEqual({ direction: 'down', percent: -20 })
    expect(computeDelta(5, 0)).toEqual({ direction: 'new', percent: null })
    expect(computeDelta(0, 0)).toEqual({ direction: 'flat', percent: 0 })
    expect(computeDelta(100.01, 100)).toEqual({ direction: 'flat', percent: 0 })
    expect(computeDelta(112.24, 100).percent).toBe(12.2)
  })

  it('builds ordered KPIs with daily sparklines filling empty days', () => {
    const range = buildRange('2026-03-02', '2026-03-04')
    const kpis = buildKpis([row('2026-03-02'), row('2026-03-04', { views: 50 })], [row('2026-02-27')], range)
    expect(kpis.map(k => k.key)).toEqual(KPI_KEYS)
    const views = kpis[0]
    expect(views.value).toBe(150)
    expect(views.previous).toBe(100)
    expect(views.delta).toEqual({ direction: 'up', percent: 50 })
    expect(views.sparkline).toEqual([
      { date: '2026-03-02', value: 100 }, { date: '2026-03-03', value: 0 }, { date: '2026-03-04', value: 50 }
    ])
  })
})

describe('series', () => {
  it('buckets by day and aligns the previous period by index', () => {
    const range = buildRange('2026-03-02', '2026-03-03')
    const series = buildSeries([row('2026-03-02'), row('2026-03-02', { source: 'direct', views: 20 })], [row('2026-03-01', { views: 7 })], range, previousRange(range))
    expect(series).toEqual([
      { date: '2026-03-02', views: 120, uniqueVisitors: 160, previousViews: 0, previousUniqueVisitors: 0 },
      { date: '2026-03-03', views: 0, uniqueVisitors: 0, previousViews: 7, previousUniqueVisitors: 80 }
    ])
  })

  it('buckets by Monday-start week for long ranges', () => {
    const range = buildRange('2026-01-05', '2026-06-07') // > 92 days
    expect(range.bucket).toBe('week')
    const series = buildSeries([row('2026-01-05'), row('2026-01-11'), row('2026-01-12')], [], range, previousRange(range))
    expect(series[0]).toMatchObject({ date: '2026-01-05', views: 200 })
    expect(series[1]).toMatchObject({ date: '2026-01-12', views: 100 })
  })
})

describe('breakdowns', () => {
  const rows = [row('2026-03-01'), row('2026-03-01', { blog: 'b2', source: 'social', views: 100, countries: { US: 100 }, devices: { desktop: 0, mobile: 100, tablet: 0 } })]
  it('groups by source, device and country sorted by views with shares', () => {
    expect(sourceBreakdown(rows)).toEqual([{ key: 'search', views: 100, share: 0.5 }, { key: 'social', views: 100, share: 0.5 }])
    expect(deviceBreakdown(rows)[0]).toEqual({ key: 'mobile', views: 130, share: 0.65 })
    expect(countryBreakdown(rows)[0]).toEqual({ code: 'US', views: 160, share: 0.8 })
    expect(countryBreakdown([{ countries: new Map([['FR', 5]]) }])).toEqual([{ code: 'FR', views: 5, share: 1 }])
  })
  it('groups by tag and category with distinct post counts', () => {
    expect(tagBreakdown(rows, blogsById)).toEqual([
      { key: 'js', views: 200, posts: 2 }, { key: 'react', views: 100, posts: 1 }
    ])
    expect(categoryBreakdown(rows, blogsById).map(c => c.key).sort()).toEqual(['Startup', 'Technology'])
  })
  it('returns empty lists for no rows', () => {
    expect(sourceBreakdown([])).toEqual([])
    expect(countryBreakdown([])).toEqual([])
  })
})

describe('filters and posts', () => {
  it('filters blogs by tags and authors', () => {
    expect(filterBlogs(blogs, { tags: ['react'] }).map(b => b._id)).toEqual(['b1'])
    expect(filterBlogs(blogs, { tags: ['js'], authors: ['u2'] }).map(b => b._id)).toEqual(['b2'])
    expect(filterBlogs(blogs, {})).toHaveLength(2)
  })
  it('filters rows by blog ids and sources', () => {
    const rows = [row('2026-03-01'), row('2026-03-01', { blog: 'b2', source: 'email' })]
    expect(filterRows(rows, { blogIds: new Set(['b2']) })).toHaveLength(1)
    expect(filterRows(rows, { sources: ['search'] })).toHaveLength(1)
    expect(filterRows(rows, { blogIds: new Set(['b1']), sources: ['email'] })).toHaveLength(0)
  })
  it('builds posts with metrics, including posts without views', () => {
    const posts = buildPosts([row('2026-03-01')], blogs)
    expect(posts[0]).toMatchObject({
      id: 'b1', views: 100, avgReadTimeSec: 100, avgScrollDepth: 60, engagementRate: 10, publishedAt: '2026-01-01', author: { id: 'u1', name: 'Ann' }
    })
    expect(posts[1]).toMatchObject({ id: 'b2', views: 0, avgReadTimeSec: 0, engagementRate: 0 })
  })
})

describe('heatmap and funnel', () => {
  it('indexes rows as Monday = 0 .. Sunday = 6 by hour', () => {
    // 2026-03-02 is a Monday, 2026-03-08 is a Sunday
    const { cells, max } = buildHeatmap([row('2026-03-02', { hours: hours(9, 10) }), row('2026-03-08', { hours: hours(23, 4) }), row('2026-03-09', { hours: hours(9, 5) })])
    expect(cells).toHaveLength(7)
    expect(cells.every(r => r.length === 24)).toBe(true)
    expect(cells[0][9]).toBe(15)
    expect(cells[6][23]).toBe(4)
    expect(max).toBe(15)
    expect(buildHeatmap([]).max).toBe(0)
  })
  it('orders the funnel Views > Engaged reads > Interactions > Subscriptions', () => {
    const funnel = buildFunnel(sumRows([row('2026-03-01')]))
    expect(funnel.map(f => f.key)).toEqual(['views', 'engagedReads', 'interactions', 'subscriptions'])
    expect(funnel.map(f => f.value)).toEqual([100, 40, 10, 1])
    expect(funnel.map(f => f.label)).toEqual(['Views', 'Engaged reads', 'Interactions', 'Subscriptions'])
  })
})
