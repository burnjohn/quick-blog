import express from 'express'
import { 
  adminLogin, 
  getAllBlogsAdmin, 
  getDashboard 
} from '../controllers/adminController.js'
import {
  getAllCommentsAdmin,
  approveComment,
  deleteComment
} from '../controllers/commentController.js'
import {
  validateCommentApproval,
  validateCommentDelete
} from '../validators/commentValidator.js'
import auth from '../middleware/auth.js'

const adminRouter = express.Router()

adminRouter.post('/login', adminLogin)

// Apply auth middleware to all routes below this point
adminRouter.use(auth)

adminRouter.get('/dashboard', getDashboard)
adminRouter.get('/blogs', getAllBlogsAdmin)
adminRouter.get('/comments', getAllCommentsAdmin)
adminRouter.post('/comments/approve', validateCommentApproval, approveComment)
adminRouter.post('/comments/delete', validateCommentDelete, deleteComment)

export default adminRouter