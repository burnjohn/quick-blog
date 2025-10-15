import axios from './axiosConfig'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const adminApi = {
  // Admin login
  login: async (credentials) => {
    return await axios.post(API_ENDPOINTS.ADMIN_LOGIN, credentials)
  },

  // Get dashboard stats
  getStats: async () => {
    return await axios.get(API_ENDPOINTS.ADMIN_STATS)
  },

  // Get all blogs (admin view)
  getBlogs: async () => {
    return await axios.get(API_ENDPOINTS.ADMIN_BLOGS)
  },

  // Get all comments (admin view)
  getComments: async () => {
    return await axios.get(API_ENDPOINTS.ADMIN_COMMENTS)
  }
}

