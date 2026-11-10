import express from 'express'
import auth from '../middleware/auth.js'
import { validateAnalyticsQuery, validatePostId } from '../validators/analyticsValidator.js'
import {
  getAnalyticsMeta, getAnalyticsOverview, getAnalyticsPost, exportAnalyticsCsv
} from '../controllers/analyticsController.js'

const analyticsRouter = express.Router()

analyticsRouter.use(auth)

analyticsRouter.get('/meta', getAnalyticsMeta)
analyticsRouter.get('/overview', validateAnalyticsQuery, getAnalyticsOverview)
analyticsRouter.get('/posts/:id', validatePostId, validateAnalyticsQuery, getAnalyticsPost)
analyticsRouter.get('/export', validateAnalyticsQuery, exportAnalyticsCsv)

export default analyticsRouter
