import { useApiQuery } from '../../core'
import { MESSAGES } from '../../../constants/messages'
import { analyticsApi } from '../../../api/analyticsApi'

export function useAnalyticsKpis(params = {}) {
  const { period, from, to, category } = params
  const queryParams = { period, from, to, category }

  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getKpis(queryParams),
    {
      errorMessage: MESSAGES.ERROR_GENERIC,
      dependencies: [period, from, to, category]
    }
  )

  return {
    data: data?.kpis ?? null,
    loading,
    error,
    refetch
  }
}

export function useViewsOverTime(params = {}) {
  const { period, from, to, category } = params
  const queryParams = { period, from, to, category }

  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getViewsOverTime(queryParams),
    {
      errorMessage: MESSAGES.ERROR_GENERIC,
      dependencies: [period, from, to, category]
    }
  )

  return {
    data: data?.data ?? [],
    loading,
    error,
    refetch
  }
}

export function usePublicationsOverTime(params = {}) {
  const { period, from, to, category } = params
  const queryParams = { period, from, to, category }

  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getPublicationsOverTime(queryParams),
    {
      errorMessage: MESSAGES.ERROR_GENERIC,
      dependencies: [period, from, to, category]
    }
  )

  return {
    data: data?.data ?? [],
    loading,
    error,
    refetch
  }
}

export function useCategoryDistribution(params = {}) {
  const { period, from, to, category } = params
  const queryParams = { period, from, to, category }

  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getCategoryDistribution(queryParams),
    {
      errorMessage: MESSAGES.ERROR_GENERIC,
      dependencies: [period, from, to, category]
    }
  )

  return {
    data: data?.data ?? [],
    loading,
    error,
    refetch
  }
}

export function useCommentActivity(params = {}) {
  const { period, from, to, category } = params
  const queryParams = { period, from, to, category }

  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getCommentActivity(queryParams),
    {
      errorMessage: MESSAGES.ERROR_GENERIC,
      dependencies: [period, from, to, category]
    }
  )

  return {
    data: data?.data ?? [],
    loading,
    error,
    refetch
  }
}

export function useViewsByCategory(params = {}) {
  const { period, from, to, category } = params
  const queryParams = { period, from, to, category }

  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getViewsByCategory(queryParams),
    {
      errorMessage: MESSAGES.ERROR_GENERIC,
      dependencies: [period, from, to, category]
    }
  )

  return {
    data: data?.data ?? [],
    loading,
    error,
    refetch
  }
}

export function useTopViewed(params = {}) {
  const { period, from, to, category } = params
  const queryParams = { period, from, to, category }

  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getTopViewed(queryParams),
    {
      errorMessage: MESSAGES.ERROR_GENERIC,
      dependencies: [period, from, to, category]
    }
  )

  return {
    data: data?.data ?? [],
    loading,
    error,
    refetch
  }
}

export function useTopCommented(params = {}) {
  const { period, from, to, category } = params
  const queryParams = { period, from, to, category }

  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getTopCommented(queryParams),
    {
      errorMessage: MESSAGES.ERROR_GENERIC,
      dependencies: [period, from, to, category]
    }
  )

  return {
    data: data?.data ?? [],
    loading,
    error,
    refetch
  }
}

export function useLastComments(params = {}) {
  const { period, from, to, category } = params
  const queryParams = { period, from, to, category }

  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getLastComments(queryParams),
    {
      errorMessage: MESSAGES.ERROR_GENERIC,
      dependencies: [period, from, to, category]
    }
  )

  return {
    data: data?.data ?? [],
    loading,
    error,
    refetch
  }
}
