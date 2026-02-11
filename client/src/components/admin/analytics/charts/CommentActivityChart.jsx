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

const CHART_MARGIN = { top: 8, right: 8, left: 0, bottom: 0 }

function CommentActivityChart({ data, loading, error }) {
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
        No comment activity for selected period
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            formatter={(value) => [value, undefined]}
          />
          <Legend />
          <Bar dataKey="approved" fill="#10B981" name="Approved" />
          <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CommentActivityChart
