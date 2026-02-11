import express from 'express'
import {
  validateAnalyticsQuery,
  validateDrillDownQuery
} from '../validators/analyticsValidator.js'
import {
  getKpis,
  getViewsOverTime,
  getPublicationsOverTime,
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

analyticsRouter.get('/kpis', validateAnalyticsQuery, getKpis)
analyticsRouter.get('/views-over-time', validateAnalyticsQuery, getViewsOverTime)
analyticsRouter.get('/publications', validateAnalyticsQuery, getPublicationsOverTime)
analyticsRouter.get(
  '/category-distribution',
  validateAnalyticsQuery,
  getCategoryDistribution
)
analyticsRouter.get(
  '/comment-activity',
  validateAnalyticsQuery,
  getCommentActivity
)
analyticsRouter.get(
  '/views-by-category',
  validateAnalyticsQuery,
  getViewsByCategory
)
analyticsRouter.get('/top-viewed', validateAnalyticsQuery, getTopViewed)
analyticsRouter.get('/top-commented', validateAnalyticsQuery, getTopCommented)
analyticsRouter.get('/last-comments', validateAnalyticsQuery, getLastComments)
analyticsRouter.get('/export-csv', validateAnalyticsQuery, exportCsv)
analyticsRouter.get(
  '/drill-down',
  validateAnalyticsQuery,
  validateDrillDownQuery,
  getDrillDown
)

export default analyticsRouter
