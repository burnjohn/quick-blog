import { useApiQuery } from '../../core'
import { commentApi } from '../../../api'

export const useBlogComments = (blogId) => {
  const { data, loading, error, refetch } = useApiQuery(
    blogId ? () => commentApi.getBlogComments(blogId) : null,
    { 
      enabled: !!blogId,
      dependencies: [blogId]
    }
  )

  return {
    comments: data?.comments || [],
    count: data?.count || 0,
    loading,
    error,
    refetch
  }
}

