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

const APPROVED_COLOR = '#22c55e'
const PENDING_COLOR = '#f97316'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2 text-sm">
      <div className="text-gray-600 font-medium mb-1">{label}</div>
      <div className="flex gap-2">
        <span style={{ color: APPROVED_COLOR }}>Approved:</span>
        <span>{payload.find((p) => p.dataKey === 'approved')?.value ?? 0}</span>
      </div>
      <div className="flex gap-2">
        <span style={{ color: PENDING_COLOR }}>Pending:</span>
        <span>{payload.find((p) => p.dataKey === 'pending')?.value ?? 0}</span>
      </div>
    </div>
  )
}

function CommentActivityChart({ data, loading, error }) {
  if (loading) return <Skeleton height={300} className="w-full" />
  if (error) return <p className="text-red-600 text-sm py-4">{error}</p>
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">No data for selected period</p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} />
        <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="approved" name="Approved" fill={APPROVED_COLOR} radius={[4, 4, 0, 0]} />
        <Bar dataKey="pending" name="Pending" fill={PENDING_COLOR} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default CommentActivityChart
