import { useApiQuery } from '../../../core'
import { blogApi } from '../../../../api'
import { MESSAGES } from '../../../../constants/messages'

/**
 * Most-read published posts. Silent on failure (no toast): callers hide the
 * section instead, so a ranking outage never blocks the home page.
 */
export function usePopularBlogs({ limit = 8, days = 30 } = {}) {
  const { data, loading, error, refetch } = useApiQuery(
    () => blogApi.getPopular({ limit, days }),
    {
      dependencies: [limit, days],
      showErrorToast: false,
      errorMessage: MESSAGES.ERROR_FETCH_POPULAR
    }
  )

  return {
    blogs: data?.blogs || [],
    range: data?.range ?? null,
    loading,
    error,
    refetch
  }
}
