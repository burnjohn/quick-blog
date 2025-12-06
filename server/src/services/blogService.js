import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'

export class BlogService {
  static async createBlog(blogData, imageUrl) {
    return await Blog.create({ ...blogData, image: imageUrl })
  }

  static async getPublishedBlogs() {
    return await Blog.find({ isPublished: true })
  }

  static async getBlogById(blogId) {
    return await Blog.findById(blogId)
  }

  static async deleteBlog(blogId) {
    await Blog.findByIdAndDelete(blogId)
    await Comment.deleteMany({ blog: blogId })
  }

  static async toggleBlogPublish(blogId) {
    const blog = await Blog.findById(blogId)
    if (!blog) throw new Error('Blog not found')
    
    blog.isPublished = !blog.isPublished
    await blog.save()
    return blog
  }
}
