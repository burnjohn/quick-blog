import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts'
import Skeleton from '../../../ui/Skeleton'
import StateMessage from '../StateMessage'
import { CATEGORY_COLORS, CHART_COLORS, AXIS_PROPS, GRID_PROPS, LEGEND_PROPS, TOOLTIP_CLASS } from './constants'

const CATEGORIES = ['Technology', 'Lifestyle', 'Startup', 'Finance']

function transformData(data) {
  if (!data || data.length === 0) return []
  // Backend returns { month, Technology, Lifestyle, Startup, Finance }
  // Ensure all category keys present with defaults
  return data.map((item) => {
    const row = { month: item.month }
    for (const cat of CATEGORIES) {
      row[cat] = item[cat] ?? 0
    }
    return row
  })
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((sum, p) => sum + (p.value || 0), 0)
  return (
    <div className={TOOLTIP_CLASS}>
      <div className="mb-1 text-ink-muted">{label}</div>
      {payload
        .filter((p) => p.value > 0)
        .map((p) => (
          <div key={p.dataKey} className="flex gap-2">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2 w-2 border border-ink" style={{ backgroundColor: p.color }} />
              {p.name}:
            </span>
            <span>{p.value}</span>
          </div>
        ))}
      <div className="mt-1 border-t border-line pt-1 font-medium">Total: {total}</div>
    </div>
  )
}

function PublicationsChart({ data, loading, error }) {
  if (loading) return <Skeleton height={300} className="w-full" />
  if (error) return <StateMessage tone="error">{error}</StateMessage>
  if (!data || data.length === 0) {
    return <StateMessage>No data for selected period</StateMessage>
  }

  const chartData = transformData(data)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid {...GRID_PROPS} />
        <XAxis dataKey="month" {...AXIS_PROPS} />
        <YAxis {...AXIS_PROPS} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: CHART_COLORS.signal, fillOpacity: 0.15 }} />
        <Legend {...LEGEND_PROPS} />
        {CATEGORIES.map((cat) => (
          <Bar
            key={cat}
            dataKey={cat}
            stackId="a"
            fill={CATEGORY_COLORS[cat]}
            stroke={CHART_COLORS.surface}
            strokeWidth={1}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export default PublicationsChart
