import axios from './axiosConfig'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const analyticsApi = {
  getMeta: async () => {
    return await axios.get(API_ENDPOINTS.ANALYTICS_META)
  },

  getOverview: async (params) => {
    return await axios.get(API_ENDPOINTS.ANALYTICS_OVERVIEW, { params })
  },

  getPost: async (id, params) => {
    return await axios.get(API_ENDPOINTS.ANALYTICS_POST(id), { params })
  },

  exportCsv: async (params) => {
    return await axios.get(API_ENDPOINTS.ANALYTICS_EXPORT, {
      params,
      responseType: 'blob'
    })
  }
}
