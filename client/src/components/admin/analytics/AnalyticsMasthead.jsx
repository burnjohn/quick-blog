import Masthead from '../shared/Masthead'
import { longDateLabel, plural } from '../shared/editorial'

const PERIOD_LABELS = {
  7: 'Last 7 days',
  30: 'Last 30 days',
  90: 'Last 90 days',
  365: 'Last 12 months',
  all: 'All time'
}

const describePeriod = ({ period, category, from, to }) => {
  const range = from && to ? `${from} → ${to}` : (PERIOD_LABELS[period] ?? 'Selected period')
  return category && category !== 'All' ? `${range} · ${category}` : range
}

const describeTrend = (trend) => {
  if (!trend?.direction || trend.percentChange == null || trend.percentChange === 0) return 'Flat vs prev.'
  const arrow = trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '−'
  return `${arrow} ${Math.abs(trend.percentChange).toFixed(1)}% vs prev.`
}

const Highlight = ({ children }) => (
  <em className='bg-signal px-1 not-italic text-ink'>{children}</em>
)

const buildInsights = (kpis) => {
  const blogs = kpis?.totalBlogs ?? {}
  const comments = kpis?.totalComments ?? {}
  return [
    {
      kicker: 'Engagement',
      text: <>Readers engage with <Highlight>{kpis?.avgEngagement?.value ?? 0}%</Highlight> of what they open.</>
    },
    {
      kicker: 'Conversation',
      text: `${plural(comments.value ?? 0, 'comment')}, ${comments.pending ?? 0} waiting · ${kpis?.approvalRate?.value ?? 0}% approved.`
    },
    {
      kicker: 'The desk',
      text: `${blogs.published ?? 0} published, ${plural(blogs.drafts ?? 0, 'draft')} on the spike.`
    }
  ]
}

// Front-page summary for the analytics page, built from the KPI payload only.
function AnalyticsMasthead({ kpis, params }) {
  const topCategory = kpis?.mostActiveCategory
  return (
    <Masthead
      dateline={['Quick Blog · Readership desk', describePeriod(params), longDateLabel()]}
      label='Views'
      value={kpis?.totalViews?.value ?? 0}
      sticker={describeTrend(kpis?.totalViews?.trend)}
      sub={topCategory?.value ? `${topCategory.value} is the most active desk with ${plural(topCategory.count ?? 0, 'post')}.` : null}
      insights={buildInsights(kpis)}
    />
  )
}

export default AnalyticsMasthead
