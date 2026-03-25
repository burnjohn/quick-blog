import express from 'express'
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
  getDrillDown,
  exportCsv
} from '../controllers/analyticsController.js'

const analyticsRouter = express.Router()

analyticsRouter.get('/kpis', getKpis)
analyticsRouter.get('/views-over-time', getViewsOverTime)
analyticsRouter.get('/publications', getPublications)
analyticsRouter.get('/category-distribution', getCategoryDistribution)
analyticsRouter.get('/comment-activity', getCommentActivity)
analyticsRouter.get('/views-by-category', getViewsByCategory)
analyticsRouter.get('/top-viewed', getTopViewed)
analyticsRouter.get('/top-commented', getTopCommented)
analyticsRouter.get('/last-comments', getLastComments)
analyticsRouter.get('/drill-down', getDrillDown)
analyticsRouter.get('/export-csv', exportCsv)

export default analyticsRouter
