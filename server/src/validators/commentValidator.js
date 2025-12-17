import mongoose from 'mongoose'

// Validation constants
const MIN_NAME_LENGTH = 2
const MAX_NAME_LENGTH = 100
const MIN_COMMENT_LENGTH = 10
const MAX_COMMENT_LENGTH = 1000
const HTTP_BAD_REQUEST_STATUS = 400
const NO_ERRORS = 0

export const validateCommentInput = (req, res, next) => {
  const { blog, name, content } = req.body
  const errors = []

  // Blog ID validation
  if (!blog) {
    errors.push('Blog ID is required')
  } else if (!mongoose.Types.ObjectId.isValid(blog)) {
    errors.push('Invalid Blog ID format')
  }

  // Name validation: required, trim, 2-100 characters
  if (!name || !name.trim()) {
    errors.push('Name is required')
  } else {
    const trimmedName = name.trim()
    if (trimmedName.length < MIN_NAME_LENGTH || trimmedName.length > MAX_NAME_LENGTH) {
      errors.push(`Name must be ${MIN_NAME_LENGTH}-${MAX_NAME_LENGTH} characters`)
    }
  }

  // Comment content validation: required, trim, 10-1000 characters
  if (!content || !content.trim()) {
    errors.push('Comment is required')
  } else {
    const trimmedContent = content.trim()
    if (trimmedContent.length < MIN_COMMENT_LENGTH || trimmedContent.length > MAX_COMMENT_LENGTH) {
      errors.push(`Comment must be ${MIN_COMMENT_LENGTH}-${MAX_COMMENT_LENGTH} characters`)
    }
  }

  if (errors.length > NO_ERRORS) {
    return res.status(HTTP_BAD_REQUEST_STATUS).json({
      success: false,
      message: 'Validation failed',
      errors
    })
  }

  next()
}

export const validateCommentApproval = (req, res, next) => {
  const { id, isApproved } = req.body
  const errors = []

  if (!id) {
    errors.push('Comment ID is required')
  } else if (!mongoose.Types.ObjectId.isValid(id)) {
    errors.push('Invalid Comment ID format')
  }

  if (typeof isApproved !== 'boolean') {
    errors.push('isApproved must be a boolean value')
  }

  if (errors.length > NO_ERRORS) {
    return res.status(HTTP_BAD_REQUEST_STATUS).json({
      success: false,
      message: 'Validation failed',
      errors
    })
  }

  next()
}

export const validateCommentDelete = (req, res, next) => {
  const { id } = req.body
  const errors = []

  if (!id) {
    errors.push('Comment ID is required')
  } else if (!mongoose.Types.ObjectId.isValid(id)) {
    errors.push('Invalid Comment ID format')
  }

  if (errors.length > NO_ERRORS) {
    return res.status(HTTP_BAD_REQUEST_STATUS).json({
      success: false,
      message: 'Validation failed',
      errors
    })
  }

  next()
}

