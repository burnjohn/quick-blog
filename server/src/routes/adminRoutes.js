import express from 'express'
import { 
  adminLogin, 
  getAllBlogsAdmin, 
  getDashboard 
} from '../controllers/adminController.js'
import auth from '../middleware/auth.js'

const adminRouter = express.Router()

adminRouter.post('/login', adminLogin)

// Apply auth middleware to all routes below this point
adminRouter.use(auth)

adminRouter.get('/dashboard', getDashboard)
adminRouter.get('/blogs', getAllBlogsAdmin)

export default adminRouter