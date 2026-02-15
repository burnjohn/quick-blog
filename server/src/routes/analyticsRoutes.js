import express from 'express'
import auth from '../middleware/auth.js'
import { getSummary } from '../controllers/analyticsSummaryController.js'
import { exportCsv } from '../controllers/analyticsExportController.js'
import {
  getViewsOverTime,
  getPublicationsOverTime,
  getCategoryDistribution,
  getCommentActivity,
  getViewsByCategory,
  getTopPosts,
  getRecentComments
} from '../controllers/analyticsController.js'

const analyticsRouter = express.Router()

// All analytics routes require authentication
analyticsRouter.use(auth)

analyticsRouter.get('/summary', getSummary)
analyticsRouter.get('/views-over-time', getViewsOverTime)
analyticsRouter.get('/publications-over-time', getPublicationsOverTime)
analyticsRouter.get('/category-distribution', getCategoryDistribution)
analyticsRouter.get('/comment-activity', getCommentActivity)
analyticsRouter.get('/views-by-category', getViewsByCategory)
analyticsRouter.get('/top-posts', getTopPosts)
analyticsRouter.get('/recent-comments', getRecentComments)
analyticsRouter.get('/export', exportCsv)

export default analyticsRouter
