import React from 'react'
import { motion, useReducedMotion } from 'motion/react' // eslint-disable-line no-unused-vars
import { useAnalyticsMeta, useAnalyticsOverview } from '../../../hooks/api/queries'
import { useAnalyticsFilters } from '../../../hooks/utils'
import {
  AnalyticsShell,
  AnalyticsSkeleton,
  EmptyState,
  ErrorState,
} from '../../../components/admin/analytics'
import { formatDateRange } from '../../../utils/analyticsFormat'
import { MESSAGES } from '../../../constants/messages'

const isEmptyOverview = (overview) => {
  const views = overview.kpis?.find((kpi) => kpi.key === 'views')
  return !views || views.value === 0
}

// Container: reads URL filters, fetches meta + overview, renders page states.
function Analytics() {
  const reduceMotion = useReducedMotion()
  const { meta, error: metaError, refetch: refetchMeta } = useAnalyticsMeta()
  const { filters, params, queryKey, hasActiveFilters, resetAll } =
    useAnalyticsFilters(meta?.dateBounds)
  const { overview, loading, error, refetch } = useAnalyticsOverview(
    params,
    queryKey,
    { enabled: Boolean(meta) }
  )

  const failure = metaError || error
  const handleRetry = () => {
    if (metaError) refetchMeta()
    else refetch()
  }

  const renderBody = () => {
    if (failure) {
      return <ErrorState message={failure || MESSAGES.ERROR_FETCH_ANALYTICS} onRetry={handleRetry} />
    }
    if (!overview) return <AnalyticsSkeleton embedded />
    if (isEmptyOverview(overview)) {
      return (
        <EmptyState
          title={MESSAGES.INFO_NO_ANALYTICS}
          onReset={resetAll}
          resetLabel={hasActiveFilters ? 'Reset filters' : 'Reset period'}
        />
      )
    }
    return (
      <div className='space-y-6'>
        {/* T7 slot: FilterBar (period, compare, tags/authors/sources, reset, Export CSV) */}
        {/* T8 slot: KpiGrid (filters.compare toggles deltas) */}
        {/* T9/T10 slots: TrendChart, TagsBarChart, DonutChart x2, FunnelChart, CountryList,
            ActivityHeatmap, TopPostsBarChart */}
        {/* T11 slot: TopPostsTable (filters.sort/dir) and PostDetailDialog (filters.post) */}
      </div>
    )
  }

  return (
    <AnalyticsShell>
      <div aria-busy={loading && Boolean(overview)} className='space-y-8'>
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='space-y-2'
        >
          <h1 className='bg-linear-to-r from-white via-accent-violet to-accent-cyan bg-clip-text font-display text-4xl font-bold tracking-tight text-transparent sm:text-6xl'>
            Analytics
          </h1>
          {overview && (
            <p className='text-sm text-ink-muted'>
              {formatDateRange(overview.range.from, overview.range.to)}
              {filters.compare && ' · compared with the previous period'}
            </p>
          )}
        </motion.header>
        {loading && overview && (
          <div role='status' aria-label='Refreshing data' className='analytics-shimmer h-0.5 w-full rounded-full' />
        )}
        {renderBody()}
      </div>
    </AnalyticsShell>
  )
}

export default Analytics
