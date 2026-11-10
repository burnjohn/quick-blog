import { useApiQuery } from '../../../core'
import { analyticsApi } from '../../../../api'
import { MESSAGES } from '../../../../constants/messages'

// `key` is the serialized request identity (from|to|tags|authors|sources);
// it is the only dependency, so sort/compare/post changes never refetch.
export function useAnalyticsOverview(params, key, { enabled = true } = {}) {
  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getOverview(params),
    {
      enabled,
      dependencies: [key],
      showErrorToast: false,
      errorMessage: MESSAGES.ERROR_FETCH_ANALYTICS
    }
  )

  return {
    overview: data?.overview ?? null,
    loading,
    error,
    refetch
  }
}
