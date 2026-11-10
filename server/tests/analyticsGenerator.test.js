import { describe, it, expect } from 'vitest'
import { generateAnalyticsRows, mulberry32 } from '../src/utils/analyticsGenerator.js'
import { SOURCES } from '../src/constants/analytics.js'
import { blogs } from '../fixtures/blogs.js'

const END = new Date('2026-11-10T12:00:00Z')
const DAY_MS = 86400000

const posts = blogs.map((blog, i) => ({
  id: `post-${i}`,
  publishedAt: new Date(END.getTime() - blog.publishedDaysAgo * DAY_MS),
  category: blog.category,
  tags: blog.tags
}))

const rows = generateAnalyticsRows({ posts, endDate: END, seed: 1 })
const sum = (list, key = 'views') => list.reduce((acc, row) => acc + row[key], 0)

const dailyViews = () => {
  const map = new Map()
  for (const row of rows) map.set(row.date.getTime(), (map.get(row.date.getTime()) || 0) + row.views)
  return [...map.entries()].sort((a, b) => a[0] - b[0])
}

describe('mulberry32', () => {
  it('is deterministic and in [0, 1)', () => {
    const a = mulberry32(5)
    const b = mulberry32(5)
    const seq = Array.from({ length: 5 }, () => a())
    expect(seq).toEqual(Array.from({ length: 5 }, () => b()))
    expect(seq.every(n => n >= 0 && n < 1)).toBe(true)
  })
})

describe('generateAnalyticsRows', () => {
  it('returns identical data for the same seed and end date', () => {
    expect(generateAnalyticsRows({ posts, endDate: END, seed: 1 })).toEqual(rows)
  })

  it('returns different data for a different seed', () => {
    const other = generateAnalyticsRows({ posts, endDate: END, seed: 2 })
    expect(sum(other)).not.toBe(sum(rows))
  })

  it('has more weekday than weekend views per day', () => {
    const daily = dailyViews()
    const isWeekend = ([t]) => [0, 6].includes(new Date(t).getUTCDay())
    const avg = (list) => list.reduce((a, [, v]) => a + v, 0) / list.length
    expect(avg(daily.filter(d => !isWeekend(d)))).toBeGreaterThan(avg(daily.filter(isWeekend)))
  })

  it('grows: last 30 days have more views than first 30 days', () => {
    const daily = dailyViews()
    const total = (list) => list.reduce((a, [, v]) => a + v, 0)
    expect(total(daily.slice(-30))).toBeGreaterThan(total(daily.slice(0, 30)))
  })

  it('keeps a long tail after publication', () => {
    const first = posts[0]
    const mine = rows.filter(r => r.blog === first.id)
    const spike = sum(mine.filter(r => r.date - first.publishedAt < 5 * DAY_MS))
    const lateDays = mine.filter(r => r.date - first.publishedAt > 200 * DAY_MS)
    expect(spike).toBeGreaterThan(0)
    expect(sum(lateDays)).toBeGreaterThan(0)
  })

  it('has no rows before a post is published', () => {
    for (const row of rows) {
      const post = posts.find(p => p.id === row.blog)
      expect(row.date.getTime()).toBeGreaterThanOrEqual(Date.UTC(
        post.publishedAt.getUTCFullYear(), post.publishedAt.getUTCMonth(), post.publishedAt.getUTCDate()))
    }
  })

  it('keeps the funnel monotone and counts integral', () => {
    for (const r of rows) {
      const interactions = r.likes + r.comments + r.shares
      expect(r.views).toBeGreaterThanOrEqual(r.engagedReads)
      expect(r.engagedReads).toBeGreaterThanOrEqual(interactions)
      expect(interactions).toBeGreaterThanOrEqual(r.subscriptions)
      expect(r.uniqueVisitors).toBeLessThanOrEqual(r.views)
      expect(Number.isInteger(r.views) && Number.isInteger(r.readTimeSec)).toBe(true)
    }
  })

  it('has valid sources, 24 hours and breakdowns that sum to views', () => {
    for (const r of rows) {
      expect(SOURCES).toContain(r.source)
      expect(r.hours).toHaveLength(24)
      expect(sum(r.hours.map(h => ({ h })), 'h')).toBe(r.views)
      expect(Object.values(r.countries).reduce((a, b) => a + b, 0)).toBe(r.views)
      expect(Object.values(r.devices).reduce((a, b) => a + b, 0)).toBe(r.views)
    }
  })

  it('has a daily hour cycle with an evening peak', () => {
    const hours = new Array(24).fill(0)
    rows.forEach(r => r.hours.forEach((v, h) => { hours[h] += v }))
    expect(hours[20]).toBeGreaterThan(hours[3] * 2)
  })
})
