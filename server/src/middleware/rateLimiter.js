import rateLimit from 'express-rate-limit'

// Rate limiter for login attempts - stricter limits
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Rate limiter for comment submissions - prevent spam
export const commentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 comments per minute
  message: {
    success: false,
    message: 'Too many comments submitted. Please wait a moment.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Rate limiter for AI content generation - prevent abuse
export const generateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 generations per minute
  message: {
    success: false,
    message: 'Too many generation requests. Please wait a moment.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300, // 300 requests per minute (analytics dashboard uses ~9 parallel requests per interaction)
  message: {
    success: false,
    message: 'Too many requests. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false
})
