import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'
import Skeleton from '../../../ui/Skeleton'

const GRADIENT_ID = 'viewsOverTimeGradient'

function ClickableDot(props) {
  const { cx, cy, payload, onDrillDown } = props
  const r = 4
  if (!onDrillDown || !payload?.date) {
    return <circle cx={cx} cy={cy} r={r} fill="#8b5cf6" strokeWidth={0} />
  }
  return (
    <g
      onClick={() => onDrillDown(payload.date)}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label={`Drill down for ${payload.date}`}
    >
      <circle cx={cx} cy={cy} r={r} fill="#8b5cf6" strokeWidth={0} />
    </g>
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.[0]?.payload) return null
  const { date, views } = payload[0].payload
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2 text-sm">
      <div className="text-gray-600">{date}</div>
      <div className="font-medium">{views} views</div>
    </div>
  )
}

function ViewsOverTimeChart({ data, loading, error, onDrillDown }) {
  if (loading) return <Skeleton height={300} className="w-full" />
  if (error) return <p className="text-red-600 text-sm py-4">{error}</p>
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">No views data for selected period</p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
        <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="views"
          stroke="#8b5cf6"
          strokeWidth={2}
          fill={`url(#${GRADIENT_ID})`}
          dot={(dotProps) => <ClickableDot {...dotProps} onDrillDown={onDrillDown} />}
          activeDot={{
            r: 6,
            fill: '#8b5cf6',
            stroke: '#fff',
            strokeWidth: 2,
            cursor: onDrillDown ? 'pointer' : 'default',
            onClick: (_, entry) => {
              if (onDrillDown && entry?.payload?.date) {
                onDrillDown(entry.payload.date)
              }
            }
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default ViewsOverTimeChart
