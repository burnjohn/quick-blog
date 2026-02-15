import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../app.js'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import View from '../models/View.js'
import { generateToken, createTestBlog } from '../../test/setup.js'

const token = generateToken()
const authHeader = { Authorization: `Bearer ${token}` }

// Helper: create seeded analytics data for chart tests
const seedAnalyticsData = async () => {
  const blog = await createTestBlog({ category: 'Technology' })
  await View.create([
    { blog: blog._id, sessionId: 's1', referrer: 'direct', isAdmin: false },
    { blog: blog._id, sessionId: 's2', referrer: 'search', isAdmin: false },
    { blog: blog._id, sessionId: 's3', referrer: 'social', isAdmin: true } // admin view, should be excluded
  ])
  await Comment.create([
    { blog: blog._id, name: 'Alice', content: 'Great post!', isApproved: true },
    { blog: blog._id, name: 'Bob', content: 'Needs work...', isApproved: false }
  ])
  return blog
}

describe('Analytics endpoints — auth guard', () => {
  it('rejects all analytics routes without token', async () => {
    const routes = [
      '/api/analytics/summary',
      '/api/analytics/views-over-time',
      '/api/analytics/publications-over-time',
      '/api/analytics/category-distribution',
      '/api/analytics/comment-activity',
      '/api/analytics/views-by-category',
      '/api/analytics/top-posts',
      '/api/analytics/recent-comments',
      '/api/analytics/export'
    ]

    for (const route of routes) {
      const res = await request(app).get(route)
      expect(res.status).toBe(401)
    }
  })
})

describe('GET /api/analytics/category-distribution', () => {
  it('returns category counts', async () => {
    await createTestBlog({ category: 'Technology' })
    await createTestBlog({ category: 'Technology' })
    await createTestBlog({ category: 'Startup' })

    const res = await request(app)
      .get('/api/analytics/category-distribution')
      .set(authHeader)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ category: 'Technology', count: 2 }),
        expect.objectContaining({ category: 'Startup', count: 1 })
      ])
    )
  })

  it('returns empty array when no blogs exist', async () => {
    const res = await request(app)
      .get('/api/analytics/category-distribution')
      .set(authHeader)

    expect(res.status).toBe(200)
    expect(res.body.data).toEqual([])
  })
})

describe('GET /api/analytics/views-by-category', () => {
  it('groups non-admin views by blog category', async () => {
    await seedAnalyticsData()

    const res = await request(app)
      .get('/api/analytics/views-by-category')
      .set(authHeader)

    expect(res.status).toBe(200)
    // Only 2 non-admin views (s1, s2); admin view excluded
    const tech = res.body.data.find(d => d.category === 'Technology')
    expect(tech.views).toBe(2)
  })
})

describe('GET /api/analytics/recent-comments', () => {
  it('returns the most recent comments with blog info', async () => {
    await seedAnalyticsData()

    const res = await request(app)
      .get('/api/analytics/recent-comments')
      .set(authHeader)

    expect(res.status).toBe(200)
    expect(res.body.comments.length).toBeGreaterThan(0)
    // Each comment should include blog title
    expect(res.body.comments[0].blog).toHaveProperty('title')
  })
})

describe('GET /api/analytics/top-posts', () => {
  it('returns top posts by views and comments', async () => {
    await seedAnalyticsData()

    const res = await request(app)
      .get('/api/analytics/top-posts')
      .set(authHeader)

    expect(res.status).toBe(200)
    expect(res.body.topByViews).toBeDefined()
    expect(res.body.topByComments).toBeDefined()
  })
})

describe('Analytics — date validation', () => {
  it('rejects invalid startDate', async () => {
    const res = await request(app)
      .get('/api/analytics/category-distribution?startDate=not-a-date')
      .set(authHeader)

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('rejects startDate after endDate', async () => {
    const res = await request(app)
      .get('/api/analytics/category-distribution?startDate=2026-03-01&endDate=2026-01-01')
      .set(authHeader)

    expect(res.status).toBe(400)
  })
})
