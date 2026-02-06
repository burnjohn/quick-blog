import express from 'express'
import {
  adminLogin,
  getAllBlogsAdmin,
  getDashboard
} from '../controllers/adminController.js'
import auth from '../middleware/auth.js'
import { loginLimiter } from '../middleware/rateLimiter.js'

const adminRouter = express.Router()

// Apply strict rate limiting to login endpoint
adminRouter.post('/login', loginLimiter, adminLogin)

// Apply auth middleware to all routes below this point
adminRouter.use(auth)

adminRouter.get('/dashboard', getDashboard)
adminRouter.get('/blogs', getAllBlogsAdmin)

export default adminRouter
