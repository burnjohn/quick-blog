import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Log file path (root level logs directory)
const logDir = path.join(__dirname, '../../logs')
const logFile = path.join(logDir, 'http.log')

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

/**
 * Format timestamp for logs
 */
const getTimestamp = () => {
  return new Date().toISOString()
}

/**
 * Write log entry to file
 */
const writeLog = (entry) => {
  const logEntry = `${getTimestamp()} | ${entry}\n`
  fs.appendFileSync(logFile, logEntry)
}

/**
 * Get color for status code
 */
const getStatusEmoji = (statusCode) => {
  if (statusCode >= 500) return '❌'
  if (statusCode >= 400) return '⚠️ '
  if (statusCode >= 300) return '🔄'
  if (statusCode >= 200) return '✅'
  return 'ℹ️ '
}

/**
 * HTTP request/response logging middleware
 */
const httpLogger = (req, res, next) => {
  const startTime = Date.now()
  
  // Log request
  const requestInfo = `${req.method} ${req.originalUrl} | IP: ${req.ip} | User-Agent: ${req.get('user-agent') || 'N/A'}`
  console.log(`📥 REQUEST  | ${requestInfo}`)
  writeLog(`REQUEST  | ${requestInfo}`)

  // Log request body if present (excluding sensitive data)
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body }
    if (sanitizedBody.password) sanitizedBody.password = '***'
    if (sanitizedBody.token) sanitizedBody.token = '***'
    
    const bodyInfo = `Body: ${JSON.stringify(sanitizedBody)}`
    console.log(`   ↳ ${bodyInfo}`)
    writeLog(`         | ${bodyInfo}`)
  }

  // Capture response
  const originalSend = res.send
  res.send = function(data) {
    const duration = Date.now() - startTime
    const emoji = getStatusEmoji(res.statusCode)
    
    let responseInfo = `${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms`
    
    // Parse response data to show metadata
    try {
      const jsonData = typeof data === 'string' ? JSON.parse(data) : data
      if (jsonData && typeof jsonData === 'object') {
        const metadata = []
        if (jsonData.count !== undefined) metadata.push(`count: ${jsonData.count}`)
        if (jsonData.success !== undefined) metadata.push(`success: ${jsonData.success}`)
        
        if (metadata.length > 0) {
          responseInfo += ` | ${metadata.join(', ')}`
        }
      }
    } catch (e) {
      // Not JSON, skip metadata
    }
    
    console.log(`${emoji} RESPONSE | ${responseInfo}`)
    writeLog(`RESPONSE | ${responseInfo}`)
    
    return originalSend.call(this, data)
  }
  
  next()
}

export default httpLogger

