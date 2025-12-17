import axios from './axiosConfig'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const commentApi = {
  // Get comments for a specific blog
  getBlogComments: async (blogId) => {
    return await axios.get(API_ENDPOINTS.BLOG_COMMENTS(blogId))
  },

  // Submit a new comment
  submitComment: async (blogId, commentData) => {
    return await axios.post(API_ENDPOINTS.COMMENT_ADD, {
      blog: blogId,
      ...commentData
    })
  }
}
