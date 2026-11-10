import React, { useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react' // eslint-disable-line no-unused-vars
import { useAnalyticsMeta, useAnalyticsOverview } from '../../../hooks/api/queries'
import { useAnalyticsFilters } from '../../../hooks/utils'
import {
  AnalyticsShell,
  AnalyticsSkeleton,
  EmptyState,
  ErrorState,
  FilterBar,
  PostDetailDialog,
} from '../../../components/admin/analytics'
import { formatDateRange } from '../../../utils/analyticsFormat'
import AnalyticsDashboard from './AnalyticsDashboard'
import { useAnalyticsExport } from './useAnalyticsExport'
import { MESSAGES } from '../../../constants/messages'

const isEmptyOverview = (overview) => {
  const views = overview.kpis?.find((kpi) => kpi.key === 'views')
  return !views || views.value === 0
}

// Container: reads URL filters, fetches meta + overview, renders page states.
function Analytics() {
  const reduceMotion = useReducedMotion()
  const { meta, error: metaError, refetch: refetchMeta } = useAnalyticsMeta()
  const { filters, params, queryKey, hasActiveFilters, resetAll, resetFilters, ...actions } =
    useAnalyticsFilters(meta?.dateBounds)
  const returnFocusRef = useRef(null)
  const { overview, loading, error, refetch } = useAnalyticsOverview(
    params,
    queryKey,
    { enabled: Boolean(meta) }
  )

  const { exporting, exportCsv } = useAnalyticsExport(params, overview?.range)

  const handleOpenPost = (id, triggerEl) => {
    returnFocusRef.current = triggerEl || document.getElementById('top-posts-heading')
    actions.setPost(id)
  }

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
      <AnalyticsDashboard
        overview={overview}
        filters={filters}
        actions={actions}
        onOpenPost={handleOpenPost}
      />
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
        {meta && (
          <div className='sticky top-0 z-20 -mx-3 rounded-b-3xl bg-ink-950/85 px-3 pt-2 pb-2 backdrop-blur-xl'>
            <FilterBar
              filters={filters}
              meta={meta}
              dateBounds={meta.dateBounds}
              onPeriodChange={actions.setPeriod}
              onCustomRange={actions.setCustomRange}
              onCompareChange={actions.setCompare}
              onTagsChange={actions.setTags}
              onAuthorsChange={actions.setAuthors}
              onSourcesChange={actions.setSources}
              onReset={resetFilters}
              hasActiveFilters={hasActiveFilters}
              onExport={exportCsv}
              exporting={exporting}
            />
          </div>
        )}
        {renderBody()}
        <PostDetailDialog
          postId={filters.post}
          params={params}
          onClose={() => actions.setPost(null)}
          returnFocusRef={returnFocusRef}
        />
      </div>
    </AnalyticsShell>
  )
}

export default Analytics
