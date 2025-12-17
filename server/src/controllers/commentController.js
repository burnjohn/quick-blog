import Comment from '../models/Comment.js'
import Blog from '../models/Blog.js'

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body

    // Verify blog exists
    const blogExists = await Blog.findById(blog)
    if (!blogExists) {
      return res.json({ success: false, message: 'Blog not found' })
    }

    // Create comment
    const comment = await Comment.create({
      blog,
      name: name.trim(),
      content: content.trim(),
      isApproved: false
    })

    res.json({
      success: true,
      message: 'Comment submitted successfully. It will be reviewed before being published.',
      comment
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const getAllCommentsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1

    // Validate sortBy field
    const allowedSortFields = ['createdAt', 'blog']
    if (!allowedSortFields.includes(sortBy)) {
      return res.json({
        success: false,
        message: 'Invalid sortBy field. Allowed: createdAt, blog'
      })
    }

    // Build sort object
    const sort = {}
    if (sortBy === 'blog') {
      // Sort by blog title requires population
      sort['blog.title'] = sortOrder
    } else {
      sort[sortBy] = sortOrder
    }

    // Calculate skip
    const skip = (page - 1) * limit

    // Get total count
    const totalCount = await Comment.countDocuments()

    let comments

    // If sorting by blog, we need to sort after population
    if (sortBy === 'blog') {
      // Fetch all comments, populate, sort in memory, then paginate
      const allComments = await Comment.find()
        .populate('blog', 'title')
        .lean()
      
      allComments.sort((a, b) => {
        const titleA = a.blog?.title || ''
        const titleB = b.blog?.title || ''
        return sortOrder === 1
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA)
      })
      
      // Apply pagination after sorting
      comments = allComments.slice(skip, skip + limit)
    } else {
      // For createdAt sorting, MongoDB can handle it efficiently
      comments = await Comment.find()
        .populate('blog', 'title')
        .sort(sort)
        .skip(skip)
        .limit(limit)
    }

    const totalPages = Math.ceil(totalCount / limit)

    res.json({
      success: true,
      comments,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const approveComment = async (req, res) => {
  try {
    const { id, isApproved } = req.body

    const comment = await Comment.findById(id)
    if (!comment) {
      return res.json({ success: false, message: 'Comment not found' })
    }

    comment.isApproved = isApproved
    await comment.save()

    res.json({
      success: true,
      message: `Comment ${isApproved ? 'approved' : 'unapproved'} successfully`,
      comment
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.body

    const comment = await Comment.findByIdAndDelete(id)
    if (!comment) {
      return res.json({ success: false, message: 'Comment not found' })
    }

    res.json({ success: true, message: 'Comment deleted successfully' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params

    // Verify blog exists
    const blogExists = await Blog.findById(blogId)
    if (!blogExists) {
      return res.json({ success: false, message: 'Blog not found' })
    }

    // Get approved comments for this blog, sorted by newest first
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true
    })
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      comments,
      count: comments.length
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

