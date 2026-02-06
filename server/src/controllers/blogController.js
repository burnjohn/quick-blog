import fs from 'fs'
import path from 'path'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import { transformBlogImage, transformBlogsImages } from '../utils/imageUrl.js'
import { asyncHandler } from '../helpers/asyncHandler.js'

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

