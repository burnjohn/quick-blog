import axios from './axiosConfig'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const analyticsApi = {
  getSummary: (params, config) => axios.get(API_ENDPOINTS.ANALYTICS_SUMMARY, { params, ...config }),
  getViewsOverTime: (params, config) => axios.get(API_ENDPOINTS.ANALYTICS_VIEWS_OVER_TIME, { params, ...config }),
  getPublicationsOverTime: (params, config) => axios.get(API_ENDPOINTS.ANALYTICS_PUBLICATIONS_OVER_TIME, { params, ...config }),
  getCategoryDistribution: (params, config) => axios.get(API_ENDPOINTS.ANALYTICS_CATEGORY_DISTRIBUTION, { params, ...config }),
  getCommentActivity: (params, config) => axios.get(API_ENDPOINTS.ANALYTICS_COMMENT_ACTIVITY, { params, ...config }),
  getViewsByCategory: (params, config) => axios.get(API_ENDPOINTS.ANALYTICS_VIEWS_BY_CATEGORY, { params, ...config }),
  getTopPosts: (params, config) => axios.get(API_ENDPOINTS.ANALYTICS_TOP_POSTS, { params, ...config }),
  getRecentComments: (params, config) => axios.get(API_ENDPOINTS.ANALYTICS_RECENT_COMMENTS, { params, ...config }),
  exportCsv: (params) => axios.get(API_ENDPOINTS.ANALYTICS_EXPORT, { params, responseType: 'blob' })
}
