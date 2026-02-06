import express from 'express'
import {
  deleteBlogById,
  getAllBlogs,
  getBlogById,
  publishBlog,
  unpublishBlog
} from '../controllers/blogController.js'
import auth from '../middleware/auth.js'

const blogRouter = express.Router()

// Public routes
blogRouter.get('/all', getAllBlogs)
blogRouter.get('/:blogId', getBlogById)

// Apply auth middleware to all routes below this point
blogRouter.use(auth)

// Protected routes
blogRouter.post('/delete', deleteBlogById)
blogRouter.post('/publish', publishBlog)
blogRouter.post('/unpublish', unpublishBlog)

export default blogRouter
