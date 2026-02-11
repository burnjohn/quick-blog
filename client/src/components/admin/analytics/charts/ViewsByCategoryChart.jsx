import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import Skeleton from '../../../ui/Skeleton'

const CHART_MARGIN = { top: 8, right: 8, left: 0, bottom: 0 }

function ViewsByCategoryChart({ data, loading, error }) {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Skeleton width="100%" height={256} className="rounded" />
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
        No views by category for selected period
      </div>
    )
  }

  const sortedData = [...data].sort((a, b) => (b.views ?? 0) - (a.views ?? 0))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={CHART_MARGIN}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis dataKey="category" type="category" width={80} tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            formatter={(value) => [value?.toLocaleString('en-US'), 'Views']}
          />
          <Bar
            dataKey="views"
            fill="#3B82F6"
            radius={[0, 4, 4, 0]}
            label={{ position: 'right', fontSize: 12 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ViewsByCategoryChart
