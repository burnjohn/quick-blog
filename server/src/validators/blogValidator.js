export const validateBlogInput = (req, res, next) => {
  const { title, description, category } = req.body.blog ? JSON.parse(req.body.blog) : {}
  const errors = []

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters')
  }
  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters')
  }
  if (!category) {
    errors.push('Category is required')
  }
  if (!req.file) {
    errors.push('Image is required')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    })
  }

  next()
}

export const validateComment = (req, res, next) => {
  const { blog, name, content } = req.body
  const errors = []

  if (!blog) errors.push('Blog ID is required')
  if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters')
  if (!content || content.trim().length < 5) errors.push('Content must be at least 5 characters')

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    })
  }

  next()
}

