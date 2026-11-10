import { useApiQuery } from '../../../core'
import { analyticsApi } from '../../../../api'
import { MESSAGES } from '../../../../constants/messages'

export function useAnalyticsMeta() {
  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getMeta(),
    {
      showErrorToast: false,
      errorMessage: MESSAGES.ERROR_FETCH_ANALYTICS
    }
  )

  return {
    meta: data?.meta ?? null,
    loading,
    error,
    refetch
  }
}
