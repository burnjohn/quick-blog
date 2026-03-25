import mongoose from 'mongoose'

const blogViewSchema = new mongoose.Schema({
  blog:           { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  viewedAt:       { type: Date, default: Date.now },
  referrerSource: { type: String, enum: ['direct', 'search', 'social', 'other'], default: 'direct' },
  isAdminView:    { type: Boolean, default: false },
  visitorKey:     { type: String, required: true }
}, { timestamps: true })

blogViewSchema.index({ blog: 1, visitorKey: 1, viewedAt: 1 })
blogViewSchema.index({ blog: 1, viewedAt: 1 })
blogViewSchema.index({ viewedAt: 1 })

export default mongoose.model('BlogView', blogViewSchema)
