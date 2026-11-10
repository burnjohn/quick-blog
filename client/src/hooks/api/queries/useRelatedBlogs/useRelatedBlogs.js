import { useState, useEffect } from 'react'
import { blogApi } from '../../../../api'

// Related posts are optional page content: failures are kept silent (no toast)
// and simply leave the list empty so the caller can hide its section.
export function useRelatedBlogs(id) {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState(null)
  // The id the current `blogs` belong to; a mismatch means a new id is still loading
  const [loadedId, setLoadedId] = useState(null)

  useEffect(() => {
    if (!id) {
      setBlogs([])
      setLoading(false)
      return undefined
    }

    let ignore = false

    async function fetchRelated() {
      setLoading(true)
      setError(null)
      try {
        const response = await blogApi.getRelated(id)
        if (ignore) return
        if (response.data.success) {
          setBlogs(response.data.blogs ?? [])
        } else {
          setBlogs([])
          setError(response.data.message ?? 'Failed to load related posts')
        }
      } catch (err) {
        if (ignore) return
        setBlogs([])
        setError(err.response?.data?.message || err.message)
      } finally {
        if (!ignore) {
          setLoadedId(id)
          setLoading(false)
        }
      }
    }

    fetchRelated()

    return () => {
      ignore = true
    }
  }, [id])

  const isStale = Boolean(id) && loadedId !== id
  return {
    blogs: isStale ? [] : blogs,
    loading: loading || isStale,
    error: isStale ? null : error,
  }
}
