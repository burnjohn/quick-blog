import axios from './axiosConfig'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const analyticsApi = {
  getKpis: (params) => axios.get(API_ENDPOINTS.ANALYTICS_KPIS, { params }),
  getViewsOverTime: (params) => axios.get(API_ENDPOINTS.ANALYTICS_VIEWS_OVER_TIME, { params }),
  getPublications: (params) => axios.get(API_ENDPOINTS.ANALYTICS_PUBLICATIONS, { params }),
  getCategoryDistribution: (params) => axios.get(API_ENDPOINTS.ANALYTICS_CATEGORY_DISTRIBUTION, { params }),
  getCommentActivity: (params) => axios.get(API_ENDPOINTS.ANALYTICS_COMMENT_ACTIVITY, { params }),
  getViewsByCategory: (params) => axios.get(API_ENDPOINTS.ANALYTICS_VIEWS_BY_CATEGORY, { params }),
  getTopViewed: (params) => axios.get(API_ENDPOINTS.ANALYTICS_TOP_VIEWED, { params }),
  getTopCommented: (params) => axios.get(API_ENDPOINTS.ANALYTICS_TOP_COMMENTED, { params }),
  getLastComments: (params) => axios.get(API_ENDPOINTS.ANALYTICS_LAST_COMMENTS, { params }),
  getDrillDown: (params) => axios.get(API_ENDPOINTS.ANALYTICS_DRILL_DOWN, { params }),
  exportCsv: (params) => axios.get(API_ENDPOINTS.ANALYTICS_EXPORT_CSV, { params, responseType: 'blob' }),
  trackView: (blogId, data) => axios.post(API_ENDPOINTS.BLOG_TRACK_VIEW(blogId), data),
}
