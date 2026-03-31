import { useAppContext } from '../../../../context/AppContext'
import { useApiQuery } from '../../../core'
import { analyticsApi } from '../../../../api/analyticsApi'

export function useAnalyticsPublications(filterParams = {}) {
  useAppContext()
  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getPublications(filterParams),
    {
      dependencies: [filterParams.period, filterParams.from, filterParams.to, filterParams.category],
      showErrorToast: false,
      errorMessage: 'Failed to fetch publications'
    }
  )
  return { series: data?.series || [], loading, error, refetch }
}
