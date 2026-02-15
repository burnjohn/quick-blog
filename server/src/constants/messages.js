export const SUCCESS_MESSAGES = {
  BLOG_ADDED: 'Blog added successfully',
  BLOG_DELETED: 'Blog deleted successfully',
  BLOG_UPDATED: 'Blog status updated',
  COMMENT_ADDED: 'Comment added for review',
  COMMENT_APPROVED: 'Comment approved successfully',
  COMMENT_DELETED: 'Comment deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  VIEW_TRACKED: 'View tracked successfully',
  VIEW_ALREADY_RECORDED: 'View already recorded'
}

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  MISSING_FIELDS: 'Missing required fields',
  BLOG_NOT_FOUND: 'Blog not found',
  COMMENT_NOT_FOUND: 'Comment not found',
  UNAUTHORIZED: 'Unauthorized access',
  SERVER_ERROR: 'Internal server error',
  VIEW_TRACK_REQUIRED: 'blogId and sessionId are required',
  VIEW_INVALID_BLOG_ID: 'blogId must be a valid ID',
  VIEW_SESSION_TOO_LONG: 'sessionId must be 128 characters or fewer',
  INVALID_DATE_PARAM: 'Invalid date parameter',
  INVALID_DATE_RANGE: 'startDate must be before or equal to endDate',
  TOO_MANY_VIEW_TRACKS: 'Too many view tracking requests. Please slow down.'
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

export const BLOG_CATEGORIES = ['Technology', 'Startup', 'Lifestyle', 'Finance']

export const CSV_EXPORT_LIMIT = 10000

