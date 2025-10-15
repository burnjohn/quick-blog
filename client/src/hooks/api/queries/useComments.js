import { useState, useEffect } from 'react'
import { commentApi } from '../../../api'
import toast from 'react-hot-toast'
import { MESSAGES } from '../../../constants/messages'

export function useComments(blogId) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchComments = async () => {
    if (!blogId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await commentApi.getByBlogId(blogId)
      
      if (response.data.success) {
        setComments(response.data.comments)
      } else {
        setError(response.data.message)
        toast.error(response.data.message || MESSAGES.ERROR_FETCH_COMMENTS)
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || MESSAGES.ERROR_FETCH_COMMENTS
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId])

  const addComment = async (commentData) => {
    try {
      const response = await commentApi.add(commentData)
      
      if (response.data.success) {
        toast.success(response.data.message || MESSAGES.SUCCESS_COMMENT_ADDED)
        await fetchComments()
        return { success: true }
      } else {
        toast.error(response.data.message || MESSAGES.ERROR_ADD_COMMENT)
        return { success: false, message: response.data.message }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || MESSAGES.ERROR_ADD_COMMENT
      toast.error(errorMessage)
      return { success: false, message: errorMessage }
    }
  }

  return { comments, loading, error, addComment, refetch: fetchComments }
}

