import { describe, it, expect } from 'vitest'
import mongoose from 'mongoose'
import Blog from '../src/models/Blog.js'

describe('Blog model', () => {
  it('creates blog with valid fields', async () => {
    const userId = new mongoose.Types.ObjectId()
    const blog = await Blog.create({
      title: 'Test Blog',
      description: 'Test description content',
      category: 'Technology',
      image: '/uploads/blogs/test.jpg',
      author: userId,
      authorName: 'Test Author',
    })

    expect(blog._id).toBeDefined()
    expect(blog.title).toBe('Test Blog')
    expect(blog.category).toBe('Technology')
  })

  it('fails without required title', async () => {
    const userId = new mongoose.Types.ObjectId()
    await expect(
      Blog.create({
        description: 'Test description',
        category: 'Technology',
        image: '/uploads/test.jpg',
        author: userId,
        authorName: 'Author',
      })
    ).rejects.toThrow(/title/i)
  })

  it('fails without required description', async () => {
    const userId = new mongoose.Types.ObjectId()
    await expect(
      Blog.create({
        title: 'Test Blog',
        category: 'Technology',
        image: '/uploads/test.jpg',
        author: userId,
        authorName: 'Author',
      })
    ).rejects.toThrow(/description/i)
  })

  it('defaults isPublished to false', async () => {
    const userId = new mongoose.Types.ObjectId()
    const blog = await Blog.create({
      title: 'Test Blog',
      description: 'Test description content',
      category: 'Technology',
      image: '/uploads/blogs/test.jpg',
      author: userId,
      authorName: 'Test Author',
    })

    expect(blog.isPublished).toBe(false)
  })
})
