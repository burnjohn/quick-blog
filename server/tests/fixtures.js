import jwt from 'jsonwebtoken'
import User from '../src/models/User.js'
import Blog from '../src/models/Blog.js'

export async function createTestUser(overrides = {}) {
  return User.create({
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
    isActive: true,
    ...overrides,
  })
}

export function generateToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
}

export async function createTestBlog(user, overrides = {}) {
  return Blog.create({
    title: 'Test Blog Post',
    description: 'Test blog description content',
    category: 'Technology',
    image: '/uploads/blogs/test.jpg',
    author: user._id,
    authorName: user.name,
    isPublished: true,
    ...overrides,
  })
}

export function authHeader(token) {
  return { Authorization: `Bearer ${token}` }
}
