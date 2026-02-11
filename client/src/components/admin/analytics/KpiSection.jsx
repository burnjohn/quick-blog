import { useAnalyticsKpis } from '../../../hooks/api/queries'
import KpiCard from './KpiCard'

const KPI_LABELS = {
  totalViews: 'Total Views',
  totalBlogs: 'Total Blogs',
  totalComments: 'Total Comments',
  avgEngagement: 'Avg Engagement',
  approvalRate: 'Approval Rate',
  mostActiveCategory: 'Most Active Category'
}

function KpiSection({ params = {} }) {
  const { data: kpis, loading, error, refetch } = useAnalyticsKpis(params)

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    )
  }

  const cards = [
    {
      key: 'totalViews',
      label: KPI_LABELS.totalViews,
      value: kpis?.totalViews?.value ?? 0,
      trend: kpis?.totalViews?.trend
    },
    {
      key: 'totalBlogs',
      label: KPI_LABELS.totalBlogs,
      value: kpis?.totalBlogs?.value ?? 0,
      trend: kpis?.totalBlogs?.trend,
      secondaryText: kpis?.totalBlogs?.published != null
        ? `${kpis.totalBlogs.published} published, ${kpis.totalBlogs.drafts ?? 0} drafts`
        : null
    },
    {
      key: 'totalComments',
      label: KPI_LABELS.totalComments,
      value: kpis?.totalComments?.value ?? 0,
      trend: kpis?.totalComments?.trend,
      secondaryText: kpis?.totalComments?.approved != null
        ? `${kpis.totalComments.approved} approved, ${kpis.totalComments.pending ?? 0} pending`
        : null
    },
    {
      key: 'avgEngagement',
      label: KPI_LABELS.avgEngagement,
      value: kpis?.avgEngagement?.value != null ? `${kpis.avgEngagement.value}%` : '0%',
      trend: kpis?.avgEngagement?.trend
    },
    {
      key: 'approvalRate',
      label: KPI_LABELS.approvalRate,
      value: kpis?.approvalRate?.value != null ? `${kpis.approvalRate.value}%` : '0%',
      trend: kpis?.approvalRate?.trend
    },
    {
      key: 'mostActiveCategory',
      label: KPI_LABELS.mostActiveCategory,
      value: kpis?.mostActiveCategory?.value ?? '—',
      trend: null,
      secondaryText: kpis?.mostActiveCategory?.count != null
        ? `${kpis.mostActiveCategory.count} posts`
        : null
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {cards.map((card) => (
        <KpiCard
          key={card.key}
          label={card.label}
          value={card.value}
          trend={card.trend}
          secondaryText={card.secondaryText}
          loading={loading}
        />
      ))}
    </div>
  )
}

export default KpiSection
