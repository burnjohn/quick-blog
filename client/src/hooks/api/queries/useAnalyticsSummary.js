import { useApiQuery } from '../../core'
import { analyticsApi } from '../../../api'
import { MESSAGES } from '../../../constants/messages'

const defaultSummary = {
  totalViews: 0,
  totalBlogs: 0,
  publishedBlogs: 0,
  draftBlogs: 0,
  totalComments: 0,
  approvedComments: 0,
  pendingComments: 0,
  avgEngagement: 0,
  approvalRate: 0,
  mostActiveCategory: null,
  trends: { blogs: null, views: null, comments: null, approvalRate: null }
}

export function useAnalyticsSummary(filterParams) {
  const { data, loading, error, refetch } = useApiQuery(
    ({ signal }) => analyticsApi.getSummary(filterParams, { signal }),
    {
      errorMessage: MESSAGES.ERROR_FETCH_ANALYTICS,
      dependencies: [JSON.stringify(filterParams)],
      showErrorToast: false
    }
  )
  return { summary: data?.summary || defaultSummary, loading, error, refetch }
}
