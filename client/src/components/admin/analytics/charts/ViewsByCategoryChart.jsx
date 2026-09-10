import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'
import Skeleton from '../../../ui/Skeleton'

const BAR_FILL = '#8b5cf6'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.[0]?.payload) return null
  const { category, views } = payload[0].payload
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2 text-sm">
      <div className="font-medium text-gray-800">{category}</div>
      <div>{views} views</div>
    </div>
  )
}

function ViewsByCategoryChart({ data, loading, error }) {
  if (loading) return <Skeleton height={300} className="w-full" />
  if (error) return <p className="text-red-600 text-sm py-4">{error}</p>
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">No data for selected period</p>
    )
  }

  const sortedData = [...data].sort((a, b) => (b.views || 0) - (a.views || 0))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        layout="vertical"
        data={sortedData}
        margin={{ top: 10, right: 10, left: 60, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
        <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="category"
          width={55}
          stroke="#6b7280"
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="views" fill={BAR_FILL} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ViewsByCategoryChart
