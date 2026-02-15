import { useApiQuery } from '../../core'
import { analyticsApi } from '../../../api'
import { MESSAGES } from '../../../constants/messages'

export function useViewsByCategory(filterParams) {
  const { data, loading, error, refetch } = useApiQuery(
    ({ signal }) => analyticsApi.getViewsByCategory(filterParams, { signal }),
    {
      errorMessage: MESSAGES.ERROR_FETCH_ANALYTICS,
      dependencies: [JSON.stringify(filterParams)],
      showErrorToast: false
    }
  )
  return { data: data?.data || [], loading, error, refetch }
}
