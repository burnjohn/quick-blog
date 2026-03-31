import { describe, it, expect } from 'vitest'
import mongoose from 'mongoose'
import Comment from '../src/models/Comment.js'

describe('Comment model', () => {
  it('creates comment with valid fields', async () => {
    const blogId = new mongoose.Types.ObjectId()
    const comment = await Comment.create({
      blog: blogId,
      name: 'John',
      content: 'Great post!',
    })

    expect(comment._id).toBeDefined()
    expect(comment.name).toBe('John')
    expect(comment.content).toBe('Great post!')
    expect(comment.blog.toString()).toBe(blogId.toString())
  })

  it('fails without required blog reference', async () => {
    await expect(
      Comment.create({
        name: 'John',
        content: 'Great post!',
      })
    ).rejects.toThrow(/blog/i)
  })

  it('defaults isApproved to false', async () => {
    const blogId = new mongoose.Types.ObjectId()
    const comment = await Comment.create({
      blog: blogId,
      name: 'John',
      content: 'Great post!',
    })

    expect(comment.isApproved).toBe(false)
  })
})
