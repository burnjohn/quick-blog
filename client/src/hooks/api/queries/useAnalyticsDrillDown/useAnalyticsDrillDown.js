import { useApiQuery } from '../../../core'
import { analyticsApi } from '../../../../api/analyticsApi'
import { MESSAGES } from '../../../../constants/messages'

export function useAnalyticsDrillDown({ enabled = false, date, period, from, to, category, bucket } = {}) {
  const params = { date, period, from, to, category, bucket }

  const { data, loading, error } = useApiQuery(
    () => analyticsApi.getDrillDown(params),
    {
      enabled: enabled && Boolean(date),
      dependencies: [enabled, date, period, from, to, category, bucket],
      errorMessage: MESSAGES.ERROR_GENERIC
    }
  )

  return {
    data: enabled ? data : null,
    loading: enabled ? loading : false,
    error: enabled ? error : null
  }
}
