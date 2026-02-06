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

