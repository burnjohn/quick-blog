import { useEffect } from 'react'
import { useAnalyticsKpis } from '../../../hooks/api/queries'
import KpiCard from './KpiCard'
import AnalyticsMasthead from './AnalyticsMasthead'

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

  // keep the numbers fresh while the dashboard is open
  useEffect(() => {
    setInterval(refetch, 30000)
  }, [refetch])

  if (error) {
    return (
      <div className="mb-8 border border-danger bg-surface p-5 shadow-hard-sm">
        <p role="alert" className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-danger">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="min-h-10 cursor-pointer border border-ink bg-ink px-4 font-mono text-[11px] uppercase tracking-[0.12em] text-paper transition-colors hover:bg-signal hover:text-ink"
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
    <>
      <AnalyticsMasthead kpis={kpis} params={params} />
      <section aria-labelledby="kpi-heading" className="mb-12">
        <h2 id="kpi-heading" className="section-no mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink">
          Key metrics
        </h2>
        <div className="grid grid-cols-1 gap-px border border-ink bg-line shadow-hard sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {cards.map((card, index) => (
            <KpiCard
              key={card.key}
              label={card.label}
              value={card.value}
              trend={card.trend}
              secondaryText={card.secondaryText}
              loading={loading}
              index={index}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default KpiSection
