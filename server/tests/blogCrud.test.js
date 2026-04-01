import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import app from '../src/app.js'
import Blog from '../src/models/Blog.js'
import Comment from '../src/models/Comment.js'
import { createTestUser, generateToken, createTestBlog, authHeader } from './fixtures.js'

describe('Blog CRUD', () => {
  let user, token

  beforeEach(async () => {
    user = await createTestUser()
    token = generateToken(user)
  })

  describe('GET /api/blog/all', () => {
    it('returns only published blogs with correct shape', async () => {
      await createTestBlog(user, { title: 'Published 1' })
      await createTestBlog(user, { title: 'Published 2' })
      await createTestBlog(user, { title: 'Draft', isPublished: false })

      const res = await request(app).get('/api/blog/all')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.blogs).toHaveLength(2)
      expect(res.body.count).toBe(2)
      expect(res.body.blogs[0]).toMatchObject({
        title: expect.any(String),
        category: expect.any(String),
        isPublished: true,
      })
    })

    it('returns empty array when no blogs exist', async () => {
      const res = await request(app).get('/api/blog/all')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.blogs).toHaveLength(0)
    })
  })

  describe('GET /api/blog/:blogId', () => {
    it('returns single blog by ID', async () => {
      const blog = await createTestBlog(user, { title: 'My Blog' })

      const res = await request(app).get(`/api/blog/${blog._id}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.blog.title).toBe('My Blog')
    })

    it('returns 404 for non-existent blog', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      const res = await request(app).get(`/api/blog/${fakeId}`)

      expect(res.status).toBe(404)
      expect(res.body.success).toBe(false)
    })
  })

  describe('POST /api/blog/delete', () => {
    it('removes blog and its comments', async () => {
      const blog = await createTestBlog(user)
      await Comment.create({ blog: blog._id, name: 'Tester', content: 'Nice post' })

      const res = await request(app)
        .post('/api/blog/delete')
        .set(authHeader(token))
        .send({ id: blog._id })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)

      // Verify blog is gone
      const deletedBlog = await Blog.findById(blog._id)
      expect(deletedBlog).toBeNull()

      // Verify comments are gone
      const comments = await Comment.find({ blog: blog._id })
      expect(comments).toHaveLength(0)
    })

    it('returns 404 for missing blog', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      const res = await request(app)
        .post('/api/blog/delete')
        .set(authHeader(token))
        .send({ id: fakeId })

      expect(res.status).toBe(404)
      expect(res.body.success).toBe(false)
    })
  })

  describe('POST /api/blog/publish', () => {
    it('toggles isPublished to true', async () => {
      const blog = await createTestBlog(user, { isPublished: false })

      const res = await request(app)
        .post('/api/blog/publish')
        .set(authHeader(token))
        .send({ id: blog._id })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)

      const updated = await Blog.findById(blog._id)
      expect(updated.isPublished).toBe(true)
    })
  })

  describe('POST /api/blog/unpublish', () => {
    it('toggles isPublished to false', async () => {
      const blog = await createTestBlog(user, { isPublished: true })

      const res = await request(app)
        .post('/api/blog/unpublish')
        .set(authHeader(token))
        .send({ id: blog._id })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)

      const updated = await Blog.findById(blog._id)
      expect(updated.isPublished).toBe(false)
    })
  })

  describe('Protected routes reject unauthenticated requests', () => {
    it('returns 401 without token on /delete, /publish, /unpublish', async () => {
      const endpoints = ['/api/blog/delete', '/api/blog/publish', '/api/blog/unpublish']

      for (const endpoint of endpoints) {
        const res = await request(app).post(endpoint).send({ id: 'any' })
        expect(res.status).toBe(401)
        expect(res.body.success).toBe(false)
      }
    })
  })
})
