import { useApiQuery } from '../../core'
import { analyticsApi } from '../../../api'
import { MESSAGES } from '../../../constants/messages'

export function useTopPosts(filterParams) {
  const { data, loading, error, refetch } = useApiQuery(
    ({ signal }) => analyticsApi.getTopPosts(filterParams, { signal }),
    {
      errorMessage: MESSAGES.ERROR_FETCH_ANALYTICS,
      dependencies: [JSON.stringify(filterParams)],
      showErrorToast: false
    }
  )
  return {
    topByViews: data?.topByViews || [],
    topByComments: data?.topByComments || [],
    loading,
    error,
    refetch
  }
}
