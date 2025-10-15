import mongoose from 'mongoose'
import dbLogger from '../utils/dbLogger.js'

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ Database Connected Successfully')
      dbLogger.logEvent('DATABASE_CONNECTED', `Connected to: ${process.env.MONGODB_URI.split('@')[1] || 'local'}`)
    })

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
      dbLogger.logError('DATABASE_CONNECTION', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected')
      dbLogger.logEvent('DATABASE_DISCONNECTED', 'Database connection closed')
    })

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    })

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:')
    console.error('Error:', error.message)
    dbLogger.logError('DATABASE_CONNECTION_FAILED', error)
    process.exit(1) // Exit if DB connection fails
  }
}

export default connectDB