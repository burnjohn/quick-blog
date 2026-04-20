import mongoose from 'mongoose'

export const REFERRER_SOURCES = ['direct', 'search', 'social', 'other']

const blogViewSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  viewedAt: { type: Date, required: true, default: Date.now },
  referrerSource: { type: String, enum: REFERRER_SOURCES, default: 'direct', required: true },
  isAdminView: { type: Boolean, default: false },
  visitorKey: { type: String, required: true }
})

blogViewSchema.index({ blog: 1, visitorKey: 1, viewedAt: -1 })
blogViewSchema.index({ blog: 1, viewedAt: -1 })
blogViewSchema.index({ viewedAt: -1 })
blogViewSchema.index({ referrerSource: 1 })

const BlogView = mongoose.model('BlogView', blogViewSchema)

export default BlogView
