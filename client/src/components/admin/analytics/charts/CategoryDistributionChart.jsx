import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell
} from 'recharts'
import Skeleton from '../../../ui/Skeleton'
import { CATEGORY_COLORS } from './constants'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null
  const entry = payload[0].payload
  const { category, count, percent, total } = entry
  const pct = percent ?? (total > 0 ? Math.round((count / total) * 1000) / 10 : 0)
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2 text-sm">
      <div className="font-medium" style={{ color: entry.fill }}>
        {category}
      </div>
      <div>{count} posts</div>
      <div className="text-gray-600">{pct}%</div>
    </div>
  )
}

function CategoryDistributionChart({ data, loading, error, onSegmentClick }) {
  if (loading) return <Skeleton height={300} className="w-full" />
  if (error) return <p className="text-red-600 text-sm py-4">{error}</p>
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">No data for selected period</p>
    )
  }

  const total = data.reduce((sum, d) => sum + d.count, 0)
  const chartData = data.map((d) => ({
    ...d,
    total,
    percent: total > 0 ? Math.round((d.count / total) * 1000) / 10 : 0
  }))

  const filteredData = chartData.filter((d) => d.count > 0)
  if (filteredData.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">No data for selected period</p>
    )
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
          style={{ cursor: onSegmentClick ? 'pointer' : 'default' }}
          onClick={(data, index) => {
            if (onSegmentClick && filteredData[index]) {
              onSegmentClick(filteredData[index].category)
            }
          }}
        >
          {filteredData.map((entry, index) => (
            <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] ?? '#94a3b8'} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default CategoryDistributionChart
