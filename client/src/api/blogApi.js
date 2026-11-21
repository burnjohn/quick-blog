import axios from './axiosConfig'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const blogApi = {
  // Get all blogs
  getAll: async () => {
    return await axios.get(API_ENDPOINTS.BLOGS_ALL)
  },

  // Most-read published posts ({ limit, days } — server falls back to all-time)
  getPopular: async (params = {}) => {
    return await axios.get(API_ENDPOINTS.BLOGS_POPULAR, { params })
  },

  // Get blog by ID
  getById: async (id) => {
    return await axios.get(API_ENDPOINTS.BLOG_BY_ID(id))
  },

  // Create new blog
  create: async (formData) => {
    return await axios.post(API_ENDPOINTS.BLOG_CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Update blog
  update: async (id, formData) => {
    return await axios.put(API_ENDPOINTS.BLOG_UPDATE(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Delete blog
  delete: async (id) => {
    return await axios.delete(API_ENDPOINTS.BLOG_DELETE(id))
  }
}

