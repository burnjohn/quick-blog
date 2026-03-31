import { useAppContext } from '../../../../context/AppContext'
import { useApiQuery } from '../../../core'
import { analyticsApi } from '../../../../api/analyticsApi'

export function useAnalyticsCategoryDistribution(filterParams = {}) {
  useAppContext()
  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getCategoryDistribution(filterParams),
    {
      dependencies: [filterParams.period, filterParams.from, filterParams.to, filterParams.category],
      showErrorToast: false,
      errorMessage: 'Failed to fetch category distribution'
    }
  )
  return { distribution: data?.distribution || [], loading, error, refetch }
}
