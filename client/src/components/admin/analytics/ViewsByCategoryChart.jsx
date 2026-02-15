import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import ChartCard from './ChartCard'

function ViewsByCategoryChart({ data, loading, error, refetch }) {
  return (
    <ChartCard
      title='Views by Category'
      loading={loading}
      error={error}
      isEmpty={!data?.length}
      emptyMessage='No views data available'
      onRetry={refetch}
    >
      <ResponsiveContainer width='100%' height={250}>
        <BarChart data={data} layout='vertical'>
          <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
          <XAxis type='number' tick={{ fontSize: 11 }} stroke='#9ca3af' />
          <YAxis dataKey='category' type='category' tick={{ fontSize: 11 }} stroke='#9ca3af' width={80} />
          <Tooltip />
          <Bar dataKey='views' fill='#6366f1' radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export default ViewsByCategoryChart
