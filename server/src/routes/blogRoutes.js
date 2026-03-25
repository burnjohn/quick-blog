import express from 'express'
import {
  addBlog,
  addComment,
  deleteBlogById,
  generateContent,
  getAllBlogs,
  getBlogById,
  getBlogComments,
  publishBlog,
  unpublishBlog
} from '../controllers/blogController.js'
import { recordView } from '../controllers/analyticsController.js'
import upload from '../middleware/multer.js'
import auth from '../middleware/auth.js'
import { commentLimiter, generateLimiter } from '../middleware/rateLimiter.js'
import { validateComment, validateBlogInput } from '../validators/blogValidator.js'

const blogRouter = express.Router()

// Public routes
blogRouter.get('/all', getAllBlogs)
blogRouter.get('/:blogId', getBlogById)
blogRouter.post('/:blogId/view', recordView)
blogRouter.post('/add-comment', commentLimiter, validateComment, addComment)
blogRouter.post('/comments', getBlogComments)

// Apply auth middleware to all routes below this point
blogRouter.use(auth)

// Protected routes
blogRouter.post('/add', upload.single('image'), validateBlogInput, addBlog)
blogRouter.post('/delete', deleteBlogById)
blogRouter.post('/publish', publishBlog)
blogRouter.post('/unpublish', unpublishBlog)
blogRouter.post('/generate', generateLimiter, generateContent)

export default blogRouter
