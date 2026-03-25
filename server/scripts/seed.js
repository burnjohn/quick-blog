import mongoose from 'mongoose'
import 'dotenv/config'
import User from '../src/models/User.js'
import Blog from '../src/models/Blog.js'
import Comment from '../src/models/Comment.js'
import BlogView from '../src/models/BlogView.js'
import dbLogger from '../src/utils/dbLogger.js'
import { users } from '../fixtures/users.js'
import { blogs } from '../fixtures/blogs.js'
import { comments } from '../fixtures/comments.js'
import { viewsConfig } from '../fixtures/views.js'

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

// Seed blog views based on viewsConfig
const seedViews = async (createdBlogs) => {
  const {
    totalViews, categoryWeights, weekdayMultiplier,
    referrerSources, referrerWeights, visitorKeyPrefix
  } = viewsConfig

  // Build weighted blog pool based on category popularity
  const weightedPool = []
  createdBlogs.forEach(blog => {
    const weight = Math.round((categoryWeights[blog.category] || 0.1) * 100)
    for (let i = 0; i < weight; i++) weightedPool.push(blog)
  })

  const views = []
  let attempts = 0
  const maxAttempts = totalViews * 3

  while (views.length < totalViews && attempts < maxAttempts) {
    attempts++

    const blog = weightedPool[Math.floor(Math.random() * weightedPool.length)]

    // Random date within 6-month spread
    const daysAgo = Math.floor(Math.random() * 180)
    const viewDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

    // Weekday bias: weekends get fewer views
    const dayOfWeek = viewDate.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    if (isWeekend && Math.random() > (1 / weekdayMultiplier)) continue

    // Weighted referrer source
    const rnd = Math.random()
    let cumulative = 0
    let referrerSource = 'direct'
    for (let j = 0; j < referrerSources.length; j++) {
      cumulative += referrerWeights[j]
      if (rnd < cumulative) { referrerSource = referrerSources[j]; break }
    }

    views.push({
      blog: blog._id,
      viewedAt: viewDate,
      referrerSource,
      isAdminView: false,
      visitorKey: `${visitorKeyPrefix}${views.length}-${blog._id}`
    })
  }

  await BlogView.insertMany(views)
  console.log(`✅ Created ${views.length} blog views`)
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

    // Create users
    const createdUsers = await User.create(users)
    console.log(`✅ Created ${createdUsers.length} users`)
    dbLogger.logEvent('SEED_USERS', `Created ${createdUsers.length} users`)

    // Display credentials
    console.log('\n📝 Test Credentials:')
    users.forEach(user => {
      console.log(`   ${user.role.toUpperCase()}: ${user.email} / ${user.password}`)
    })
    console.log()

    // Create blogs with alternating authors
    const createdBlogs = []
    for (let i = 0; i < blogs.length; i++) {
      const author = createdUsers[i % createdUsers.length]
      const blog = await Blog.create({
        ...blogs[i],
        author: author._id,
        authorName: author.name,
        isPublished: true,
        createdAt: blogs[i].createdAt || new Date()
      })
      createdBlogs.push(blog)
      dbLogger.logCreate('blogs', blog)
    }
    console.log(`✅ Created ${createdBlogs.length} blog posts\n`)

    // Create comments distributed across ALL blogs (round-robin)
    let commentCount = 0
    for (let i = 0; i < comments.length; i++) {
      const blog = createdBlogs[i % createdBlogs.length]
      const comment = await Comment.create({
        ...comments[i],
        blog: blog._id
      })
      dbLogger.logCreate('comments', comment)
      commentCount++
    }
    console.log(`✅ Created ${commentCount} comments\n`)

    // Seed blog views
    await seedViews(createdBlogs)

    dbLogger.logEvent('SEED_COMPLETE', 'Database seeded successfully')
    console.log('\n🎉 Database seeded successfully!\n')

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
