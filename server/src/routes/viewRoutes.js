import express from 'express'
import { trackView } from '../controllers/viewController.js'
import { viewTrackLimiter } from '../middleware/rateLimiter.js'

const viewRouter = express.Router()

// Public endpoint — no auth required
viewRouter.post('/track', viewTrackLimiter, trackView)

export default viewRouter
