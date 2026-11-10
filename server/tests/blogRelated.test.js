import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import app from '../src/app.js'
import { createTestUser, createTestBlog } from './fixtures.js'

const createAt = (user, date, overrides = {}) =>
  createTestBlog(user, { createdAt: new Date(date), ...overrides })

describe('GET /api/blog/:blogId/related', () => {
  let user

  beforeEach(async () => {
    user = await createTestUser()
  })

  it('returns published posts of the same category, excluding the current one, newest first', async () => {
    const current = await createAt(user, '2026-01-05', { title: 'Current' })
    await createAt(user, '2026-01-01', { title: 'Older' })
    await createAt(user, '2026-01-03', { title: 'Newer' })
    await createAt(user, '2026-01-04', { title: 'Draft', isPublished: false })
    await createAt(user, '2026-01-02', { title: 'Other category', category: 'Lifestyle' })

    const res = await request(app).get(`/api/blog/${current._id}/related`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.count).toBe(2)
    expect(res.body.blogs.map((b) => b.title)).toEqual(['Newer', 'Older'])
  })

  it('returns at most 6 posts', async () => {
    const current = await createTestBlog(user, { title: 'Current' })
    for (let i = 0; i < 8; i += 1) {
      await createAt(user, `2026-02-0${i + 1}`, { title: `Post ${i}` })
    }

    const res = await request(app).get(`/api/blog/${current._id}/related`)

    expect(res.status).toBe(200)
    expect(res.body.blogs).toHaveLength(6)
    expect(res.body.blogs[0].title).toBe('Post 7')
  })

  it('returns only the fields a card needs, with a full image URL', async () => {
    const current = await createTestBlog(user, { title: 'Current' })
    await createTestBlog(user, { title: 'Related', subTitle: 'Sub' })

    const res = await request(app).get(`/api/blog/${current._id}/related`)

    const [related] = res.body.blogs
    expect(related).toMatchObject({ title: 'Related', subTitle: 'Sub', category: 'Technology' })
    expect(related._id).toEqual(expect.any(String))
    expect(related.image).toMatch(/^https?:\/\/.+\/uploads\/blogs\/test\.jpg$/)
    expect(related).not.toHaveProperty('description')
    expect(related).not.toHaveProperty('author')
  })

  it('returns an empty list when there are no related posts', async () => {
    const current = await createTestBlog(user)

    const res = await request(app).get(`/api/blog/${current._id}/related`)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ success: true, count: 0, blogs: [] })
  })

  it('responds 404 for an unknown post', async () => {
    const res = await request(app).get(`/api/blog/${new mongoose.Types.ObjectId()}/related`)

    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
  })

  it('responds 400 for an invalid id', async () => {
    const res = await request(app).get('/api/blog/not-an-id/related')

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('is public (no auth header needed)', async () => {
    const current = await createTestBlog(user)

    const res = await request(app).get(`/api/blog/${current._id}/related`)

    expect(res.status).not.toBe(401)
  })
})
