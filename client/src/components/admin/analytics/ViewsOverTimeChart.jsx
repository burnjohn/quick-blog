import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ChartCard from './ChartCard'

function ViewsOverTimeChart({ data, loading, error, refetch }) {
  return (
    <ChartCard
      title='Views Over Time'
      loading={loading}
      error={error}
      isEmpty={!data?.length}
      emptyMessage='No view data available'
      onRetry={refetch}
    >
      <ResponsiveContainer width='100%' height={250}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
          <XAxis dataKey='date' tick={{ fontSize: 11 }} stroke='#9ca3af' />
          <YAxis tick={{ fontSize: 11 }} stroke='#9ca3af' />
          <Tooltip />
          <Area
            type='monotone'
            dataKey='views'
            stroke='#6366f1'
            fill='#6366f1'
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export default ViewsOverTimeChart
