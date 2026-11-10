import { describe, it, expect } from 'vitest'
import Blog from '../src/models/Blog.js'
import User from '../src/models/User.js'
import AnalyticsDaily from '../src/models/AnalyticsDaily.js'
import { buildAnalyticsDocs } from '../src/utils/analyticsGenerator.js'
import { users } from '../fixtures/users.js'
import { blogs } from '../fixtures/blogs.js'

const DAY_MS = 86400000
const END = new Date('2026-11-10T08:00:00Z')

describe('seed fixtures', () => {
  it('has at least 12 posts with tags, categories, dates and known authors', () => {
    const emails = new Set(users.map(u => u.email))
    expect(blogs.length).toBeGreaterThanOrEqual(12)
    expect(users.length).toBeGreaterThanOrEqual(3)
    for (const blog of blogs) {
      expect(blog.tags.length).toBeGreaterThan(0)
      expect(['Technology', 'Startup', 'Lifestyle', 'Finance']).toContain(blog.category)
      expect(blog.publishedDaysAgo).toBeGreaterThan(0)
      expect(emails.has(blog.authorEmail)).toBe(true)
    }
    expect(Math.max(...blogs.map(b => b.publishedDaysAgo))).toBeGreaterThanOrEqual(364)
  })
})

describe('analytics seed', () => {
  it('Blog.create keeps an explicit createdAt and tags', async () => {
    const author = await User.create({ ...users[1] })
    const createdAt = new Date(END.getTime() - 100 * DAY_MS)
    const blog = await Blog.create({
      title: 'Old', description: 'd', category: 'Startup', image: '/x.png', tags: ['a', 'b'],
      author: author._id, authorName: author.name, createdAt
    })
    const found = await Blog.findById(blog._id).lean()
    expect(found.createdAt.getTime()).toBe(createdAt.getTime())
    expect(found.tags).toEqual(['a', 'b'])
  })

  it('builds docs that insertMany stores and that cover 365 days', async () => {
    const author = await User.create({ ...users[1] })
    const created = []
    for (const { authorEmail, publishedDaysAgo, ...data } of blogs) {
      created.push(await Blog.create({
        ...data, author: author._id, authorName: author.name,
        createdAt: new Date(END.getTime() - publishedDaysAgo * DAY_MS)
      }))
    }
    const docs = buildAnalyticsDocs(created, END)
    for (let i = 0; i < docs.length; i += 2000) await AnalyticsDaily.insertMany(docs.slice(i, i + 2000))

    expect(await AnalyticsDaily.countDocuments()).toBe(docs.length)
    const days = await AnalyticsDaily.distinct('date')
    expect(days).toHaveLength(365)
    const row = await AnalyticsDaily.findOne().lean()
    expect(row.hours).toHaveLength(24)
    expect(row.countries.US).toBeGreaterThanOrEqual(0)
  })
})
