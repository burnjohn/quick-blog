import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import ChartCard from './ChartCard'

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']

function CategoryDonutChart({ data, loading, error, refetch, onCategoryClick }) {
  return (
    <ChartCard
      title='Category Distribution'
      loading={loading}
      error={error}
      isEmpty={!data?.length}
      emptyMessage='No category data available'
      onRetry={refetch}
    >
      <ResponsiveContainer width='100%' height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey='count'
            nameKey='category'
            cx='50%'
            cy='50%'
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            cursor={onCategoryClick ? 'pointer' : 'default'}
            onClick={(entry) => onCategoryClick?.(entry.category)}
          >
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export default CategoryDonutChart
