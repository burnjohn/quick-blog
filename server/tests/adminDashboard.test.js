import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import Comment from '../src/models/Comment.js'
import { createTestUser, generateToken, createTestBlog, authHeader } from './fixtures.js'

describe('Admin Dashboard & Blog Listing', () => {
  let user, token

  beforeEach(async () => {
    user = await createTestUser()
    token = generateToken(user)
  })

  it('GET /api/admin/dashboard returns counts and recent data', async () => {
    const blog1 = await createTestBlog(user, { title: 'Published' })
    await createTestBlog(user, { title: 'Draft', isPublished: false })
    await Comment.create({ blog: blog1._id, name: 'A', content: 'Comment 1' })

    const res = await request(app)
      .get('/api/admin/dashboard')
      .set(authHeader(token))

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.dashboardData).toMatchObject({
      blogs: 2,
      comments: 1,
      drafts: 1,
      recentBlogs: expect.any(Array),
      recentComments: expect.any(Array),
    })
  })

  it('GET /api/admin/blogs returns all blogs including drafts', async () => {
    await createTestBlog(user, { title: 'Published' })
    await createTestBlog(user, { title: 'Draft', isPublished: false })

    const res = await request(app)
      .get('/api/admin/blogs')
      .set(authHeader(token))

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.blogs).toHaveLength(2)
    expect(res.body.count).toBe(2)
  })

  it('GET /api/admin/dashboard requires auth (401 without token)', async () => {
    const res = await request(app).get('/api/admin/dashboard')

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })
})
