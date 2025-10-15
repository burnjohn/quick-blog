import express from 'express'
import { healthCheck } from '../controllers/appController.js'

const appRouter = express.Router()

appRouter.get('/', healthCheck)

export default appRouter

