import { useApiQuery } from '../../core'
import { blogApi } from '../../../api'
import { MESSAGES } from '../../../constants/messages'

export function useBlogs() {
  const { data, loading, error, refetch } = useApiQuery(
    () => blogApi.getAll(),
    {
      errorMessage: MESSAGES.ERROR_FETCH_BLOGS
    }
  )

  return {
    blogs: data?.blogs || [],
    loading,
    error,
    refetch
  }
}

