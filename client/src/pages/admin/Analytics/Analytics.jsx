import React, { useCallback, useMemo, useState } from 'react'
import Button from '../../../components/ui/Button'
import {
  FilterBar,
  KpiSection,
  ChartSection,
  TableSection,
  DrillDownModal,
} from '../../../components/admin/analytics'
import { useAnalytics } from '../../../hooks/api/queries/useAnalytics'
import { useAnalyticsDrillDown } from '../../../hooks/api/queries/useAnalyticsDrillDown'
import { useExportCsv } from '../../../hooks/api/mutations/useExportCsv'
import {
  DEFAULT_PERIOD,
  DEFAULT_CATEGORY,
} from '../../../constants/analyticsConstants'

const KPI_DEFS = [
  { key: 'totalViews', label: 'Total Views' },
  { key: 'totalBlogs', label: 'Total Blogs' },
  { key: 'totalComments', label: 'Total Comments' },
  { key: 'avgEngagement', label: 'Avg Engagement' },
  { key: 'approvalRate', label: 'Approval Rate (%)' },
  { key: 'mostActiveCategory', label: 'Most Active Category' },
]

function trendToNumeric(trend) {
  if (!trend) return null
  const pct = Number(trend.percentChange)
  if (!Number.isFinite(pct)) return null
  if (trend.direction === 'up') return pct
  if (trend.direction === 'down') return -pct
  return 0
}

function buildSubText(entry) {
  const parts = []
  if (entry.published !== undefined) parts.push(`${entry.published} published`)
  if (entry.drafts !== undefined) parts.push(`${entry.drafts} drafts`)
  if (entry.approved !== undefined) parts.push(`${entry.approved} approved`)
  if (entry.pending !== undefined) parts.push(`${entry.pending} pending`)
  return parts.join(' · ') || undefined
}

function Analytics() {
  const [period, setPeriod] = useState(DEFAULT_PERIOD)
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined })
  const [category, setCategory] = useState(DEFAULT_CATEGORY)
  const [drillDown, setDrillDown] = useState({ open: false, date: null })

  const filters = useMemo(
    () => ({ period, from: dateRange.from, to: dateRange.to, category }),
    [period, dateRange.from, dateRange.to, category]
  )

  const {
    kpis,
    viewsOverTime,
    publications,
    categoryDistribution,
    commentActivity,
    viewsByCategory,
    topViewed,
    topCommented,
    lastComments,
    loading,
    error,
    refetch,
  } = useAnalytics(filters)

  const bucket = viewsOverTime?.bucket ?? 'day'

  const drillDownQuery = useAnalyticsDrillDown({
    enabled: drillDown.open,
    date: drillDown.date,
    period,
    from: dateRange.from,
    to: dateRange.to,
    category,
    bucket,
  })

  const { exportCsv, loading: exporting } = useExportCsv()

  const kpiItems = useMemo(() => {
    const source = kpis?.kpis
    if (!source) return null
    return KPI_DEFS.map(({ key, label }) => {
      const entry = source[key] ?? {}
      return {
        key,
        label,
        value: entry.value,
        subText: buildSubText(entry),
        trend: trendToNumeric(entry.trend),
      }
    })
  }, [kpis])

  const handlePointClick = useCallback((date) => {
    if (!date) return
    setDrillDown({ open: true, date })
  }, [])

  const handleCloseDrillDown = useCallback(() => {
    setDrillDown((prev) => ({ ...prev, open: false }))
  }, [])

  const handleCategoryClick = useCallback((nextCategory) => {
    if (!nextCategory) return
    setCategory(nextCategory)
  }, [])

  const handleExport = useCallback(() => {
    return exportCsv({
      period,
      from: dateRange.from,
      to: dateRange.to,
      category,
    })
  }, [exportCsv, period, dateRange.from, dateRange.to, category])

  if (error) {
    return (
      <div className='flex-1 p-4 md:p-10 bg-blue-50/50 h-full min-h-full'>
        <h1 className='text-xl font-semibold mb-4 text-gray-900'>Analytics</h1>
        <div
          role='alert'
          className='rounded-lg border border-red-200 bg-red-50 p-6'
        >
          <p className='text-sm font-medium text-red-700 mb-1'>
            Failed to load analytics
          </p>
          <p className='text-xs text-red-600 mb-4'>
            {typeof error === 'string' ? error : error?.message ?? 'Please try again.'}
          </p>
          <Button variant='primary' size='sm' onClick={refetch}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 p-4 md:p-10 bg-blue-50/50 h-full min-h-full'>
      <h1 className='text-xl font-semibold mb-4 text-gray-900'>Analytics</h1>

      <div className='flex flex-col gap-5'>
        <FilterBar
          period={period}
          onPeriodChange={setPeriod}
          from={dateRange.from}
          to={dateRange.to}
          onDateChange={setDateRange}
          category={category}
          onCategoryChange={setCategory}
          onExport={handleExport}
          exporting={exporting}
        />

        <KpiSection kpis={kpiItems} loading={loading} onRetry={refetch} />

        <ChartSection
          viewsOverTime={viewsOverTime?.series}
          publications={publications?.series}
          categoryDistribution={categoryDistribution?.distribution}
          commentActivity={commentActivity?.series}
          viewsByCategory={viewsByCategory?.series}
          onViewsPointClick={handlePointClick}
          onCategoryClick={handleCategoryClick}
          loading={loading}
        />

        <TableSection
          topViewed={topViewed?.rows}
          topViewedLoading={loading}
          topCommented={topCommented?.rows}
          topCommentedLoading={loading}
          recentComments={lastComments?.rows}
          recentCommentsLoading={loading}
        />
      </div>

      <DrillDownModal
        isOpen={drillDown.open}
        onClose={handleCloseDrillDown}
        title='Posts for this period'
        loading={drillDownQuery.loading}
        data={drillDownQuery.data?.rows}
      />
    </div>
  )
}

export default Analytics
