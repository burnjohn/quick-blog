import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import BlogView from '../src/models/BlogView.js'
import Comment from '../src/models/Comment.js'
import { toExcerpt } from '../src/helpers/popularPosts.js'
import { createTestUser, createTestBlog } from './fixtures.js'

const DAY_MS = 24 * 60 * 60 * 1000

async function addViews(blog, count, { daysAgo = 0, isAdminView = false } = {}) {
  const viewedAt = new Date(Date.now() - daysAgo * DAY_MS)
  const docs = Array.from({ length: count }, (_, i) => ({
    blog: blog._id,
    viewedAt,
    isAdminView,
    visitorKey: `visitor-${blog._id}-${daysAgo}-${isAdminView}-${i}`
  }))
  await BlogView.insertMany(docs)
}

describe('GET /api/blog/popular', () => {
  let user

  beforeEach(async () => {
    user = await createTestUser()
  })

  describe('happy path', () => {
    it('returns posts ranked by views with excerpt, views and approved comments', async () => {
      const first = await createTestBlog(user, {
        title: 'Most viewed',
        subTitle: 'Sub',
        description: '<h2>Hello</h2><p>World &amp; <strong>friends</strong></p>'
      })
      const second = await createTestBlog(user, { title: 'Second' })
      await addViews(first, 5)
      await addViews(second, 2)
      await Comment.create([
        { blog: first._id, name: 'Ann', content: 'Great post', isApproved: true },
        { blog: first._id, name: 'Bob', content: 'Nice post', isApproved: true },
        { blog: first._id, name: 'Spam', content: 'Pending one', isApproved: false }
      ])

      const res = await request(app).get('/api/blog/popular?limit=2')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.count).toBe(2)
      expect(res.body.blogs.map((b) => b.title)).toEqual(['Most viewed', 'Second'])
      expect(res.body.blogs[0]).toMatchObject({
        _id: String(first._id),
        title: 'Most viewed',
        subTitle: 'Sub',
        category: 'Technology',
        excerpt: 'Hello World & friends',
        views: 5,
        comments: 2,
        createdAt: expect.any(String)
      })
      expect(res.body.blogs[0].image).toMatch(/^http:\/\/.+\/uploads\/blogs\/test\.jpg$/)
      expect(res.body.blogs[0]).not.toHaveProperty('description')
      expect(res.body.blogs[1]).toMatchObject({ views: 2, comments: 0 })
    })

    it('applies default limit of 8', async () => {
      for (let i = 0; i < 10; i += 1) {
        const blog = await createTestBlog(user, { title: `Post ${i}` })
        await addViews(blog, i + 1)
      }

      const res = await request(app).get('/api/blog/popular')

      expect(res.status).toBe(200)
      expect(res.body.blogs).toHaveLength(8)
      expect(res.body.blogs[0].title).toBe('Post 9')
      expect(res.body.range).toBe('window')
      expect(res.body.days).toBe(30)
    })

    it('ranks by views inside the window when enough posts have views', async () => {
      const recent = await createTestBlog(user, { title: 'Recent' })
      const old = await createTestBlog(user, { title: 'Old hit' })
      await addViews(recent, 2, { daysAgo: 1 })
      await addViews(old, 1, { daysAgo: 1 })
      await addViews(old, 10, { daysAgo: 100 })

      const res = await request(app).get('/api/blog/popular?limit=2&days=7')

      expect(res.body.range).toBe('window')
      expect(res.body.blogs.map((b) => [b.title, b.views])).toEqual([['Recent', 2], ['Old hit', 1]])
    })

    it('falls back to all-time when the window has fewer than limit posts', async () => {
      const recent = await createTestBlog(user, { title: 'Recent' })
      const old = await createTestBlog(user, { title: 'Old hit' })
      await addViews(recent, 2, { daysAgo: 1 })
      await addViews(old, 10, { daysAgo: 100 })

      const res = await request(app).get('/api/blog/popular?limit=2&days=7')

      expect(res.status).toBe(200)
      expect(res.body.range).toBe('all')
      expect(res.body.blogs.map((b) => [b.title, b.views])).toEqual([['Old hit', 10], ['Recent', 2]])
    })

    it('returns an empty list when there are no views', async () => {
      await createTestBlog(user)

      const res = await request(app).get('/api/blog/popular')

      expect(res.status).toBe(200)
      expect(res.body.count).toBe(0)
      expect(res.body.blogs).toEqual([])
    })

    it('is not shadowed by the /:blogId route', async () => {
      const res = await request(app).get('/api/blog/popular')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('blogs')
    })
  })

  describe('exclusions', () => {
    it('excludes unpublished posts', async () => {
      const draft = await createTestBlog(user, { title: 'Draft', isPublished: false })
      const live = await createTestBlog(user, { title: 'Live' })
      await addViews(draft, 50)
      await addViews(live, 1)

      const res = await request(app).get('/api/blog/popular')

      expect(res.body.blogs.map((b) => b.title)).toEqual(['Live'])
    })

    it('excludes admin views from counts and ranking', async () => {
      const adminFav = await createTestBlog(user, { title: 'Admin favourite' })
      const reader = await createTestBlog(user, { title: 'Reader favourite' })
      await addViews(adminFav, 20, { isAdminView: true })
      await addViews(adminFav, 1)
      await addViews(reader, 3)

      const res = await request(app).get('/api/blog/popular')

      expect(res.body.blogs.map((b) => [b.title, b.views])).toEqual([
        ['Reader favourite', 3],
        ['Admin favourite', 1]
      ])
    })

    it('omits posts that only have admin views', async () => {
      const blog = await createTestBlog(user)
      await addViews(blog, 5, { isAdminView: true })

      const res = await request(app).get('/api/blog/popular')

      expect(res.body.blogs).toEqual([])
    })
  })

  describe('validation', () => {
    it.each([
      ['limit=0'],
      ['limit=21'],
      ['limit=abc'],
      ['limit=2.5'],
      ['limit=-1'],
      ['days=0'],
      ['days=366'],
      ['days=ten'],
      ['limit=1&limit=2']
    ])('rejects %s with 400', async (query) => {
      const res = await request(app).get(`/api/blog/popular?${query}`)

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toMatch(/must be an integer between/)
    })

    it('ignores operator-style keys (simple query parser) and uses defaults', async () => {
      const res = await request(app).get('/api/blog/popular?limit[$gt]=1')
      expect(res.status).toBe(200)
      expect(res.body.days).toBe(30)
    })

    it('accepts boundary values', async () => {
      const res = await request(app).get('/api/blog/popular?limit=20&days=365')
      expect(res.status).toBe(200)
      expect(res.body.days).toBe(365)
    })
  })
})

describe('toExcerpt', () => {
  it('strips tags, decodes entities and collapses whitespace', () => {
    expect(toExcerpt('<p>A&nbsp;&lt;b&gt;</p>\n\n<p>  B  </p>')).toBe('A <b> B')
  })

  it('does not add spaces around inline tags', () => {
    expect(toExcerpt('<p>Call <code>log()</code>. Done</p>')).toBe('Call log(). Done')
  })

  it('drops script/style contents', () => {
    expect(toExcerpt('<style>.x{}</style><p>Text</p><script>alert(1)</script>')).toBe('Text')
  })

  it('truncates on a word boundary with an ellipsis', () => {
    const long = Array.from({ length: 60 }, () => 'word').join(' ')
    const result = toExcerpt(long)
    expect(result.length).toBeLessThanOrEqual(161)
    expect(result.endsWith('word…')).toBe(true)
  })

  it('returns empty string for non-strings', () => {
    expect(toExcerpt(undefined)).toBe('')
  })
})
