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

blogRouter.get('/all', getAllBlogs)
blogRouter.get('/:blogId', getBlogById)
blogRouter.post('/add-comment', addComment)
blogRouter.post('/comments', getBlogComments)

// Apply auth middleware to all routes below this point
blogRouter.use(auth)

blogRouter.post('/add', upload.single('image'), addBlog)
blogRouter.post('/delete', deleteBlogById)
blogRouter.post('/toggle-publish', togglePublish)
blogRouter.post('/generate', generateContent)

export default blogRouter