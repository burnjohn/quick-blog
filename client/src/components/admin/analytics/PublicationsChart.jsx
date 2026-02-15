import React from 'react'
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
import ChartCard from './ChartCard'
import { BLOG_CATEGORIES } from '../../../constants/categories'

const PALETTE = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']

const CATEGORY_COLORS = Object.fromEntries(
  BLOG_CATEGORIES
    .filter((cat) => cat !== 'All')
    .map((cat, i) => [cat, PALETTE[i % PALETTE.length]])
)

function PublicationsChart({ data, loading, error, refetch }) {
  return (
    <ChartCard
      title='Publications Over Time'
      loading={loading}
      error={error}
      isEmpty={!data?.length}
      emptyMessage='No publication data available'
      onRetry={refetch}
    >
      <ResponsiveContainer width='100%' height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
          <XAxis dataKey='date' tick={{ fontSize: 11 }} stroke='#9ca3af' />
          <YAxis tick={{ fontSize: 11 }} stroke='#9ca3af' />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <Bar key={cat} dataKey={cat} stackId='publications' fill={color} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export default PublicationsChart
