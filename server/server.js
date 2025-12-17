import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './src/configs/db.js'
import httpLogger from './src/utils/httpLogger.js'
import { notFound, errorHandler } from './src/middleware/errorHandler.js'

// Import routes
import appRouter from './src/routes/appRoutes.js'
import adminRouter from './src/routes/adminRoutes.js'
import blogRouter from './src/routes/blogRoutes.js'
import commentRouter from './src/routes/commentRoutes.js'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();

await connectDB()

// Middlewares
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ['http://localhost:5173']
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

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
app.use('/api/blog', blogRouter)
app.use('/api/comment', commentRouter)

// Error handling middleware (must be last)
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log('Server is running on port ' + PORT)
})

export default app;