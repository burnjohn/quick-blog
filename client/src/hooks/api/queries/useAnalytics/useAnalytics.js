import { useCallback } from 'react'
import { useApiQuery } from '../../../core'
import { analyticsApi } from '../../../../api/analyticsApi'
import { MESSAGES } from '../../../../constants/messages'

export function useAnalytics({ period, from, to, category } = {}) {
  const params = { period, from, to, category }
  const dependencies = [period, from, to, category]
  const sharedOptions = {
    dependencies,
    errorMessage: MESSAGES.ERROR_GENERIC
  }

  const kpisQuery = useApiQuery(() => analyticsApi.getKpis(params), sharedOptions)
  const viewsOverTimeQuery = useApiQuery(() => analyticsApi.getViewsOverTime(params), sharedOptions)
  const publicationsQuery = useApiQuery(() => analyticsApi.getPublications(params), sharedOptions)
  const categoryDistributionQuery = useApiQuery(() => analyticsApi.getCategoryDistribution(params), sharedOptions)
  const commentActivityQuery = useApiQuery(() => analyticsApi.getCommentActivity(params), sharedOptions)
  const viewsByCategoryQuery = useApiQuery(() => analyticsApi.getViewsByCategory(params), sharedOptions)
  const topViewedQuery = useApiQuery(() => analyticsApi.getTopViewed(params), sharedOptions)
  const topCommentedQuery = useApiQuery(() => analyticsApi.getTopCommented(params), sharedOptions)
  const lastCommentsQuery = useApiQuery(() => analyticsApi.getLastComments(params), sharedOptions)

  const queries = [
    kpisQuery,
    viewsOverTimeQuery,
    publicationsQuery,
    categoryDistributionQuery,
    commentActivityQuery,
    viewsByCategoryQuery,
    topViewedQuery,
    topCommentedQuery,
    lastCommentsQuery
  ]

  const loading = queries.some((q) => q.loading)
  const error = queries.find((q) => q.error)?.error || null

  const refetch = useCallback(() => {
    queries.forEach((q) => q.refetch())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  return {
    kpis: kpisQuery.data,
    viewsOverTime: viewsOverTimeQuery.data,
    publications: publicationsQuery.data,
    categoryDistribution: categoryDistributionQuery.data,
    commentActivity: commentActivityQuery.data,
    viewsByCategory: viewsByCategoryQuery.data,
    topViewed: topViewedQuery.data,
    topCommented: topCommentedQuery.data,
    lastComments: lastCommentsQuery.data,
    loading,
    error,
    refetch
  }
}
