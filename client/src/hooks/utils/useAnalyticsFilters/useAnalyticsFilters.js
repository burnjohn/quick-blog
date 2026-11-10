import { useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  DEFAULT_FILTERS,
  parseFilters,
  serializeFilters,
  toQueryParams,
  toQueryKey,
} from '../../../utils/analyticsFilters'
import { PERIOD_CUSTOM } from '../../../constants/analytics'

// Analytics filter state stored in the URL.
// Period/filter changes push history entries; sort, compare and closing the
// post dialog replace the current entry.
export function useAnalyticsFilters(dateBounds = null) {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => parseFilters(searchParams), [searchParams])

  const boundsMin = dateBounds?.min
  const boundsMax = dateBounds?.max
  const params = useMemo(
    () => toQueryParams(filters, { min: boundsMin, max: boundsMax }),
    [filters, boundsMin, boundsMax]
  )
  const queryKey = toQueryKey(params)

  const update = useCallback((patch, replace = false) => {
    setSearchParams(
      (prev) => serializeFilters({ ...parseFilters(prev), ...patch }),
      { replace }
    )
  }, [setSearchParams])

  const setPeriod = useCallback((period) => update({ period, from: null, to: null }), [update])
  const setCustomRange = useCallback(
    (from, to) => update({ period: PERIOD_CUSTOM, from, to }),
    [update]
  )
  const setCompare = useCallback((compare) => update({ compare }, true), [update])
  const setTags = useCallback((tags) => update({ tags }), [update])
  const setAuthors = useCallback((authors) => update({ authors }), [update])
  const setSources = useCallback((sources) => update({ sources }), [update])
  const setSort = useCallback((sort, dir) => update({ sort, dir }, true), [update])
  const setPost = useCallback(
    (post) => update({ post: post || null }, !post),
    [update]
  )
  // Clears tags, authors and sources; keeps period, compare and sort
  const resetFilters = useCallback(
    () => update({ tags: [], authors: [], sources: [] }),
    [update]
  )
  // Clears filters and returns the period to its default
  const resetAll = useCallback(
    () => update({
      tags: [],
      authors: [],
      sources: [],
      period: DEFAULT_FILTERS.period,
      from: null,
      to: null,
    }),
    [update]
  )

  const hasActiveFilters =
    filters.tags.length + filters.authors.length + filters.sources.length > 0

  return {
    filters,
    params,
    queryKey,
    hasActiveFilters,
    setPeriod,
    setCustomRange,
    setCompare,
    setTags,
    setAuthors,
    setSources,
    setSort,
    setPost,
    resetFilters,
    resetAll,
  }
}
