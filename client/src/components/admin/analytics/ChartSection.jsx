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

function ChartSection({ params = {}, onCategoryChange, onDrillDown }) {
  const viewsOverTime = useViewsOverTime(params)
  const publicationsOverTime = usePublicationsOverTime(params)
  const categoryDistribution = useCategoryDistribution(params)
  const commentActivity = useCommentActivity(params)
  const viewsByCategory = useViewsByCategory(params)

  const chartCards = [
    {
      title: 'Views Over Time',
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {chartCards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{card.title}</h3>
          {card.chart}
        </div>
      ))}
    </div>
  )
}

export default ChartSection
