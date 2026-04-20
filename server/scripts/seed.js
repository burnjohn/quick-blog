import mongoose from 'mongoose'
import crypto from 'crypto'
import 'dotenv/config'
import User from '../src/models/User.js'
import Blog from '../src/models/Blog.js'
import Comment from '../src/models/Comment.js'
import BlogView from '../src/models/BlogView.js'
import dbLogger from '../src/utils/dbLogger.js'
import { users } from '../fixtures/users.js'
import { blogs } from '../fixtures/blogs.js'
import { comments } from '../fixtures/comments.js'
import { viewConfig } from '../fixtures/views.js'

const MS_PER_DAY = 24 * 60 * 60 * 1000
const SPREAD_DAYS = 180 // ~6 months
const TARGET_VIEWS = 750 // mid-range of REQ-7.8 (500–1000)
const MAX_COMMENTS_PER_DAY_RATIO = 0.2 // REQ-7.4

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

const isWeekend = (date) => {
  const d = date.getDay()
  return d === 0 || d === 6
}

const pickDistinctDayOffsets = (count, rangeDays) => {
  const offsets = new Set()
  while (offsets.size < count) {
    offsets.add(Math.floor(Math.random() * rangeDays))
  }
  return Array.from(offsets).sort((a, b) => a - b)
}

const sampleByDistribution = (distribution) => {
  const entries = Object.entries(distribution)
  const total = entries.reduce((sum, [, w]) => sum + w, 0)
  let r = Math.random() * total
  for (const [key, weight] of entries) {
    r -= weight
    if (r <= 0) return key
  }
  return entries[entries.length - 1][0]
}

const dayKey = (date) => {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const buildBlogDocs = (createdUsers) => {
  const now = Date.now()
  const offsets = pickDistinctDayOffsets(blogs.length, SPREAD_DAYS)
  return blogs.map((blog, i) => {
    const author = createdUsers[i % createdUsers.length]
    // oldest blog first → offsets[0] is smallest (closest to SPREAD_DAYS ago)
    const daysAgo = SPREAD_DAYS - offsets[i]
    const createdAt = new Date(now - daysAgo * MS_PER_DAY + Math.floor(Math.random() * MS_PER_DAY))
    return {
      ...blog,
      author: author._id,
      authorName: author.name,
      createdAt,
      updatedAt: createdAt
    }
  })
}

const buildCommentDocs = (createdBlogs, commentFixtures) => {
  const now = Date.now()
  const docs = []
  const perDayCount = new Map()
  const maxPerDay = Math.max(1, Math.ceil(commentFixtures.length * MAX_COMMENTS_PER_DAY_RATIO))

  for (const fixture of commentFixtures) {
    const blog = createdBlogs[Math.floor(Math.random() * createdBlogs.length)]
    const blogMs = blog.createdAt.getTime()
    const endMs = now

    // Pick a createdAt that respects the ≤20%-per-day cap.
    let createdAt
    for (let attempt = 0; attempt < 20; attempt++) {
      const candidate = new Date(blogMs + Math.random() * (endMs - blogMs))
      const key = dayKey(candidate)
      const count = perDayCount.get(key) || 0
      if (count < maxPerDay) {
        perDayCount.set(key, count + 1)
        createdAt = candidate
        break
      }
    }
    if (!createdAt) {
      // Fallback: just place it somewhere in range; cap is very loose for 100/180.
      createdAt = new Date(blogMs + Math.random() * (endMs - blogMs))
    }

    docs.push({
      blog: blog._id,
      name: fixture.name,
      content: fixture.content,
      isApproved: fixture.isApproved,
      createdAt,
      updatedAt: createdAt
    })
  }
  return docs
}

// Skew a uniform [0,1] toward 1 to model month-over-month growth.
// Larger growthFactor → stronger recency bias.
const biasedUniform = (growthFactor) => {
  return 1 - Math.pow(1 - Math.random(), growthFactor)
}

const buildViewDocs = (createdBlogs) => {
  const publishedBlogs = createdBlogs.filter((b) => b.isPublished)
  if (publishedBlogs.length === 0) return []

  // Distribute TARGET_VIEWS across published blogs weighted by category multiplier.
  const weights = publishedBlogs.map(
    (b) => viewConfig.categoryMultiplier[b.category] ?? 0.5
  )
  const totalWeight = weights.reduce((a, b) => a + b, 0)

  const docs = []
  const endMs = Date.now()

  publishedBlogs.forEach((blog, i) => {
    const share = weights[i] / totalWeight
    const count = Math.max(1, Math.round(TARGET_VIEWS * share))
    const startMs = blog.createdAt.getTime()
    if (startMs >= endMs) return

    const weekendAcceptRatio =
      viewConfig.weekdayBias.weekend / viewConfig.weekdayBias.weekday

    for (let j = 0; j < count; j++) {
      let viewedAt
      for (let attempt = 0; attempt < 8; attempt++) {
        const u = biasedUniform(viewConfig.growthFactor)
        const candidate = new Date(startMs + u * (endMs - startMs))
        const accept = isWeekend(candidate)
          ? Math.random() < weekendAcceptRatio
          : true
        if (accept) {
          viewedAt = candidate
          break
        }
      }
      if (!viewedAt) {
        viewedAt = new Date(
          startMs + biasedUniform(viewConfig.growthFactor) * (endMs - startMs)
        )
      }

      docs.push({
        blog: blog._id,
        viewedAt,
        referrerSource: sampleByDistribution(viewConfig.referrerDistribution),
        // Small fraction of admin views — excluded from KPI aggregations per REQ-6.5
        isAdminView: Math.random() < 0.05,
        visitorKey: crypto.randomUUID()
      })
    }
  })

  return docs
}

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...\n')

    // Clear existing data (users → blogs → comments → views are all wiped)
    await User.deleteMany({})
    await Blog.deleteMany({})
    await Comment.deleteMany({})
    await BlogView.deleteMany({})
    console.log('🗑️  Cleared existing data\n')

    // 1. Users
    const createdUsers = await User.create(users)
    console.log(`✅ Created ${createdUsers.length} users`)
    dbLogger.logEvent('SEED_USERS', `Created ${createdUsers.length} users`)

    console.log('\n📝 Test Credentials:')
    users.forEach((user) => {
      console.log(`   ${user.role.toUpperCase()}: ${user.email} / ${user.password}`)
    })
    console.log()

    // 2. Blogs — spread createdAt across last 6 months on distinct days (REQ-7.9)
    const blogDocs = buildBlogDocs(createdUsers)
    const createdBlogs = await Blog.insertMany(blogDocs, { timestamps: false })
    const publishedCount = createdBlogs.filter((b) => b.isPublished).length
    console.log(
      `✅ Created ${createdBlogs.length} blog posts (${publishedCount} published, ${createdBlogs.length - publishedCount} drafts)\n`
    )
    dbLogger.logEvent('SEED_BLOGS', `Created ${createdBlogs.length} blogs`)

    // 3. Comments — spread createdAt with ≤20% on any single day (REQ-7.4)
    const commentDocs = buildCommentDocs(createdBlogs, comments)
    const createdComments = await Comment.insertMany(commentDocs, {
      timestamps: false
    })
    const approvedCount = createdComments.filter((c) => c.isApproved).length
    console.log(
      `✅ Created ${createdComments.length} comments (${approvedCount} approved, ${createdComments.length - approvedCount} pending)\n`
    )
    dbLogger.logEvent('SEED_COMMENTS', `Created ${createdComments.length} comments`)

    // 4. BlogViews — 500–1000 records with weekday bias + growth factor (REQ-7.1–7.8)
    const viewDocs = buildViewDocs(createdBlogs)
    const createdViews = await BlogView.insertMany(viewDocs)
    console.log(`✅ Created ${createdViews.length} blog views\n`)
    dbLogger.logEvent('SEED_VIEWS', `Created ${createdViews.length} views`)

    dbLogger.logEvent('SEED_COMPLETE', 'Database seeded successfully')
    console.log('🎉 Database seeded successfully!\n')
  } catch (error) {
    console.error('❌ Seed error:', error)
    dbLogger.logError('SEED_ERROR', error)
    process.exit(1)
  }
}

const runSeed = async () => {
  await connectDB()
  await seedDatabase()
  await mongoose.connection.close()
  console.log('👋 Database connection closed\n')
  process.exit(0)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed()
}

export default runSeed
