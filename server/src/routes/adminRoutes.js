import express from 'express'
import { 
  adminLogin, 
  approveCommentById, 
  deleteCommentById, 
  getAllBlogsAdmin, 
  getAllComments, 
  getDashboard 
} from '../controllers/adminController.js'
import auth from '../middleware/auth.js'

const adminRouter = express.Router()

// Auth
adminRouter.post('/login', adminLogin)

// Protected routes (require authentication)
adminRouter.get('/dashboard', auth, getDashboard)
adminRouter.get('/blogs', auth, getAllBlogsAdmin)
adminRouter.get('/comments', auth, getAllComments)
adminRouter.post('/approve-comment', auth, approveCommentById)
adminRouter.post('/delete-comment', auth, deleteCommentById)

export default adminRouter