import mongoose from 'mongoose'
import 'dotenv/config'
import User from '../src/models/User.js'
import Blog from '../src/models/Blog.js'
import Comment from '../src/models/Comment.js'
import dbLogger from '../src/utils/dbLogger.js'
import { users } from '../fixtures/users.js'
import { blogs } from '../fixtures/blogs.js'
import { comments } from '../fixtures/comments.js'

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

// Seed database
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...\n')
    
    // Clear existing data
    await User.deleteMany({})
    await Blog.deleteMany({})
    await Comment.deleteMany({})
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
        isPublished: true
      })
      createdBlogs.push(blog)
      dbLogger.logCreate('blogs', blog)
    }
    console.log(`✅ Created ${createdBlogs.length} blog posts\n`)

    // Create comments for first 3 blogs
    let commentCount = 0
    for (let i = 0; i < Math.min(3, createdBlogs.length); i++) {
      for (const commentData of comments) {
        const comment = await Comment.create({
          ...commentData,
          blog: createdBlogs[i]._id
        })
        dbLogger.logCreate('comments', comment)
        commentCount++
      }
    }
    console.log(`✅ Created ${commentCount} comments\n`)

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

