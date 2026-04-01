import { useAppContext } from '../../../../context/AppContext'
import { useApiQuery } from '../../../core'
import { analyticsApi } from '../../../../api/analyticsApi'

export function useAnalyticsViewsOverTime(filterParams = {}) {
  useAppContext()
  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getViewsOverTime(filterParams),
    {
      dependencies: [filterParams.period, filterParams.from, filterParams.to, filterParams.category],
      showErrorToast: false,
      errorMessage: 'Failed to fetch views over time'
    }
  )
  return { series: data?.series || [], bucketSize: data?.bucketSize || 'day', loading, error, refetch }
}
