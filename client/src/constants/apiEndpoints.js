export const API_ENDPOINTS = {
  // Blog endpoints
  BLOGS_ALL: '/api/blog/all',
  BLOG_BY_ID: (id) => `/api/blog/${id}`,
  BLOG_CREATE: '/api/blog',
  BLOG_UPDATE: (id) => `/api/blog/${id}`,
  BLOG_DELETE: (id) => `/api/blog/${id}`,
  
  // Comment endpoints
  COMMENTS_BY_BLOG: '/api/blog/comments',
  COMMENT_ADD: '/api/blog/add-comment',
  COMMENT_DELETE: (id) => `/api/comment/${id}`,
  COMMENT_APPROVE: (id) => `/api/comment/approve/${id}`,
  
  // Admin endpoints
  ADMIN_LOGIN: '/api/admin/login',
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_BLOGS: '/api/admin/blogs',
  ADMIN_COMMENTS: '/api/admin/comments',

  // Admin analytics endpoints
  ANALYTICS_META: '/api/admin/analytics/meta',
  ANALYTICS_OVERVIEW: '/api/admin/analytics/overview',
  ANALYTICS_POST: (id) => `/api/admin/analytics/posts/${id}`,
  ANALYTICS_EXPORT: '/api/admin/analytics/export',
}

