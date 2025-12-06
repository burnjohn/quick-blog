import express from 'express'
import { 
  addBlog, 
  deleteBlogById, 
  generateContent, 
  getAllBlogs, 
  getBlogById, 
  togglePublish 
} from '../controllers/blogController.js'
import upload from '../middleware/multer.js'
import auth from '../middleware/auth.js'

const blogRouter = express.Router()

blogRouter.get('/all', getAllBlogs)
blogRouter.get('/:blogId', getBlogById)

// Apply auth middleware to all routes below this point
blogRouter.use(auth)

blogRouter.post('/add', upload.single('image'), addBlog)
blogRouter.post('/delete', deleteBlogById)
blogRouter.post('/toggle-publish', togglePublish)
blogRouter.post('/generate', generateContent)

export default blogRouter