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
import { CATEGORY_COLORS } from './constants'

const CATEGORIES = ['Technology', 'Lifestyle', 'Startup', 'Finance']

function transformData(data) {
  if (!data || data.length === 0) return []
  // Backend returns { month, Technology, Lifestyle, Startup, Finance }
  // Ensure all category keys present with defaults
  return data.map((item) => {
    const row = { month: item.month }
    for (const cat of CATEGORIES) {
      row[cat] = item[cat] ?? 0
    }
    return row
  })
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((sum, p) => sum + (p.value || 0), 0)
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2 text-sm">
      <div className="text-gray-600 font-medium mb-1">{label}</div>
      {payload
        .filter((p) => p.value > 0)
        .map((p) => (
          <div key={p.dataKey} className="flex gap-2">
            <span style={{ color: p.color }}>{p.name}:</span>
            <span>{p.value}</span>
          </div>
        ))}
      <div className="border-t mt-1 pt-1 font-medium">Total: {total}</div>
    </div>
  )
}

function PublicationsChart({ data, loading, error }) {
  if (loading) return <Skeleton height={300} className="w-full" />
  if (error) return <p className="text-red-600 text-sm py-4">{error}</p>
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">No data for selected period</p>
    )
  }

  const chartData = transformData(data)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} />
        <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {CATEGORIES.map((cat) => (
          <Bar
            key={cat}
            dataKey={cat}
            stackId="a"
            fill={CATEGORY_COLORS[cat]}
            radius={[0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export default PublicationsChart
