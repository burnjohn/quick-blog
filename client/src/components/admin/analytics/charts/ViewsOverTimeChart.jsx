import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts'
import Skeleton from '../../../ui/Skeleton'
import StateMessage from '../StateMessage'
import { CHART_COLORS, AXIS_PROPS, GRID_PROPS, TOOLTIP_CLASS } from './constants'

const GRADIENT_ID = 'viewsOverTimeGradient'

function ClickableDot(props) {
  const { cx, cy, payload, onDrillDown } = props
  const r = 4
  if (!onDrillDown || !payload?.date) {
    return <circle cx={cx} cy={cy} r={r} fill={CHART_COLORS.ink} strokeWidth={0} />
  }
  return (
    <g
      onClick={() => onDrillDown(payload.date)}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label={`Drill down for ${payload.date}`}
    >
      <circle cx={cx} cy={cy} r={r} fill={CHART_COLORS.ink} strokeWidth={0} />
    </g>
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.[0]?.payload) return null
  const { date, views } = payload[0].payload
  return (
    <div className={TOOLTIP_CLASS}>
      <div className="text-ink-muted">{date}</div>
      <div className="font-medium">{views} views</div>
    </div>
  )
}

const findPeak = (data) => data.reduce(
  (peak, point) => ((point.views ?? 0) > (peak?.views ?? -1) ? point : peak),
  null
)

function ViewsOverTimeChart({ data, loading, error, onDrillDown }) {
  if (loading) return <Skeleton height={300} className="w-full" />
  if (error) return <StateMessage tone="error">{error}</StateMessage>
  if (!data || data.length === 0) {
    return <StateMessage>No views data for selected period</StateMessage>
  }

  const peak = findPeak(data)

  return (
    <>
    {peak && (
      <p className="mb-3 inline-block border border-ink bg-signal px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
        Peak {peak.date} · {peak.views} views
      </p>
    )}
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.signal} stopOpacity={0.9} />
            <stop offset="100%" stopColor={CHART_COLORS.signal} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid {...GRID_PROPS} />
        <XAxis dataKey="date" {...AXIS_PROPS} />
        <YAxis {...AXIS_PROPS} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: CHART_COLORS.ink, strokeDasharray: '2 4' }} />
        {peak && <ReferenceLine x={peak.date} stroke={CHART_COLORS.ink} strokeDasharray="4 4" />}
        <Area
          type="monotone"
          dataKey="views"
          stroke={CHART_COLORS.ink}
          strokeWidth={2}
          fill={`url(#${GRADIENT_ID})`}
          dot={(dotProps) => <ClickableDot {...dotProps} onDrillDown={onDrillDown} />}
          activeDot={{
            r: 6,
            fill: CHART_COLORS.signal,
            stroke: CHART_COLORS.ink,
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
    </>
  )
}

export default ViewsOverTimeChart
