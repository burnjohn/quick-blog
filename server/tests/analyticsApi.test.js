import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import app from '../src/app.js'
import AnalyticsDaily from '../src/models/AnalyticsDaily.js'
import { createTestUser, generateToken, createTestBlog, authHeader } from './fixtures.js'

const BASE = '/api/admin/analytics'
const day = (n) => new Date(Date.UTC(2026, 2, n)) // March n, 2026 (UTC)
const hours = (h, n) => Object.assign(new Array(24).fill(0), { [h]: n })

const makeRow = (blog, date, over = {}) => ({
  blog: blog._id, date, source: 'search', views: 100, uniqueVisitors: 80, readTimeSec: 10000, scrollDepthSum: 6000,
  engagedReads: 40, likes: 5, comments: 2, shares: 3, subscriptions: 1, countries: { US: 60, DE: 40 },
  devices: { desktop: 70, mobile: 30, tablet: 0 }, hours: hours(10, 100), ...over
})

describe('Analytics API', () => {
  let user, other, token, blogA, blogB

  beforeEach(async () => {
    user = await createTestUser()
    other = await createTestUser({ email: 'other@test.com', name: 'Other Author', role: 'author' })
    token = generateToken(user)
    blogA = await createTestBlog(user, { title: 'Post, "A"', tags: ['react', 'js'], createdAt: day(1) })
    blogB = await createTestBlog(other, { title: 'Post B', category: 'Startup', tags: ['js'], createdAt: day(1) })
    await AnalyticsDaily.insertMany([
      makeRow(blogA, day(10)),
      makeRow(blogA, day(11), { source: 'social', views: 50 }),
      makeRow(blogB, day(11), { views: 200 }),
      makeRow(blogA, day(8), { views: 40 }) // previous period for 10..11
    ])
  })

  describe('auth', () => {
    it.each(['/meta', '/overview', `/posts/${new mongoose.Types.ObjectId()}`, '/export'])('401 without token: %s', async (path) => {
      const res = await request(app).get(BASE + path)
      expect(res.status).toBe(401)
    })
  })

  describe('validation', () => {
    const bad = [
      ['from after to', '?from=2026-03-12&to=2026-03-10'],
      ['invalid date', '?from=2026-02-30&to=2026-03-10'],
      ['bad format', '?from=10-03-2026&to=2026-03-11'],
      ['range far beyond supported bounds', '?from=0001-01-01&to=9999-12-31'],
      ['range longer than 3660 days', '?from=2010-01-01&to=2020-02-01'],
      ['year before 1970', '?from=1969-12-31&to=1970-01-05'],
      ['year after 2100', '?from=2100-12-30&to=2101-01-02'],
      ['only from', '?from=2026-03-10'],
      ['unknown source', '?from=2026-03-10&to=2026-03-11&sources=twitter'],
      ['invalid author id', '?authors=123']
    ]
    it.each(bad)('400 for %s', async (_name, qs) => {
      for (const path of ['/overview', '/export']) {
        const res = await request(app).get(`${BASE}${path}${qs}`).set(authHeader(token))
        expect(res.status).toBe(400)
        expect(res.body).toMatchObject({ success: false, message: expect.any(String) })
      }
    })

    it('400 for a malformed post id and 404 for an unknown post', async () => {
      const malformed = await request(app).get(`${BASE}/posts/abc`).set(authHeader(token))
      expect(malformed.status).toBe(400)
      const unknown = await request(app).get(`${BASE}/posts/${new mongoose.Types.ObjectId()}`).set(authHeader(token))
      expect(unknown.status).toBe(404)
      expect(unknown.body.success).toBe(false)
    })
  })

  describe('GET /meta', () => {
    it('returns tags, categories, authors, sources and date bounds', async () => {
      const res = await request(app).get(`${BASE}/meta`).set(authHeader(token))
      expect(res.status).toBe(200)
      expect(res.body.meta).toMatchObject({
        tags: ['js', 'react'],
        categories: ['Startup', 'Technology'],
        sources: ['direct', 'search', 'social', 'referral', 'email'],
        dateBounds: { min: '2026-03-08', max: '2026-03-11' }
      })
      expect(res.body.meta.authors).toEqual(expect.arrayContaining([{ id: String(other._id), name: 'Other Author' }]))
    })

    it('returns null bounds without data', async () => {
      await AnalyticsDaily.deleteMany({})
      const res = await request(app).get(`${BASE}/meta`).set(authHeader(token))
      expect(res.body.meta.dateBounds).toEqual({ min: null, max: null })
    })
  })

  describe('GET /overview', () => {
    const get = (qs) => request(app).get(`${BASE}/overview${qs}`).set(authHeader(token))

    it('returns KPIs, series, breakdowns, heatmap, funnel and posts for the range', async () => {
      const res = await get('?from=2026-03-10&to=2026-03-11')
      expect(res.status).toBe(200)
      const o = res.body.overview
      expect(o.range).toEqual({ from: '2026-03-10', to: '2026-03-11', days: 2, bucket: 'day' })
      expect(o.previousRange).toEqual({ from: '2026-03-08', to: '2026-03-09' })
      const views = o.kpis.find(k => k.key === 'views')
      expect(views).toMatchObject({ value: 350, previous: 40, delta: { direction: 'up', percent: 775 } })
      expect(views.sparkline).toEqual([{ date: '2026-03-10', value: 100 }, { date: '2026-03-11', value: 250 }])
      expect(o.kpis.map(k => k.key)).toEqual(['views', 'uniqueVisitors', 'avgReadTimeSec', 'avgScrollDepth', 'engagementRate', 'subscriptions'])
      expect(o.series).toEqual([
        { date: '2026-03-10', views: 100, uniqueVisitors: 80, previousViews: 40, previousUniqueVisitors: 80 },
        { date: '2026-03-11', views: 250, uniqueVisitors: 160, previousViews: 0, previousUniqueVisitors: 0 }
      ])
      expect(o.sources.map(s => s.key)).toEqual(['search', 'social'])
      expect(o.devices[0].key).toBe('desktop')
      expect(o.countries[0]).toMatchObject({ code: 'US' })
      expect(o.tags[0]).toEqual({ key: 'js', views: 350, posts: 2 })
      expect(o.heatmap.cells).toHaveLength(7)
      expect(o.heatmap.cells[0]).toHaveLength(24)
      expect(o.funnel.map(f => f.value)).toEqual([350, 120, 30, 3])
      expect(o.posts.map(p => p.title)).toEqual(['Post B', 'Post, "A"'])
      expect(o.posts[0].author).toEqual({ id: String(other._id), name: 'Other Author' })
    })

    it('applies tag, author and source filters', async () => {
      const byTag = await get('?from=2026-03-10&to=2026-03-11&tags=react')
      expect(byTag.body.overview.posts.map(p => p.title)).toEqual(['Post, "A"'])
      expect(byTag.body.overview.kpis[0].value).toBe(150)

      const byAuthor = await get(`?from=2026-03-10&to=2026-03-11&authors=${other._id}`)
      expect(byAuthor.body.overview.kpis[0].value).toBe(200)

      const bySource = await get('?from=2026-03-10&to=2026-03-11&sources=social')
      expect(bySource.body.overview.kpis[0].value).toBe(50)
      expect(bySource.body.overview.sources).toHaveLength(1)
    })

    it('defaults to the last 30 days ending at the latest data day', async () => {
      const res = await get('')
      expect(res.body.overview.range).toMatchObject({ from: '2026-02-10', to: '2026-03-11', days: 30 })
    })

    it('returns empty series and zero KPIs for a range without data', async () => {
      const res = await get('?from=2025-01-01&to=2025-01-03')
      const o = res.body.overview
      expect(o.kpis.every(k => k.value === 0)).toBe(true)
      expect(o.sources).toEqual([])
      expect(o.countries).toEqual([])
      expect(o.tags).toEqual([])
      expect(o.series.every(s => s.views === 0)).toBe(true)
      expect(o.heatmap.max).toBe(0)
      expect(o.posts.every(p => p.views === 0)).toBe(true)
    })
  })

  describe('GET /posts/:id', () => {
    it('returns post details with KPIs, series, sources and devices', async () => {
      const res = await request(app).get(`${BASE}/posts/${blogA._id}?from=2026-03-10&to=2026-03-11`).set(authHeader(token))
      expect(res.status).toBe(200)
      const { post } = res.body
      expect(post).toMatchObject({ id: String(blogA._id), title: 'Post, "A"', url: `/blog/${blogA._id}`, tags: ['react', 'js'] })
      expect(post.kpis[0].value).toBe(150)
      expect(post.series).toHaveLength(2)
      expect(post.sources.map(s => s.key)).toEqual(['search', 'social'])
      expect(post.devices[0].key).toBe('desktop')
    })

    it('ignores tag filters but applies sources', async () => {
      const res = await request(app).get(`${BASE}/posts/${blogA._id}?from=2026-03-10&to=2026-03-11&tags=nothing&sources=social`).set(authHeader(token))
      expect(res.body.post.kpis[0].value).toBe(50)
    })
  })

  describe('GET /export', () => {
    it('returns CSV with headers, escaping and one row per post', async () => {
      const res = await request(app).get(`${BASE}/export?from=2026-03-10&to=2026-03-11`).set(authHeader(token))
      expect(res.status).toBe(200)
      expect(res.headers['content-type']).toContain('text/csv')
      expect(res.headers['content-disposition']).toBe('attachment; filename="analytics-2026-03-10-2026-03-11.csv"')
      const lines = res.text.split('\r\n')
      expect(lines[0].startsWith('Title,Category,Tags,Author,Published,Views')).toBe(true)
      expect(lines).toHaveLength(3)
      expect(lines[1].startsWith('Post B,Startup,js,Other Author,')).toBe(true)
      expect(lines[2].startsWith('"Post, ""A""",Technology,react; js,Test Admin,2026-03-01,150,')).toBe(true)
    })
  })
})
