import { useState, useEffect } from 'react'
import { blogApi } from '../../../api'
import toast from 'react-hot-toast'
import { MESSAGES } from '../../../constants/messages'

export function useBlog(id) {
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    async function fetchBlog() {
      try {
        setLoading(true)
        setError(null)
        const response = await blogApi.getById(id)
        
        if (response.data.success) {
          setBlog(response.data.blog)
        } else {
          setError(response.data.message)
          toast.error(response.data.message || MESSAGES.ERROR_FETCH_BLOG)
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || MESSAGES.ERROR_FETCH_BLOG
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  const refetch = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await blogApi.getById(id)
      
      if (response.data.success) {
        setBlog(response.data.blog)
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { blog, loading, error, refetch }
}

