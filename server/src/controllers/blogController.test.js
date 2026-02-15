import { describe, it, expect } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import app from '../../app.js'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import { generateToken, createTestBlog } from '../../test/setup.js'

describe('GET /api/blog/all', () => {
  it('returns only published blogs', async () => {
    await createTestBlog({ title: 'Published', isPublished: true })
    await createTestBlog({ title: 'Draft', isPublished: false })

    const res = await request(app).get('/api/blog/all')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.count).toBe(1)
    expect(res.body.blogs[0].title).toBe('Published')
  })

  it('returns empty array when no published blogs exist', async () => {
    const res = await request(app).get('/api/blog/all')

    expect(res.status).toBe(200)
    expect(res.body.blogs).toHaveLength(0)
    expect(res.body.count).toBe(0)
  })
})

describe('GET /api/blog/:blogId', () => {
  it('returns a blog by ID', async () => {
    const blog = await createTestBlog()

    const res = await request(app).get(`/api/blog/${blog._id}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.blog.title).toBe('Test Blog Post')
  })

  it('returns 404 for non-existent blog', async () => {
    const fakeId = new mongoose.Types.ObjectId()

    const res = await request(app).get(`/api/blog/${fakeId}`)

    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
  })
})

describe('POST /api/blog/add-comment', () => {
  it('creates a comment on a blog', async () => {
    const blog = await createTestBlog()

    const res = await request(app)
      .post('/api/blog/add-comment')
      .send({ blog: blog._id, name: 'John Doe', content: 'Great post!' })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)

    const comments = await Comment.find({ blog: blog._id })
    expect(comments).toHaveLength(1)
    expect(comments[0].isApproved).toBe(false) // Comments start unapproved
  })

  it('rejects comment with missing fields', async () => {
    const res = await request(app)
      .post('/api/blog/add-comment')
      .send({ name: 'John' })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.errors).toBeDefined()
  })

  it('rejects comment with short name', async () => {
    const blog = await createTestBlog()

    const res = await request(app)
      .post('/api/blog/add-comment')
      .send({ blog: blog._id, name: 'J', content: 'Great post!' })

    expect(res.status).toBe(400)
    expect(res.body.errors).toContain('Name must be at least 2 characters')
  })
})

describe('POST /api/blog/comments', () => {
  it('returns only approved comments', async () => {
    const blog = await createTestBlog()
    await Comment.create([
      { blog: blog._id, name: 'Alice', content: 'Approved comment', isApproved: true },
      { blog: blog._id, name: 'Bob', content: 'Pending comment', isApproved: false }
    ])

    const res = await request(app)
      .post('/api/blog/comments')
      .send({ blogId: blog._id })

    expect(res.status).toBe(200)
    expect(res.body.count).toBe(1)
    expect(res.body.comments[0].name).toBe('Alice')
  })
})

describe('POST /api/blog/delete (auth required)', () => {
  it('rejects without auth token', async () => {
    const res = await request(app)
      .post('/api/blog/delete')
      .send({ id: new mongoose.Types.ObjectId() })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  it('deletes blog and its comments with valid token', async () => {
    const blog = await createTestBlog()
    await Comment.create({ blog: blog._id, name: 'Alice', content: 'A comment here' })
    const token = generateToken()

    const res = await request(app)
      .post('/api/blog/delete')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: blog._id })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

    // Blog and comments should be gone
    const deletedBlog = await Blog.findById(blog._id)
    expect(deletedBlog).toBeNull()

    const orphanedComments = await Comment.find({ blog: blog._id })
    expect(orphanedComments).toHaveLength(0)
  })

  it('returns 404 when deleting non-existent blog', async () => {
    const token = generateToken()

    const res = await request(app)
      .post('/api/blog/delete')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: new mongoose.Types.ObjectId() })

    expect(res.status).toBe(404)
  })
})

describe('POST /api/blog/publish (auth required)', () => {
  it('publishes a draft blog', async () => {
    const blog = await createTestBlog({ isPublished: false })
    const token = generateToken()

    const res = await request(app)
      .post('/api/blog/publish')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: blog._id })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

    const updated = await Blog.findById(blog._id)
    expect(updated.isPublished).toBe(true)
  })
})

describe('POST /api/blog/unpublish (auth required)', () => {
  it('unpublishes a published blog', async () => {
    const blog = await createTestBlog({ isPublished: true })
    const token = generateToken()

    const res = await request(app)
      .post('/api/blog/unpublish')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: blog._id })

    expect(res.status).toBe(200)

    const updated = await Blog.findById(blog._id)
    expect(updated.isPublished).toBe(false)
  })
})
