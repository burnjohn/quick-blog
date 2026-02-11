import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import Skeleton from '../../../ui/Skeleton'
import { CHART_CATEGORY_COLORS } from '../../../../constants/categories'

const CHART_MARGIN = { top: 8, right: 8, left: 0, bottom: 0 }

const CATEGORIES = ['Technology', 'Startup', 'Lifestyle', 'Finance']

function PublicationsChart({ data, loading, error }) {
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
        No publications data for selected period
      </div>
    )
  }

  const chartData = data.map((row) => {
    const point = { month: row.month, total: row.total }
    const byCat = row.byCategory || {}
    for (const cat of CATEGORIES) {
      point[cat] = byCat[cat] ?? 0
    }
    return point
  })

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={chartData} margin={CHART_MARGIN}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            formatter={(value) => [value, undefined]}
          />
          <Legend />
          {CATEGORIES.map((cat) => (
            <Bar key={cat} dataKey={cat} stackId="a" fill={CHART_CATEGORY_COLORS[cat] || '#6b7280'} name={cat} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PublicationsChart
