import mongoose from 'mongoose'

const viewSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  sessionId: { type: String, required: true, trim: true },
  referrer: { type: String, enum: ['direct', 'search', 'social', 'other'], default: 'direct' },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true })

// Compound index for deduplication: one view per session per blog per 24h
viewSchema.index({ blog: 1, sessionId: 1, createdAt: 1 })

// Index for analytics queries: views per blog over time
viewSchema.index({ blog: 1, createdAt: 1 })

// Index for time-range queries
viewSchema.index({ createdAt: 1 })

const View = mongoose.model('View', viewSchema)

export default View
