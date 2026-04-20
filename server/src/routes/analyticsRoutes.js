import express from 'express'
import auth from '../middleware/auth.js'
import {
  getKpis,
  getViewsOverTime,
  getPublications,
  getCategoryDistribution,
  getCommentActivity,
  getViewsByCategory,
  getTopViewed,
  getTopCommented,
  getLastComments,
  exportCsv,
  getDrillDown
} from '../controllers/analyticsController.js'

const analyticsRouter = express.Router()

// All analytics endpoints require an authenticated admin.
analyticsRouter.use(auth)

analyticsRouter.get('/kpis', getKpis)
analyticsRouter.get('/views-over-time', getViewsOverTime)
analyticsRouter.get('/publications', getPublications)
analyticsRouter.get('/category-distribution', getCategoryDistribution)
analyticsRouter.get('/comment-activity', getCommentActivity)
analyticsRouter.get('/views-by-category', getViewsByCategory)
analyticsRouter.get('/top-viewed', getTopViewed)
analyticsRouter.get('/top-commented', getTopCommented)
analyticsRouter.get('/last-comments', getLastComments)
analyticsRouter.get('/export', exportCsv)
analyticsRouter.get('/drill-down', getDrillDown)

export default analyticsRouter
