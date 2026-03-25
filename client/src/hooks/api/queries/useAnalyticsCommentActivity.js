import { useAppContext } from '../../../context/AppContext'
import { useApiQuery } from '../../core'
import { analyticsApi } from '../../../api/analyticsApi'

export function useAnalyticsCommentActivity(filterParams = {}) {
  useAppContext()
  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getCommentActivity(filterParams),
    {
      dependencies: [filterParams.period, filterParams.from, filterParams.to, filterParams.category],
      showErrorToast: false,
      errorMessage: 'Failed to fetch comment activity'
    }
  )
  return { series: data?.series || [], loading, error, refetch }
}
