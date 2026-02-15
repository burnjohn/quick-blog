import { describe, it, expect } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import app from '../../app.js'
import View from '../models/View.js'
import { createTestBlog } from '../../test/setup.js'

describe('POST /api/views/track', () => {
  it('tracks a new view', async () => {
    const blog = await createTestBlog()

    const res = await request(app)
      .post('/api/views/track')
      .send({ blogId: blog._id.toString(), sessionId: 'session-123' })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)

    const views = await View.find({ blog: blog._id })
    expect(views).toHaveLength(1)
    expect(views[0].isAdmin).toBe(false)
  })

  it('deduplicates views from same session within 24h', async () => {
    const blog = await createTestBlog()
    const payload = { blogId: blog._id.toString(), sessionId: 'session-dup' }

    await request(app).post('/api/views/track').send(payload)
    const res = await request(app).post('/api/views/track').send(payload)

    expect(res.status).toBe(200)
    expect(res.body.message).toContain('already recorded')

    const views = await View.find({ blog: blog._id })
    expect(views).toHaveLength(1)
  })

  it('rejects when blogId is missing', async () => {
    const res = await request(app)
      .post('/api/views/track')
      .send({ sessionId: 'session-123' })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('rejects when sessionId is missing', async () => {
    const blog = await createTestBlog()

    const res = await request(app)
      .post('/api/views/track')
      .send({ blogId: blog._id.toString() })

    expect(res.status).toBe(400)
  })

  it('rejects invalid blogId format', async () => {
    const res = await request(app)
      .post('/api/views/track')
      .send({ blogId: 'not-a-valid-id', sessionId: 'session-123' })

    expect(res.status).toBe(400)
  })

  it('returns 404 for non-existent blog', async () => {
    const fakeId = new mongoose.Types.ObjectId()

    const res = await request(app)
      .post('/api/views/track')
      .send({ blogId: fakeId.toString(), sessionId: 'session-123' })

    expect(res.status).toBe(404)
  })

  it('defaults referrer to direct', async () => {
    const blog = await createTestBlog()

    await request(app)
      .post('/api/views/track')
      .send({ blogId: blog._id.toString(), sessionId: 'session-ref' })

    const view = await View.findOne({ blog: blog._id })
    expect(view.referrer).toBe('direct')
  })

  it('accepts valid referrer values', async () => {
    const blog = await createTestBlog()

    await request(app)
      .post('/api/views/track')
      .send({ blogId: blog._id.toString(), sessionId: 'session-social', referrer: 'social' })

    const view = await View.findOne({ blog: blog._id })
    expect(view.referrer).toBe('social')
  })
})
