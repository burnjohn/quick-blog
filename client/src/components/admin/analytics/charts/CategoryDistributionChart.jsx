import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell
} from 'recharts'
import Skeleton from '../../../ui/Skeleton'
import StateMessage from '../StateMessage'
import { CATEGORY_COLORS, CHART_COLORS, TOOLTIP_CLASS } from './constants'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null
  const entry = payload[0].payload
  const { category, count, percent, total } = entry
  const pct = percent ?? (total > 0 ? Math.round((count / total) * 1000) / 10 : 0)
  return (
    <div className={TOOLTIP_CLASS}>
      <div className="flex items-center gap-1.5 font-medium">
        <span aria-hidden="true" className="h-2 w-2 border border-ink" style={{ backgroundColor: entry.fill }} />
        {category}
      </div>
      <div>{count} posts</div>
      <div className="text-ink-muted">{pct}%</div>
    </div>
  )
}

function CategoryDistributionChart({ data, loading, error, onSegmentClick }) {
  if (loading) return <Skeleton height={300} className="w-full" />
  if (error) return <StateMessage tone="error">{error}</StateMessage>
  if (!data || data.length === 0) {
    return <StateMessage>No data for selected period</StateMessage>
  }

  const total = data.reduce((sum, d) => sum + d.count, 0)
  const chartData = data.map((d) => ({
    ...d,
    total,
    percent: total > 0 ? Math.round((d.count / total) * 1000) / 10 : 0
  }))

  const filteredData = chartData.filter((d) => d.count > 0)
  if (filteredData.length === 0) {
    return <StateMessage>No data for selected period</StateMessage>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={filteredData}
          dataKey="count"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          stroke={CHART_COLORS.surface}
          strokeWidth={2}
          style={{ cursor: onSegmentClick ? 'pointer' : 'default' }}
          onClick={(data, index) => {
            if (onSegmentClick && filteredData[index]) {
              onSegmentClick(filteredData[index].category)
            }
          }}
        >
          {filteredData.map((entry, index) => (
            <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] ?? CHART_COLORS.line} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default CategoryDistributionChart
