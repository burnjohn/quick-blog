import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'
import cors from 'cors'
import helmet from 'helmet'
import connectDB from './src/configs/db.js'
import httpLogger from './src/utils/httpLogger.js'
import { notFound, errorHandler } from './src/middleware/errorHandler.js'
import { apiLimiter } from './src/middleware/rateLimiter.js'

// Import routes
import appRouter from './src/routes/appRoutes.js'
import adminRouter from './src/routes/adminRoutes.js'
import blogRouter from './src/routes/blogRoutes.js'
import analyticsRouter from './src/routes/analyticsRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

await connectDB()

// CORS configuration - MUST come before other middlewares
const devOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175']
const prodOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : []
const allowedOrigins = [...new Set([...devOrigins, ...prodOrigins])]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log('CORS blocked origin:', origin, '| Allowed:', allowedOrigins)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Security middlewares (after CORS)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}))

// Body parsing
app.use(express.json({ limit: '10mb' }))

// Apply general rate limiting to all API routes
app.use('/api', apiLimiter)

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Disable caching in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
    next()
  })
}

app.use(httpLogger)

// Routes
app.use('/', appRouter)
app.use('/api/admin', adminRouter)
app.use('/api/admin/analytics', analyticsRouter)
app.use('/api/blog', blogRouter)

// Error handling middleware (must be last)
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT)
})

export default app
