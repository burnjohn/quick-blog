import { useState } from 'react'
import { useApiQuery } from '../../../core'
import { analyticsApi } from '../../../../api'
import { MESSAGES } from '../../../../constants/messages'

// Post drill-down. `notFound` is true when the API answered 404
// so the dialog can show "Post not found" instead of a Retry error.
export function useAnalyticsPost(id, params = {}) {
  const [status, setStatus] = useState(null)
  const key = [id, params.from, params.to, params.sources].map((part) => part ?? '').join('|')

  const { data, loading, error, refetch } = useApiQuery(
    async () => {
      try {
        const response = await analyticsApi.getPost(id, {
          from: params.from,
          to: params.to,
          sources: params.sources
        })
        setStatus(null)
        return response
      } catch (err) {
        setStatus(err.response?.status ?? null)
        throw err
      }
    },
    {
      enabled: Boolean(id),
      dependencies: [key],
      showErrorToast: false,
      errorMessage: MESSAGES.ERROR_FETCH_ANALYTICS
    }
  )

  return {
    post: data?.post ?? null,
    loading,
    error,
    notFound: Boolean(error) && status === 404,
    refetch
  }
}
