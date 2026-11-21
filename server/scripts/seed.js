import mongoose from 'mongoose'
import 'dotenv/config'
import User from '../src/models/User.js'
import Blog from '../src/models/Blog.js'
import Comment from '../src/models/Comment.js'
import BlogView from '../src/models/BlogView.js'
import dbLogger from '../src/utils/dbLogger.js'
import { users } from '../fixtures/users.js'
import { blogs } from '../fixtures/blogs.js'
import { comments, commentConfig } from '../fixtures/comments.js'
import { viewConfig } from '../fixtures/views.js'

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

// Spread dates over the last N months (with slight random jitter)
const spreadDate = (index, total, monthsBack = 6) => {
  const now = new Date()
  const msBack = monthsBack * 30 * 24 * 60 * 60 * 1000
  const interval = msBack / total
  return new Date(now.getTime() - msBack + interval * index + Math.random() * interval * 0.5)
}

// Seed BlogView records using viewConfig
const seedViews = async (publishedBlogs) => {
  if (publishedBlogs.length === 0) return 0

  const totalViews =
    viewConfig.totalViews.min +
    Math.floor(Math.random() * (viewConfig.totalViews.max - viewConfig.totalViews.min + 1))
  const numVisitors =
    viewConfig.uniqueVisitors.min +
    Math.floor(Math.random() * (viewConfig.uniqueVisitors.max - viewConfig.uniqueVisitors.min + 1))

  const visitors = Array.from({ length: numVisitors }, (_, i) => `visitor_${i + 1}_${Date.now()}`)

  const blogWeights = publishedBlogs.map((blog) => ({
    blog,
    weight: viewConfig.categoryPopularity[blog.category] ?? 0.3
  }))
  const totalWeight = blogWeights.reduce((sum, b) => sum + b.weight, 0)

  const views = []
  const now = new Date()
  const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000)

  const referrerPool = []
  for (const [source, ratio] of Object.entries(viewConfig.referrerDistribution)) {
    const count = Math.round(totalViews * ratio)
    for (let i = 0; i < count; i++) referrerPool.push(source)
  }
  for (let i = referrerPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [referrerPool[i], referrerPool[j]] = [referrerPool[j], referrerPool[i]]
  }

  for (let i = 0; i < totalViews; i++) {
    let r = Math.random() * totalWeight
    let selectedBlog = blogWeights[0].blog
    for (const bw of blogWeights) {
      r -= bw.weight
      if (r <= 0) {
        selectedBlog = bw.blog
        break
      }
    }

    const totalMs = now.getTime() - sixMonthsAgo.getTime()
    const progress = Math.pow(Math.random(), 1 / viewConfig.growthFactor)
    let viewedAt = new Date(sixMonthsAgo.getTime() + progress * totalMs)

    const day = viewedAt.getDay()
    const isWeekday = day > 0 && day < 6
    if (!isWeekday && Math.random() > 1 / viewConfig.weekdayMultiplier) {
      continue
    }

    if (viewedAt < selectedBlog.createdAt) {
      viewedAt = new Date(
        selectedBlog.createdAt.getTime() +
          Math.random() * (now.getTime() - selectedBlog.createdAt.getTime())
      )
    }

    views.push({
      blog: selectedBlog._id,
      viewedAt,
      referrerSource: referrerPool[i % referrerPool.length] ?? 'direct',
      isAdminView: false,
      visitorKey: visitors[Math.floor(Math.random() * visitors.length)]
    })
  }

  const inserted = await BlogView.insertMany(views)
  return inserted.length
}

// Seed database
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...\n')

    // Clear existing data
    await User.deleteMany({})
    await Blog.deleteMany({})
    await Comment.deleteMany({})
    await BlogView.deleteMany({})
    console.log('🗑️  Cleared existing data\n')

    const createdUsers = await User.create(users)
    console.log(`✅ Created ${createdUsers.length} users`)
    dbLogger.logEvent('SEED_USERS', `Created ${createdUsers.length} users`)

    console.log('\n📝 Test Credentials:')
    users.forEach((user) => {
      console.log(`   ${user.role.toUpperCase()}: ${user.email} / ${user.password}`)
    })
    console.log()

    const createdBlogs = []
    for (let i = 0; i < blogs.length; i++) {
      const author = createdUsers[i % createdUsers.length]
      const blogData = blogs[i]
      const blog = await Blog.create({
        ...blogData,
        author: author._id,
        authorName: author.name,
        isPublished: blogData.isPublished ?? true,
        createdAt: spreadDate(i, blogs.length)
      })
      createdBlogs.push(blog)
      dbLogger.logCreate('blogs', blog)
    }
    console.log(`✅ Created ${createdBlogs.length} blog posts\n`)

    const publishedBlogs = createdBlogs.filter((b) => b.isPublished)
    const { min: minComments, max: maxComments } = commentConfig.total
    const targetComments = minComments + Math.floor(Math.random() * (maxComments - minComments + 1))

    // Prefer topic-specific templates (forTitle) for their post, never repeat a
    // template on the same post while unused ones remain.
    const genericTemplates = comments.filter((t) => !t.forTitle)
    const usedTemplates = new Map()
    const pickCommentTemplate = (blog, used) => {
      const key = String(blog._id)
      if (!used.has(key)) used.set(key, new Set())
      const usedForBlog = used.get(key)
      const specific = comments.filter((t) => t.forTitle === blog.title && !usedForBlog.has(t))
      const generic = genericTemplates.filter((t) => !usedForBlog.has(t))
      const pool = specific.length && (Math.random() < 0.6 || !generic.length)
        ? specific
        : generic.length ? generic : genericTemplates
      const picked = pool[Math.floor(Math.random() * pool.length)]
      usedForBlog.add(picked)
      const { forTitle, ...template } = picked
      return template
    }

    let commentCount = 0
    for (let c = 0; c < targetComments; c++) {
      const blog = publishedBlogs[Math.floor(Math.random() * publishedBlogs.length)]
      const template = pickCommentTemplate(blog, usedTemplates)
      const blogCreatedAt = blog.createdAt.getTime()
      const now = Date.now()
      const commentCreatedAt = new Date(
        blogCreatedAt + Math.random() * (now - blogCreatedAt)
      )

      const comment = await Comment.create({
        ...template,
        blog: blog._id,
        createdAt: commentCreatedAt
      })
      dbLogger.logCreate('comments', comment)
      commentCount++
    }
    console.log(`✅ Created ${commentCount} comments\n`)

    const viewCount = await seedViews(publishedBlogs)
    console.log(`✅ Created ${viewCount} blog views\n`)

    dbLogger.logEvent('SEED_COMPLETE', 'Database seeded successfully')
    console.log('🎉 Database seeded successfully!\n')

  } catch (error) {
    console.error('❌ Seed error:', error)
    dbLogger.logError('SEED_ERROR', error)
    process.exit(1)
  }
}

// Run seed
const runSeed = async () => {
  await connectDB()
  await seedDatabase()
  await mongoose.connection.close()
  console.log('👋 Database connection closed\n')
  process.exit(0)
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed()
}

export default runSeed
