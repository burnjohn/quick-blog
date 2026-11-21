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
import StateMessage from '../StateMessage'
import { CHART_COLORS, AXIS_PROPS, GRID_PROPS, LEGEND_PROPS, TOOLTIP_CLASS } from './constants'

const APPROVED_COLOR = CHART_COLORS.ink
const PENDING_COLOR = CHART_COLORS.signal

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className={TOOLTIP_CLASS}>
      <div className="mb-1 text-ink-muted">{label}</div>
      <div className="flex gap-2">
        <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="h-2 w-2 border border-ink" style={{ backgroundColor: APPROVED_COLOR }} />Approved:</span>
        <span>{payload.find((p) => p.dataKey === 'approved')?.value ?? 0}</span>
      </div>
      <div className="flex gap-2">
        <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="h-2 w-2 border border-ink" style={{ backgroundColor: PENDING_COLOR }} />Pending:</span>
        <span>{payload.find((p) => p.dataKey === 'pending')?.value ?? 0}</span>
      </div>
    </div>
  )
}

function CommentActivityChart({ data, loading, error }) {
  if (loading) return <Skeleton height={300} className="w-full" />
  if (error) return <StateMessage tone="error">{error}</StateMessage>
  if (!data || data.length === 0) {
    return <StateMessage>No data for selected period</StateMessage>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid {...GRID_PROPS} />
        <XAxis dataKey="month" {...AXIS_PROPS} />
        <YAxis {...AXIS_PROPS} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: CHART_COLORS.signal, fillOpacity: 0.15 }} />
        <Legend {...LEGEND_PROPS} />
        <Bar dataKey="approved" name="Approved" fill={APPROVED_COLOR} />
        <Bar dataKey="pending" name="Pending" fill={PENDING_COLOR} stroke={CHART_COLORS.ink} strokeWidth={1} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default CommentActivityChart
