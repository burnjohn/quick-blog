import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import helmet from 'helmet'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import appRouter from './routes/appRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import blogRouter from './routes/blogRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, contentSecurityPolicy: false }))
app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/', appRouter)
app.use('/api/admin', adminRouter)
app.use('/api/blog', blogRouter)

app.use(notFound)
app.use(errorHandler)

export default app
