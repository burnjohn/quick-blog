import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subTitle: { type: String },
  description: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true }, // Denormalized for performance
  image: { type: String, required: true },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true })

const Blog = mongoose.model('Blog', blogSchema)

export default Blog
