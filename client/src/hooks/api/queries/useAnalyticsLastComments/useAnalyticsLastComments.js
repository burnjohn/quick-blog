import { useAppContext } from '../../../../context/AppContext'
import { useApiQuery } from '../../../core'
import { analyticsApi } from '../../../../api/analyticsApi'

export function useAnalyticsLastComments(filterParams = {}) {
  useAppContext()
  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getLastComments(filterParams),
    {
      dependencies: [filterParams.period, filterParams.from, filterParams.to, filterParams.category],
      showErrorToast: false,
      errorMessage: 'Failed to fetch last comments'
    }
  )
  return { comments: data?.comments || [], loading, error, refetch }
}
