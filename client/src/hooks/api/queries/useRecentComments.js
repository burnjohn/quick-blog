import { useApiQuery } from '../../core'
import { analyticsApi } from '../../../api'
import { MESSAGES } from '../../../constants/messages'

export function useRecentComments(filterParams) {
  const { data, loading, error, refetch } = useApiQuery(
    ({ signal }) => analyticsApi.getRecentComments(filterParams, { signal }),
    {
      errorMessage: MESSAGES.ERROR_FETCH_ANALYTICS,
      dependencies: [JSON.stringify(filterParams)],
      showErrorToast: false
    }
  )
  return { comments: data?.comments || [], loading, error, refetch }
}
