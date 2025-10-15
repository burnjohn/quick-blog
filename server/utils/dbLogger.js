import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Log file path
const logDir = path.join(__dirname, '../logs')
const logFile = path.join(logDir, 'db-changes.log')

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
 * Log database changes
 */
const dbLogger = {
  /**
   * Log create operation
   */
  logCreate: (collection, data) => {
    const entry = `CREATE | ${collection} | ID: ${data._id} | Data: ${JSON.stringify(data)}`
    console.log(`📝 ${entry}`)
    writeLog(entry)
  },

  /**
   * Log update operation
   */
  logUpdate: (collection, id, updates) => {
    const entry = `UPDATE | ${collection} | ID: ${id} | Updates: ${JSON.stringify(updates)}`
    console.log(`✏️  ${entry}`)
    writeLog(entry)
  },

  /**
   * Log delete operation
   */
  logDelete: (collection, id) => {
    const entry = `DELETE | ${collection} | ID: ${id}`
    console.log(`🗑️  ${entry}`)
    writeLog(entry)
  },

  /**
   * Log migration
   */
  logMigration: (migrationName, status, details = '') => {
    const entry = `MIGRATION | ${migrationName} | ${status} | ${details}`
    console.log(`🔄 ${entry}`)
    writeLog(entry)
  },

  /**
   * Log general database event
   */
  logEvent: (event, details) => {
    const entry = `EVENT | ${event} | ${details}`
    console.log(`ℹ️  ${entry}`)
    writeLog(entry)
  },

  /**
   * Log error
   */
  logError: (operation, error) => {
    const entry = `ERROR | ${operation} | ${error.message} | Stack: ${error.stack}`
    console.error(`❌ ${entry}`)
    writeLog(entry)
  }
}

export default dbLogger

