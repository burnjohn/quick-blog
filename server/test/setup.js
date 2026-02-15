import { beforeAll, afterAll, afterEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

let mongoServer

// JWT secret used across all tests
const TEST_JWT_SECRET = 'test-secret-key'
process.env.JWT_SECRET = TEST_JWT_SECRET
process.env.NODE_ENV = 'test'

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
  // Clear all collections between tests
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

/**
 * Generate a valid JWT token for testing auth-protected routes.
 * @param {Object} [payload] - Custom payload fields (userId, name, email)
 * @returns {string} Bearer-ready JWT token
 */
export const generateToken = (payload = {}) => {
  const defaults = {
    userId: new mongoose.Types.ObjectId().toString(),
    name: 'Test Admin',
    email: 'admin@test.com'
  }
  return jwt.sign({ ...defaults, ...payload }, TEST_JWT_SECRET, { expiresIn: '1h' })
}

/**
 * Create a blog document directly in the DB for test setup.
 */
export const createTestBlog = async (overrides = {}) => {
  const Blog = mongoose.model('Blog')
  const defaults = {
    title: 'Test Blog Post',
    subTitle: 'A subtitle',
    description: 'This is a test blog post with enough content.',
    category: 'Technology',
    image: '/uploads/blogs/test-image.jpg',
    author: new mongoose.Types.ObjectId(),
    authorName: 'Test Author',
    isPublished: true
  }
  return Blog.create({ ...defaults, ...overrides })
}
