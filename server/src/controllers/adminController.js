import jwt from 'jsonwebtoken'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import User from '../models/User.js'
import { transformBlogImage, transformBlogsImages } from '../utils/imageUrl.js'
import { asyncHandler } from '../helpers/asyncHandler.js'

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Find user by email
  const user = await User.findOne({ email, isActive: true })

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid Credentials' })
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password)

  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: 'Invalid Credentials' })
  }

  // Create JWT with user info and expiration
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({
    success: true,
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
})

export const getAllBlogsAdmin = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 })
  res.json({
    success: true,
    count: blogs.length,
    blogs: transformBlogsImages(blogs, req)
  })
})

export const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({}).populate('blog').sort({ createdAt: -1 })

  // Transform blog images in comments that have populated blog
  const transformedComments = comments.map(comment => {
    const commentObj = comment.toObject()
    if (commentObj.blog && commentObj.blog.image) {
      commentObj.blog = transformBlogImage(commentObj.blog, req)
    }
    return commentObj
  })

  res.json({
    success: true,
    count: transformedComments.length,
    comments: transformedComments
  })
})

export const getDashboard = asyncHandler(async (req, res) => {
  const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(6).lean()

  // Add comment counts to each blog and transform image URLs
  const blogsWithCounts = await Promise.all(
    recentBlogs.map(async (blog) => {
      const commentsCount = await Comment.countDocuments({ blog: blog._id })
      const transformed = transformBlogImage(blog, req)
      return { ...transformed, commentsCount }
    })
  )

  // Calculate start of current month for monthly stats
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [recentComments, blogs, comments, drafts, blogsThisMonth, publishedThisMonth] =
    await Promise.all([
      Comment.find({}).sort({ createdAt: -1 }).limit(6),
      Blog.countDocuments(),
      Comment.countDocuments(),
      Blog.countDocuments({ isPublished: false }),
      Blog.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Blog.countDocuments({ isPublished: true, createdAt: { $gte: startOfMonth } })
    ])

  const dashboardData = {
    blogs,
    comments,
    drafts,
    blogsThisMonth,
    publishedThisMonth,
    recentBlogs: blogsWithCounts,
    recentComments
  }

  res.json({ success: true, dashboardData })
})

export const deleteCommentById = asyncHandler(async (req, res) => {
  const { id } = req.body
  await Comment.findByIdAndDelete(id)
  res.json({ success: true, message: 'Comment deleted successfully' })
})

export const approveCommentById = asyncHandler(async (req, res) => {
  const { id } = req.body
  await Comment.findByIdAndUpdate(id, { isApproved: true })
  res.json({ success: true, message: 'Comment approved successfully' })
})

export const unapproveCommentById = asyncHandler(async (req, res) => {
  const { id } = req.body
  await Comment.findByIdAndUpdate(id, { isApproved: false })
  res.json({ success: true, message: 'Comment unapproved successfully' })
})
