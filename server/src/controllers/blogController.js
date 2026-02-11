import fs from 'fs'
import path from 'path'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import main from '../configs/gemini.js'
import { transformBlogImage, transformBlogsImages } from '../utils/imageUrl.js'
import { recordView } from '../utils/viewTracking.js'
import { asyncHandler } from '../helpers/asyncHandler.js'

// Helper to get image URL from filename (relative path for storage)
const getImagePath = (filename) => {
  return `/uploads/blogs/${filename}`
}

// Helper to delete image file from disk
const deleteImageFile = (imagePath) => {
  if (!imagePath) return

  // Extract filename from URL path (handle both relative and full URLs)
  const urlPath = imagePath.replace(/^https?:\/\/[^/]+/, '')
  const filename = urlPath.split('/').pop()
  const fullPath = path.join(process.cwd(), 'uploads', 'blogs', filename)

  // Only delete if file exists and is in uploads directory
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath)
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }
}

export const addBlog = asyncHandler(async (req, res) => {
  const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog)
  const imageFile = req.file

  // Check if all fields are present
  if (!title || !description || !category || !imageFile) {
    return res.status(400).json({ success: false, message: 'Missing required fields' })
  }

  // Get the image path from the uploaded file (stored as relative path)
  const image = getImagePath(imageFile.filename)

  // Create blog with author information from authenticated user
  const blog = await Blog.create({
    title,
    subTitle,
    description,
    category,
    image,
    isPublished,
    author: req.user.userId,
    authorName: req.user.name
  })

  res.status(201).json({ success: true, message: 'Blog added successfully', blog: transformBlogImage(blog, req) })
})

export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ isPublished: true })
  res.json({
    success: true,
    count: blogs.length,
    blogs: transformBlogsImages(blogs, req)
  })
})

export const getBlogById = asyncHandler(async (req, res) => {
  const { blogId } = req.params
  const blog = await Blog.findById(blogId)
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' })
  }
  if (blog.isPublished) {
    recordView(blog._id, req)
  }
  res.json({ success: true, blog: transformBlogImage(blog, req) })
})

export const deleteBlogById = asyncHandler(async (req, res) => {
  const { id } = req.body

  // Find the blog first to get the image path
  const blog = await Blog.findById(id)
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' })
  }

  // Delete the associated image file from disk
  if (blog.image) {
    deleteImageFile(blog.image)
  }

  await Blog.findByIdAndDelete(id)

  // Delete all comments associated with the blog
  await Comment.deleteMany({ blog: id })

  res.json({ success: true, message: 'Blog deleted successfully' })
})

export const publishBlog = asyncHandler(async (req, res) => {
  const { id } = req.body
  const blog = await Blog.findById(id)
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' })
  }
  blog.isPublished = true
  await blog.save()
  res.json({ success: true, message: 'Blog published successfully' })
})

export const unpublishBlog = asyncHandler(async (req, res) => {
  const { id } = req.body
  const blog = await Blog.findById(id)
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' })
  }
  blog.isPublished = false
  await blog.save()
  res.json({ success: true, message: 'Blog unpublished successfully' })
})

export const addComment = asyncHandler(async (req, res) => {
  const { blog, name, content } = req.body
  await Comment.create({ blog, name, content })
  res.status(201).json({ success: true, message: 'Comment added for review' })
})

export const getBlogComments = asyncHandler(async (req, res) => {
  const { blogId } = req.body
  const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 })
  res.json({
    success: true,
    count: comments.length,
    comments
  })
})

export const generateContent = asyncHandler(async (req, res) => {
  const { prompt } = req.body
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ success: false, message: 'Prompt is required' })
  }
  const content = await main(prompt + ' Generate a blog content for this topic in simple text format')
  res.json({ success: true, content })
})
