import express from 'express'
import {
  addBlog,
  deleteBlogById,
  generateContent,
  getAllBlogs,
  getBlogById,
  publishBlog,
  unpublishBlog
} from '../controllers/blogController.js'
import upload from '../middleware/multer.js'
import auth from '../middleware/auth.js'
import { generateLimiter } from '../middleware/rateLimiter.js'
import { validateBlogInput } from '../validators/blogValidator.js'

const blogRouter = express.Router()

// Public routes
blogRouter.get('/all', getAllBlogs)
blogRouter.get('/:blogId', getBlogById)

// Apply auth middleware to all routes below this point
blogRouter.use(auth)

// Protected routes
blogRouter.post('/add', upload.single('image'), validateBlogInput, addBlog)
blogRouter.post('/delete', deleteBlogById)
blogRouter.post('/publish', publishBlog)
blogRouter.post('/unpublish', unpublishBlog)
blogRouter.post('/generate', generateLimiter, generateContent)

export default blogRouter
