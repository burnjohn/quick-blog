import axios from './axiosConfig'

const ANALYTICS_BASE = '/api/admin/analytics'

const ANALYTICS_ENDPOINTS = {
  KPIS: `${ANALYTICS_BASE}/kpis`,
  VIEWS_OVER_TIME: `${ANALYTICS_BASE}/views-over-time`,
  PUBLICATIONS: `${ANALYTICS_BASE}/publications`,
  CATEGORY_DISTRIBUTION: `${ANALYTICS_BASE}/category-distribution`,
  COMMENT_ACTIVITY: `${ANALYTICS_BASE}/comment-activity`,
  VIEWS_BY_CATEGORY: `${ANALYTICS_BASE}/views-by-category`,
  TOP_VIEWED: `${ANALYTICS_BASE}/top-viewed`,
  TOP_COMMENTED: `${ANALYTICS_BASE}/top-commented`,
  LAST_COMMENTS: `${ANALYTICS_BASE}/last-comments`,
  DRILL_DOWN: `${ANALYTICS_BASE}/drill-down`,
  EXPORT: `${ANALYTICS_BASE}/export`,
  RECORD_VIEW: (blogId) => `/api/blog/${blogId}/view`
}

export const analyticsApi = {
  getKpis: async (params) => {
    return await axios.get(ANALYTICS_ENDPOINTS.KPIS, { params })
  },

  getViewsOverTime: async (params) => {
    return await axios.get(ANALYTICS_ENDPOINTS.VIEWS_OVER_TIME, { params })
  },

  getPublications: async (params) => {
    return await axios.get(ANALYTICS_ENDPOINTS.PUBLICATIONS, { params })
  },

  getCategoryDistribution: async (params) => {
    return await axios.get(ANALYTICS_ENDPOINTS.CATEGORY_DISTRIBUTION, { params })
  },

  getCommentActivity: async (params) => {
    return await axios.get(ANALYTICS_ENDPOINTS.COMMENT_ACTIVITY, { params })
  },

  getViewsByCategory: async (params) => {
    return await axios.get(ANALYTICS_ENDPOINTS.VIEWS_BY_CATEGORY, { params })
  },

  getTopViewed: async (params) => {
    return await axios.get(ANALYTICS_ENDPOINTS.TOP_VIEWED, { params })
  },

  getTopCommented: async (params) => {
    return await axios.get(ANALYTICS_ENDPOINTS.TOP_COMMENTED, { params })
  },

  getLastComments: async (params) => {
    return await axios.get(ANALYTICS_ENDPOINTS.LAST_COMMENTS, { params })
  },

  getDrillDown: async (params) => {
    return await axios.get(ANALYTICS_ENDPOINTS.DRILL_DOWN, { params })
  },

  recordView: async (blogId, data) => {
    return await axios.post(ANALYTICS_ENDPOINTS.RECORD_VIEW(blogId), data || {})
  },

  exportCsv: async (params) => {
    return await axios.get(ANALYTICS_ENDPOINTS.EXPORT, {
      params,
      responseType: 'blob'
    })
  }
}
