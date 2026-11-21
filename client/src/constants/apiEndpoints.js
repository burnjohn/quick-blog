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

  // Analytics endpoints
  ANALYTICS_KPIS: '/api/admin/analytics/kpis',
  ANALYTICS_VIEWS_OVER_TIME: '/api/admin/analytics/views-over-time',
  ANALYTICS_PUBLICATIONS: '/api/admin/analytics/publications',
  ANALYTICS_CATEGORY_DIST: '/api/admin/analytics/category-distribution',
  ANALYTICS_COMMENT_ACTIVITY: '/api/admin/analytics/comment-activity',
  ANALYTICS_VIEWS_BY_CATEGORY: '/api/admin/analytics/views-by-category',
  ANALYTICS_TOP_VIEWED: '/api/admin/analytics/top-viewed',
  ANALYTICS_TOP_COMMENTED: '/api/admin/analytics/top-commented',
  ANALYTICS_LAST_COMMENTS: '/api/admin/analytics/last-comments',
  ANALYTICS_EXPORT_CSV: '/api/admin/analytics/export-csv',
  ANALYTICS_DRILL_DOWN: '/api/admin/analytics/drill-down',
  RECORD_VIEW: (blogId) => `/api/blog/${blogId}/view`
}

