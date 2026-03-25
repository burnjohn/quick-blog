import { useAppContext } from '../../../context/AppContext'
import { useApiQuery } from '../../core'
import { analyticsApi } from '../../../api/analyticsApi'

export function useAnalyticsTopViewed(filterParams = {}) {
  useAppContext()
  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getTopViewed(filterParams),
    {
      dependencies: [filterParams.period, filterParams.from, filterParams.to, filterParams.category],
      showErrorToast: false,
      errorMessage: 'Failed to fetch top viewed blogs'
    }
  )
  return { blogs: data?.blogs || [], loading, error, refetch }
}
