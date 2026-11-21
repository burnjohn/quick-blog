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
import StateMessage from '../StateMessage'
import { CHART_COLORS, AXIS_PROPS, GRID_PROPS, TOOLTIP_CLASS } from './constants'

const BAR_FILL = CHART_COLORS.ink

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.[0]?.payload) return null
  const { category, views } = payload[0].payload
  return (
    <div className={TOOLTIP_CLASS}>
      <div className="font-medium">{category}</div>
      <div>{views} views</div>
    </div>
  )
}

function ViewsByCategoryChart({ data, loading, error }) {
  if (loading) return <Skeleton height={300} className="w-full" />
  if (error) return <StateMessage tone="error">{error}</StateMessage>
  if (!data || data.length === 0) {
    return <StateMessage>No data for selected period</StateMessage>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 10, right: 10, left: 60, bottom: 0 }}
      >
        <CartesianGrid {...GRID_PROPS} horizontal={false} />
        <XAxis type="number" {...AXIS_PROPS} />
        <YAxis
          type="category"
          dataKey="category"
          width={55}
          {...AXIS_PROPS}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: CHART_COLORS.signal, fillOpacity: 0.15 }} />
        <Bar dataKey="views" fill={BAR_FILL} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ViewsByCategoryChart
