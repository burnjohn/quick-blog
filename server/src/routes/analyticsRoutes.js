import express from 'express'
import auth from '../middleware/auth.js'
import { validateAnalyticsQuery, validateDrillDownQuery } from '../validators/analyticsValidator.js'
import {
  getKpis,
  getViewsOverTime,
  getPublicationsOverTime,
  getCategoryDistribution,
  getCommentActivity,
  getViewsByCategory,
  getTopViewedPosts,
  getTopCommentedPosts,
  getLastComments,
  getDrillDownPosts,
  exportCsv
} from '../controllers/analyticsController.js'

const analyticsRouter = express.Router()
analyticsRouter.use(auth)
analyticsRouter.use(validateAnalyticsQuery)

analyticsRouter.get('/kpis', getKpis)
analyticsRouter.get('/charts/views-over-time', getViewsOverTime)
analyticsRouter.get('/charts/publications-over-time', getPublicationsOverTime)
analyticsRouter.get('/charts/category-distribution', getCategoryDistribution)
analyticsRouter.get('/charts/comment-activity', getCommentActivity)
analyticsRouter.get('/charts/views-by-category', getViewsByCategory)
analyticsRouter.get('/tables/top-viewed', getTopViewedPosts)
analyticsRouter.get('/tables/top-commented', getTopCommentedPosts)
analyticsRouter.get('/tables/last-comments', getLastComments)
analyticsRouter.get('/tables/drill-down', validateDrillDownQuery, getDrillDownPosts)
analyticsRouter.get('/export/csv', exportCsv)

export default analyticsRouter
