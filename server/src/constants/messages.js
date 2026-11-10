export const SUCCESS_MESSAGES = {
  BLOG_ADDED: 'Blog added successfully',
  BLOG_DELETED: 'Blog deleted successfully',
  BLOG_UPDATED: 'Blog status updated',
  COMMENT_ADDED: 'Comment added for review',
  COMMENT_APPROVED: 'Comment approved successfully',
  COMMENT_DELETED: 'Comment deleted successfully',
  LOGIN_SUCCESS: 'Login successful'
}

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  MISSING_FIELDS: 'Missing required fields',
  BLOG_NOT_FOUND: 'Blog not found',
  COMMENT_NOT_FOUND: 'Comment not found',
  UNAUTHORIZED: 'Unauthorized access',
  SERVER_ERROR: 'Internal server error',
  ANALYTICS_RANGE_INCOMPLETE: 'Both "from" and "to" are required together',
  ANALYTICS_INVALID_DATE: 'Dates must be valid and formatted as YYYY-MM-DD',
  ANALYTICS_INVALID_RANGE: '"from" must not be after "to"',
  ANALYTICS_INVALID_SOURCE: 'Unknown traffic source',
  ANALYTICS_INVALID_AUTHOR: 'Author ids must be valid ids',
  ANALYTICS_TOO_MANY_TAGS: 'Too many tags in filter',
  ANALYTICS_INVALID_POST_ID: 'Invalid post id'
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
}

