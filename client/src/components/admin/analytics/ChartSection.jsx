import {
  useViewsOverTime,
  usePublicationsOverTime,
  useCategoryDistribution,
  useCommentActivity,
  useViewsByCategory
} from '../../../hooks/api/queries'
import ViewsOverTimeChart from './charts/ViewsOverTimeChart'
import PublicationsChart from './charts/PublicationsChart'
import CategoryDistributionChart from './charts/CategoryDistributionChart'
import CommentActivityChart from './charts/CommentActivityChart'
import ViewsByCategoryChart from './charts/ViewsByCategoryChart'
import AnalyticsPanel from './AnalyticsPanel'

function ChartSection({ params = {}, onCategoryChange, onDrillDown }) {
  const viewsOverTime = useViewsOverTime(params)
  const publicationsOverTime = usePublicationsOverTime(params)
  const categoryDistribution = useCategoryDistribution(params)
  const commentActivity = useCommentActivity(params)
  const viewsByCategory = useViewsByCategory(params)

  const chartCards = [
    {
      title: 'Views Over Time',
      className: 'lg:col-span-2',
      aside: <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">Click a point to drill down</span>,
      chart: (
        <ViewsOverTimeChart
          data={viewsOverTime.data}
          loading={viewsOverTime.loading}
          error={viewsOverTime.error}
          onDrillDown={onDrillDown}
        />
      )
    },
    {
      title: 'Publications Over Time',
      chart: (
        <PublicationsChart
          data={publicationsOverTime.data}
          loading={publicationsOverTime.loading}
          error={publicationsOverTime.error}
        />
      )
    },
    {
      title: 'Category Distribution',
      chart: (
        <CategoryDistributionChart
          data={categoryDistribution.data}
          loading={categoryDistribution.loading}
          error={categoryDistribution.error}
          onSegmentClick={onCategoryChange}
        />
      )
    },
    {
      title: 'Comment Activity',
      chart: (
        <CommentActivityChart
          data={commentActivity.data}
          loading={commentActivity.loading}
          error={commentActivity.error}
        />
      )
    },
    {
      title: 'Views by Category',
      chart: (
        <ViewsByCategoryChart
          data={viewsByCategory.data}
          loading={viewsByCategory.loading}
          error={viewsByCategory.error}
        />
      )
    }
  ]

  return (
    <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {chartCards.map((card, index) => (
        <AnalyticsPanel key={card.title} title={card.title} aside={card.aside} index={index % 2} className={card.className}>
          {card.chart}
        </AnalyticsPanel>
      ))}
    </div>
  )
}

export default ChartSection
