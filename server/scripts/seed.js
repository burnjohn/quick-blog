import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import path from 'path'
import 'dotenv/config'
import User from '../src/models/User.js'
import Blog from '../src/models/Blog.js'
import Comment from '../src/models/Comment.js'
import BlogView from '../src/models/BlogView.js'
import dbLogger from '../src/utils/dbLogger.js'
import { users } from '../fixtures/users.js'
import { blogs } from '../fixtures/blogs.js'
import { commentTemplates, commentDistribution } from '../fixtures/comments.js'
import { viewConfig } from '../fixtures/views.js'

const SEED = 42

/**
 * Deterministic PRNG (Linear Congruential Generator)
 * Same seed always produces same sequence.
 */
function createPRNG(seed) {
  let s = seed
  return function () {
    s = (s * 1664525 + 1013904223) & 0xFFFFFFFF
    return (s >>> 0) / 0xFFFFFFFF
  }
}

const random = createPRNG(SEED)

/** Random int in [min, max] inclusive */
function randomInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min
}

/** Pick random element from array */
function pick(arr) {
  return arr[Math.floor(random() * arr.length)]
}

/** Weighted pick: keys = [k1,k2,...], weights = [w1,w2,...] */
function weightedPick(keys, weights) {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = random() * total
  for (let i = 0; i < keys.length; i++) {
    r -= weights[i]
    if (r <= 0) return keys[i]
  }
  return keys[keys.length - 1]
}

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

const runSeed = async () => {
  await connectDB()

  try {
    console.log('🌱 Starting database seed...\n')

    // Clear existing data (all four collections)
    await User.deleteMany({})
    await Blog.deleteMany({})
    await Comment.deleteMany({})
    await BlogView.deleteMany({})
    console.log('🗑️  Cleared existing data\n')

    // Seed users
    const createdUsers = await User.create(users)
    console.log(`✅ Created ${createdUsers.length} users`)
    dbLogger.logEvent('SEED_USERS', `Created ${createdUsers.length} users`)

    console.log('\n📝 Test Credentials:')
    users.forEach(user => {
      console.log(`   ${user.role.toUpperCase()}: ${user.email} / ${user.password}`)
    })
    console.log()

    const now = new Date()

    // Seed blogs with daysAgo → createdAt, alternating authors, isPublished from fixture
    const createdBlogs = []
    for (let i = 0; i < blogs.length; i++) {
      const author = createdUsers[i % createdUsers.length]
      const blogData = blogs[i]
      const createdAt = new Date(now)
      createdAt.setDate(createdAt.getDate() - blogData.daysAgo)
      createdAt.setHours(12, 0, 0, 0)

      const blog = await Blog.create({
        title: blogData.title,
        subTitle: blogData.subTitle,
        description: blogData.description,
        category: blogData.category,
        image: blogData.image,
        author: author._id,
        authorName: author.name,
        isPublished: blogData.isPublished
      })
      await Blog.updateOne({ _id: blog._id }, { $set: { createdAt, updatedAt: createdAt } })
      blog.createdAt = createdAt
      blog.updatedAt = createdAt
      createdBlogs.push(blog)
      dbLogger.logCreate('blogs', blog)
    }
    console.log(`✅ Created ${createdBlogs.length} blog posts\n`)

    const publishedBlogsWithData = createdBlogs
      .map((blog, i) => ({ blog, blogData: blogs[i] }))
      .filter(({ blog }) => blog.isPublished)
    const publishedBlogs = publishedBlogsWithData.map(({ blog }) => blog)

    // Comment distribution: assign high/med/low/zero to published posts
    const { highCommentCount, medCommentCount, lowCommentCount, zeroCommentPosts, approvalRate } = commentDistribution
    const zeroIndices = new Set()
    while (zeroIndices.size < Math.min(zeroCommentPosts, publishedBlogs.length)) {
      zeroIndices.add(Math.floor(random() * publishedBlogs.length))
    }

    const commentBuckets = publishedBlogs.map((_, i) => {
      if (zeroIndices.has(i)) return 0
      const r = random()
      if (r < 0.35) return randomInt(highCommentCount.min, highCommentCount.max)
      if (r < 0.65) return randomInt(medCommentCount.min, medCommentCount.max)
      return randomInt(lowCommentCount.min, lowCommentCount.max)
    })

    // Popular categories (Technology, Lifestyle) get more high-comment posts — reorder if needed
    const techLifestyleIdx = publishedBlogs
      .map((b, i) => ({ i, cat: b.category }))
      .filter(({ cat }) => cat === 'Technology' || cat === 'Lifestyle')
      .map(({ i }) => i)
    for (let i = 0; i < Math.min(3, techLifestyleIdx.length); i++) {
      const idx = techLifestyleIdx[Math.floor(random() * techLifestyleIdx.length)]
      if (commentBuckets[idx] < highCommentCount.min) {
        commentBuckets[idx] = randomInt(highCommentCount.min, highCommentCount.max)
      }
    }

    let totalComments = commentBuckets.reduce((a, b) => a + b, 0)
    const targetMin = 80
    const targetMax = 120
    if (totalComments < targetMin) {
      const diff = targetMin - totalComments
      for (let d = 0; d < diff; d++) {
        const idx = Math.floor(random() * publishedBlogs.length)
        if (!zeroIndices.has(idx)) commentBuckets[idx]++
      }
      totalComments = commentBuckets.reduce((a, b) => a + b, 0)
    } else if (totalComments > targetMax) {
      const diff = totalComments - targetMax
      for (let d = 0; d < diff; d++) {
        const idx = Math.floor(random() * publishedBlogs.length)
        if (commentBuckets[idx] > 0 && !zeroIndices.has(idx)) commentBuckets[idx]--
      }
      totalComments = commentBuckets.reduce((a, b) => a + b, 0)
    }

    const dayCounts = {}
    const maxPerDay = Math.ceil(totalComments * 0.15)

    let commentCount = 0
    for (let i = 0; i < publishedBlogsWithData.length; i++) {
      const { blog, blogData } = publishedBlogsWithData[i]
      const blogCreatedAt = new Date(now)
      blogCreatedAt.setDate(blogCreatedAt.getDate() - blogData.daysAgo)
      blogCreatedAt.setHours(12, 0, 0, 0)
      const maxDayOffset = blogData.daysAgo

      const n = commentBuckets[i]
      for (let c = 0; c < n; c++) {
        const template = pick(commentTemplates)
        let dayOffset = randomInt(0, Math.max(0, maxDayOffset))
        let attempts = 0
        let commentDate = new Date(blogCreatedAt)
        commentDate.setDate(commentDate.getDate() + dayOffset)
        let dateStr = commentDate.toISOString().slice(0, 10)
        while (attempts < 50 && (dayCounts[dateStr] || 0) >= maxPerDay) {
          dayOffset = randomInt(0, Math.max(0, maxDayOffset))
          commentDate = new Date(blogCreatedAt)
          commentDate.setDate(commentDate.getDate() + dayOffset)
          dateStr = commentDate.toISOString().slice(0, 10)
          attempts++
        }
        dayCounts[dateStr] = (dayCounts[dateStr] || 0) + 1

        commentDate.setHours(randomInt(8, 22), randomInt(0, 59), 0, 0)

        const isApproved = random() < approvalRate

        await Comment.create({
          blog: blog._id,
          name: template.name,
          content: template.content,
          isApproved,
          createdAt: commentDate,
          updatedAt: commentDate
        })
        commentCount++
      }
    }
    console.log(`✅ Created ${commentCount} comments\n`)

    // Generate ~750 BlogViews
    const targetViews = randomInt(viewConfig.totalViews.min, viewConfig.totalViews.max)
    const numVisitors = randomInt(viewConfig.uniqueVisitors.min, viewConfig.uniqueVisitors.max)
    const visitors = Array.from({ length: numVisitors }, (_, i) => `visitor_${String(i + 1).padStart(3, '0')}`)

    const refKeys = Object.keys(viewConfig.referrerDistribution)
    const refWeights = Object.values(viewConfig.referrerDistribution)

    const blogWeights = publishedBlogs.map(b => {
      const w = viewConfig.categoryPopularity[b.category] ?? 0.5
      return w
    })
    const blogNorm = blogWeights.reduce((a, b) => a + b, 0)
    const normBlogWeights = blogWeights.map(w => w / blogNorm)

    const viewsToCreate = []
    const sixMonthsAgo = new Date(now)
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    for (let v = 0; v < targetViews; v++) {
      const blog = publishedBlogs[weightedPick(publishedBlogs.map((_, i) => i), normBlogWeights)]
      const visitorKey = pick(visitors)
      const referrerSource = weightedPick(refKeys, refWeights)
      const isAdminView = random() < 0.025

      const u = random()
      const g = viewConfig.growthFactor
      const t = (-1 + Math.sqrt(1 + u * (g - 1) * (1 + g))) / (g - 1)
      const viewDate = new Date(sixMonthsAgo.getTime() + t * (now.getTime() - sixMonthsAgo.getTime()))
      const dayOfWeek = viewDate.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      if (isWeekend && random() > 1 / viewConfig.weekdayMultiplier) {
        viewDate.setDate(viewDate.getDate() + (dayOfWeek === 0 ? 1 : -1))
      }
      viewDate.setHours(randomInt(8, 22), randomInt(0, 59), randomInt(0, 59), 0)

      viewsToCreate.push({
        blog: blog._id,
        viewedAt: viewDate,
        referrerSource,
        isAdminView,
        visitorKey
      })
    }

    await BlogView.insertMany(viewsToCreate)
    console.log(`✅ Created ${viewsToCreate.length} blog views\n`)

    dbLogger.logEvent('SEED_COMPLETE', 'Database seeded successfully')
    console.log('📊 Seed Summary:')
    console.log(`   Blogs: ${createdBlogs.length}`)
    console.log(`   Comments: ${commentCount}`)
    console.log(`   Views: ${viewsToCreate.length}`)
    console.log('\n🎉 Database seeded successfully!\n')
  } catch (error) {
    console.error('❌ Seed error:', error)
    dbLogger.logError('SEED_ERROR', error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('👋 Database connection closed\n')
    process.exit(0)
  }
}

// Execute if run directly
const __filename = fileURLToPath(import.meta.url)
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  runSeed()
}

export default runSeed
