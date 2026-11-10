import { useState } from 'react'
import { useApiQuery } from '../../../core'
import { analyticsApi } from '../../../../api'
import { MESSAGES } from '../../../../constants/messages'

const NOT_FOUND_STATUSES = [400, 404]

// Post drill-down. `notFound` is true when the API answered 400/404 for the current id
// so the dialog can show "Post not found" instead of a Retry error.
export function useAnalyticsPost(id, params = {}) {
  const [failure, setFailure] = useState({ id: null, status: null })
  const key = [id, params.from, params.to, params.sources].map((part) => part ?? '').join('|')

  const { data, loading, error, refetch } = useApiQuery(
    async () => {
      try {
        const response = await analyticsApi.getPost(id, {
          from: params.from,
          to: params.to,
          sources: params.sources
        })
        setFailure({ id: null, status: null })
        return response
      } catch (err) {
        setFailure({ id, status: err.response?.status ?? null })
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
    notFound: Boolean(error) && failure.id === id && NOT_FOUND_STATUSES.includes(failure.status),
    refetch
  }
}
