import axios from './axiosConfig'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

const buildParams = (params = {}) => {
  const { period, from, to, category } = params
  const queryParams = {}
  if (period != null) queryParams.period = period
  if (from) queryParams.from = from
  if (to) queryParams.to = to
  if (category && category !== 'All') queryParams.category = category
  return queryParams
}

export const analyticsApi = {
  getKpis: async (params = {}) => {
    return await axios.get(API_ENDPOINTS.ANALYTICS_KPIS, {
      params: buildParams(params)
    })
  },

  getViewsOverTime: async (params = {}) => {
    return await axios.get(API_ENDPOINTS.ANALYTICS_VIEWS_OVER_TIME, {
      params: buildParams(params)
    })
  },

  getPublicationsOverTime: async (params = {}) => {
    return await axios.get(API_ENDPOINTS.ANALYTICS_PUBLICATIONS, {
      params: buildParams(params)
    })
  },

  getCategoryDistribution: async (params = {}) => {
    return await axios.get(API_ENDPOINTS.ANALYTICS_CATEGORY_DIST, {
      params: buildParams(params)
    })
  },

  getCommentActivity: async (params = {}) => {
    return await axios.get(API_ENDPOINTS.ANALYTICS_COMMENT_ACTIVITY, {
      params: buildParams(params)
    })
  },

  getViewsByCategory: async (params = {}) => {
    return await axios.get(API_ENDPOINTS.ANALYTICS_VIEWS_BY_CATEGORY, {
      params: buildParams(params)
    })
  },

  getTopViewed: async (params = {}) => {
    return await axios.get(API_ENDPOINTS.ANALYTICS_TOP_VIEWED, {
      params: buildParams(params)
    })
  },

  getTopCommented: async (params = {}) => {
    return await axios.get(API_ENDPOINTS.ANALYTICS_TOP_COMMENTED, {
      params: buildParams(params)
    })
  },

  getLastComments: async (params = {}) => {
    return await axios.get(API_ENDPOINTS.ANALYTICS_LAST_COMMENTS, {
      params: buildParams(params)
    })
  },

  getDrillDown: async (date, params = {}) => {
    return await axios.get(API_ENDPOINTS.ANALYTICS_DRILL_DOWN, {
      params: { ...buildParams(params), date }
    })
  },

  exportCsv: async (params = {}) => {
    return await axios.get(API_ENDPOINTS.ANALYTICS_EXPORT_CSV, {
      params: buildParams(params),
      responseType: 'blob'
    })
  }
}
