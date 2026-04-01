import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import Comment from '../src/models/Comment.js'
import { createTestUser, generateToken, createTestBlog, authHeader } from './fixtures.js'

describe('Comments', () => {
  let user, token, blog

  beforeEach(async () => {
    user = await createTestUser()
    token = generateToken(user)
    blog = await createTestBlog(user)
  })

  it('POST /api/blog/add-comment creates comment (unapproved by default)', async () => {
    const res = await request(app)
      .post('/api/blog/add-comment')
      .send({ blog: blog._id, name: 'Commenter', content: 'Great article!' })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)

    const comment = await Comment.findOne({ blog: blog._id })
    expect(comment).not.toBeNull()
    expect(comment.isApproved).toBe(false)
    expect(comment.name).toBe('Commenter')
  })

  it('POST /api/blog/comments returns only approved comments', async () => {
    await Comment.create({ blog: blog._id, name: 'A', content: 'Approved one', isApproved: true })
    await Comment.create({ blog: blog._id, name: 'B', content: 'Pending one', isApproved: false })

    const res = await request(app)
      .post('/api/blog/comments')
      .send({ blogId: blog._id })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.comments).toHaveLength(1)
    expect(res.body.comments[0].name).toBe('A')
  })

  it('POST /api/admin/approve-comment approves a comment', async () => {
    const comment = await Comment.create({
      blog: blog._id,
      name: 'Tester',
      content: 'Pending comment',
      isApproved: false,
    })

    const res = await request(app)
      .post('/api/admin/approve-comment')
      .set(authHeader(token))
      .send({ id: comment._id })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

    const updated = await Comment.findById(comment._id)
    expect(updated.isApproved).toBe(true)
  })

  it('POST /api/admin/delete-comment deletes a comment', async () => {
    const comment = await Comment.create({
      blog: blog._id,
      name: 'Tester',
      content: 'To be deleted',
    })

    const res = await request(app)
      .post('/api/admin/delete-comment')
      .set(authHeader(token))
      .send({ id: comment._id })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

    const deleted = await Comment.findById(comment._id)
    expect(deleted).toBeNull()
  })
})
