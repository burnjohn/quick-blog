import express from 'express'
import { 
  addBlog, 
  addComment, 
  deleteBlogById, 
  generateContent, 
  getAllBlogs, 
  getBlogById, 
  getBlogComments, 
  togglePublish 
} from '../controllers/blogController.js'
import upload from '../middleware/multer.js'
import auth from '../middleware/auth.js'

const blogRouter = express.Router()

// Public routes
blogRouter.get('/all', getAllBlogs)
blogRouter.get('/:blogId', getBlogById)
blogRouter.post('/add-comment', addComment)
blogRouter.post('/comments', getBlogComments)

// Protected routes (require authentication)
blogRouter.post('/add', upload.single('image'), auth, addBlog)
blogRouter.post('/delete', auth, deleteBlogById)
blogRouter.post('/toggle-publish', auth, togglePublish)
blogRouter.post('/generate', auth, generateContent)

export default blogRouter