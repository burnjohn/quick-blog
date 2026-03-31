import { useAppContext } from '../../../../context/AppContext'
import { useApiQuery } from '../../../core'
import { analyticsApi } from '../../../../api/analyticsApi'

export function useAnalyticsKpis(filterParams = {}) {
  useAppContext()
  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getKpis(filterParams),
    {
      dependencies: [filterParams.period, filterParams.from, filterParams.to, filterParams.category],
      showErrorToast: false,
      errorMessage: 'Failed to fetch KPIs'
    }
  )
  return { kpis: data?.kpis || {}, trends: data?.trends || {}, loading, error, refetch }
}
