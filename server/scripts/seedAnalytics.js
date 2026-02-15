import mongoose from 'mongoose'
import 'dotenv/config'
import User from '../src/models/User.js'
import Blog from '../src/models/Blog.js'
import Comment from '../src/models/Comment.js'
import View from '../src/models/View.js'
import dbLogger from '../src/utils/dbLogger.js'
import { users } from '../fixtures/users.js'
import { blogs as originalBlogs } from '../fixtures/blogs.js'
import { analyticsBlogs } from '../fixtures/analyticsBlogs.js'
import { analyticsComments } from '../fixtures/analyticsComments.js'
import { generateViewFixtures } from '../fixtures/analyticsViews.js'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting analytics database seed...\n')

    // Clear ALL existing data
    await User.deleteMany({})
    await Blog.deleteMany({})
    await Comment.deleteMany({})
    await View.deleteMany({})
    console.log('🗑️  Cleared existing data\n')

    // Create users
    const createdUsers = await User.create(users)
    console.log(`✅ Created ${createdUsers.length} users`)

    // Display credentials
    console.log('\n📝 Test Credentials:')
    users.forEach(user => {
      console.log(`   ${user.role?.toUpperCase() || 'USER'}: ${user.email} / ${user.password}`)
    })
    console.log()

    // Create original blogs + analytics blogs
    const allBlogData = [...originalBlogs, ...analyticsBlogs]
    const createdBlogs = []

    for (let i = 0; i < allBlogData.length; i++) {
      const author = createdUsers[i % createdUsers.length]
      const blogData = {
        ...allBlogData[i],
        author: author._id,
        authorName: author.name,
        isPublished: allBlogData[i].isPublished !== undefined ? allBlogData[i].isPublished : true
      }

      const blog = await Blog.create(blogData)

      // Override createdAt if specified in fixture
      if (allBlogData[i].createdAt) {
        await Blog.updateOne(
          { _id: blog._id },
          { $set: { createdAt: allBlogData[i].createdAt } }
        )
        blog.createdAt = allBlogData[i].createdAt
      }

      createdBlogs.push(blog)
    }
    console.log(`✅ Created ${createdBlogs.length} blog posts\n`)

    // Create comments — distribute across all published blogs
    let commentCount = 0
    const publishedBlogs = createdBlogs.filter(b => b.isPublished)

    for (const commentData of analyticsComments) {
      const blog = publishedBlogs[Math.floor(Math.random() * publishedBlogs.length)]
      const comment = await Comment.create({
        ...commentData,
        blog: blog._id
      })

      // Override createdAt if specified
      if (commentData.createdAt) {
        await Comment.updateOne(
          { _id: comment._id },
          { $set: { createdAt: commentData.createdAt } }
        )
      }

      commentCount++
    }
    console.log(`✅ Created ${commentCount} comments\n`)

    // Generate and create view records
    const viewFixtures = generateViewFixtures(
      createdBlogs.map(b => ({ _id: b._id, category: b.category })),
      800
    )

    await View.insertMany(viewFixtures)
    console.log(`✅ Created ${viewFixtures.length} view records\n`)

    dbLogger.logEvent('ANALYTICS_SEED_COMPLETE', 'Analytics database seeded successfully')
    console.log('🎉 Analytics database seeded successfully!\n')
  } catch (error) {
    console.error('❌ Seed error:', error)
    dbLogger.logError('ANALYTICS_SEED_ERROR', error)
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
