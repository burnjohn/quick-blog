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

function CommentActivityChart({ data, loading, error, refetch }) {
  return (
    <ChartCard
      title='Comment Activity'
      loading={loading}
      error={error}
      isEmpty={!data?.length}
      emptyMessage='No comment data available'
      onRetry={refetch}
    >
      <ResponsiveContainer width='100%' height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
          <XAxis dataKey='date' tick={{ fontSize: 11 }} stroke='#9ca3af' />
          <YAxis tick={{ fontSize: 11 }} stroke='#9ca3af' />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey='approved' fill='#10b981' name='Approved' />
          <Bar dataKey='pending' fill='#f59e0b' name='Pending' />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export default CommentActivityChart
