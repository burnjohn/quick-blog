import mongoose from 'mongoose'

const referrerSourceEnum = ['direct', 'search', 'social', 'other']

const blogViewSchema = new mongoose.Schema({
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  viewedAt: {
    type: Date,
    default: () => new Date()
  },
  referrerSource: {
    type: String,
    enum: referrerSourceEnum,
    default: 'direct'
  },
  isAdminView: {
    type: Boolean,
    default: false
  },
  visitorKey: {
    type: String,
    required: true
  }
}, { timestamps: true })

blogViewSchema.index({ blog: 1, visitorKey: 1, viewedAt: 1 })
blogViewSchema.index({ blog: 1, viewedAt: 1 })
blogViewSchema.index({ viewedAt: 1 })

const BlogView = mongoose.model('BlogView', blogViewSchema)

export default BlogView
