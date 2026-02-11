import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import Skeleton from '../../../ui/Skeleton'

const CHART_MARGIN = { top: 8, right: 8, left: 0, bottom: 0 }

function ViewsOverTimeChart({ data, loading, error, onDrillDown }) {
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
        No views data for selected period
      </div>
    )
  }

  const handleDotClick = (payload) => {
    if (payload?.date && onDrillDown) {
      onDrillDown(payload.date)
    }
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={data} margin={CHART_MARGIN}>
          <defs>
            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            formatter={(value) => [value?.toLocaleString('en-US'), 'Views']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#viewsGradient)"
            dot={(props) => {
              const { cx, cy, payload } = props
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={onDrillDown ? 6 : 0}
                  fill="#3B82F6"
                  style={{ cursor: onDrillDown ? 'pointer' : 'default' }}
                  onClick={() => handleDotClick(payload)}
                />
              )
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ViewsOverTimeChart
