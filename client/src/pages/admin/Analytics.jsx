import React from 'react'
import {
  FilterBar,
  KpiCards,
  ViewsOverTimeChart,
  PublicationsChart,
  CategoryDonutChart,
  CommentActivityChart,
  ViewsByCategoryChart,
  TopPostsTable,
  RecentCommentsList
} from '../../components/admin/analytics'
import {
  useAnalyticsSummary,
  useViewsOverTime,
  usePublicationsOverTime,
  useCategoryDistribution,
  useCommentActivity,
  useViewsByCategory,
  useTopPosts,
  useRecentComments,
  useExportCsv,
  useAnalyticsFilters
} from '../../hooks'

function Analytics() {
  const filters = useAnalyticsFilters()
  const { filterParams } = filters

  const summary = useAnalyticsSummary(filterParams)
  const viewsOverTime = useViewsOverTime(filterParams)
  const publicationsOverTime = usePublicationsOverTime(filterParams)
  const categoryDistribution = useCategoryDistribution(filterParams)
  const commentActivity = useCommentActivity(filterParams)
  const viewsByCategory = useViewsByCategory(filterParams)
  const topPosts = useTopPosts(filterParams)
  const recentComments = useRecentComments(filterParams)
  const { exportCsv, isExporting } = useExportCsv()

  const handleExport = () => exportCsv(filterParams)
  const handleCategoryClick = (category) => filters.setCategory(category)

  return (
    <div className='flex-1 p-4 md:p-10 bg-blue-50/50 min-h-full'>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Analytics</h1>

      <FilterBar
        period={filters.period}
        setPeriod={filters.setPeriod}
        customStartDate={filters.customStartDate}
        customEndDate={filters.customEndDate}
        setCustomDateRange={filters.setCustomDateRange}
        category={filters.category}
        setCategory={filters.setCategory}
        onExport={handleExport}
        isExporting={isExporting}
      />

      <KpiCards
        summary={summary.summary}
        loading={summary.loading}
        error={summary.error}
        refetch={summary.refetch}
      />

      {/* Charts — 2-column grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        <ViewsOverTimeChart
          data={viewsOverTime.data}
          loading={viewsOverTime.loading}
          error={viewsOverTime.error}
          refetch={viewsOverTime.refetch}
        />
        <PublicationsChart
          data={publicationsOverTime.data}
          loading={publicationsOverTime.loading}
          error={publicationsOverTime.error}
          refetch={publicationsOverTime.refetch}
        />
        <CategoryDonutChart
          data={categoryDistribution.data}
          loading={categoryDistribution.loading}
          error={categoryDistribution.error}
          refetch={categoryDistribution.refetch}
          onCategoryClick={handleCategoryClick}
        />
        <CommentActivityChart
          data={commentActivity.data}
          loading={commentActivity.loading}
          error={commentActivity.error}
          refetch={commentActivity.refetch}
        />
        <ViewsByCategoryChart
          data={viewsByCategory.data}
          loading={viewsByCategory.loading}
          error={viewsByCategory.error}
          refetch={viewsByCategory.refetch}
        />
      </div>

      {/* Top Posts Tables */}
      <TopPostsTable
        topByViews={topPosts.topByViews}
        topByComments={topPosts.topByComments}
        loading={topPosts.loading}
        error={topPosts.error}
        refetch={topPosts.refetch}
      />

      {/* Recent Comments */}
      <div className='mb-6'>
        <RecentCommentsList
          comments={recentComments.comments}
          loading={recentComments.loading}
          error={recentComments.error}
          refetch={recentComments.refetch}
        />
      </div>
    </div>
  )
}

export default Analytics
