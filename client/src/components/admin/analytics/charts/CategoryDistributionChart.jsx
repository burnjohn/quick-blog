import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import Skeleton from '../../../ui/Skeleton'
import { CHART_CATEGORY_COLORS } from '../../../../constants/categories'

function CategoryDistributionChart({ data, loading, error, onSegmentClick }) {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Skeleton width="100%" height={256} className="rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center text-red-600">
        {error}
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No category data for selected period
      </div>
    )
  }

  const chartData = data.map((row) => ({
    name: row.category,
    value: row.count,
    percent: row.percent
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={1}
            dataKey="value"
            onClick={onSegmentClick ? (data) => data?.name && onSegmentClick(data.name) : undefined}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={CHART_CATEGORY_COLORS[entry.name] || '#6b7280'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            formatter={(value, name, props) => [
              `${value} (${props.payload.percent ?? 0}%)`,
              name
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryDistributionChart
