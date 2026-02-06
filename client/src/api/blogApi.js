import axios from './axiosConfig'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const blogApi = {
  // Get all blogs
  getAll: async () => {
    return await axios.get(API_ENDPOINTS.BLOGS_ALL)
  },

  // Get blog by ID
  getById: async (id) => {
    return await axios.get(API_ENDPOINTS.BLOG_BY_ID(id))
  },

  // Delete blog
  delete: async (id) => {
    return await axios.delete(API_ENDPOINTS.BLOG_DELETE(id))
  }
}

