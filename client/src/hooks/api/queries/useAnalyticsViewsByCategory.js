import { useAppContext } from '../../../context/AppContext'
import { useApiQuery } from '../../core'
import { analyticsApi } from '../../../api/analyticsApi'

export function useAnalyticsViewsByCategory(filterParams = {}) {
  useAppContext()
  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getViewsByCategory(filterParams),
    {
      dependencies: [filterParams.period, filterParams.from, filterParams.to, filterParams.category],
      showErrorToast: false,
      errorMessage: 'Failed to fetch views by category'
    }
  )
  return { categories: data?.categories || [], loading, error, refetch }
}
