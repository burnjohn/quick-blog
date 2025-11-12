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

