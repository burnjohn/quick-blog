import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { useAnalyticsCategoryDistribution } from '../../../../../hooks'

const COLORS = ['#3b82f6', '#a855f7', '#22c55e', '#f97316', '#ef4444']

function CategoryDistribution({ filterParams, onSegmentClick }) {
  const { distribution, loading, error, refetch } = useAnalyticsCategoryDistribution(filterParams)

  if (loading) return <div className='h-64 animate-pulse bg-gray-200 rounded-lg' />
  if (error) return (
    <div className='h-64 bg-white rounded-lg shadow flex flex-col items-center justify-center gap-2'>
      <p className='text-red-500 text-sm'>Failed to load chart</p>
      <button onClick={refetch} className='text-xs text-primary underline'>Retry</button>
    </div>
  )
  if (!distribution.length) return (
    <div className='h-64 bg-white rounded-lg shadow flex items-center justify-center'>
      <p className='text-gray-400 text-sm'>No data for this period</p>
    </div>
  )

  return (
    <div className='bg-white rounded-lg shadow p-4'>
      <h3 className='text-sm font-semibold text-gray-600 mb-4'>Category Distribution</h3>
      <ResponsiveContainer width='100%' height={240}>
        <PieChart>
          <Pie
            data={distribution}
            dataKey='count'
            nameKey='category'
            innerRadius={60}
            outerRadius={100}
            onClick={(entry) => onSegmentClick && onSegmentClick(entry.category)}
          >
            {distribution.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryDistribution
