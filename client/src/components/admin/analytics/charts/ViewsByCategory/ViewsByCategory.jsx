import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { useAnalyticsViewsByCategory } from '../../../../../hooks'

function ViewsByCategory({ filterParams }) {
  const { categories, loading, error, refetch } = useAnalyticsViewsByCategory(filterParams)

  if (loading) return <div className='h-64 animate-pulse bg-gray-200 rounded-lg' />
  if (error) return (
    <div className='h-64 bg-white rounded-lg shadow flex flex-col items-center justify-center gap-2'>
      <p className='text-red-500 text-sm'>Failed to load chart</p>
      <button onClick={refetch} className='text-xs text-primary underline'>Retry</button>
    </div>
  )
  if (!categories.length) return (
    <div className='h-64 bg-white rounded-lg shadow flex items-center justify-center'>
      <p className='text-gray-400 text-sm'>No data for this period</p>
    </div>
  )

  return (
    <div className='bg-white rounded-lg shadow p-4'>
      <h3 className='text-sm font-semibold text-gray-600 mb-4'>Views by Category</h3>
      <ResponsiveContainer width='100%' height={240}>
        <BarChart layout='vertical' data={categories}>
          <XAxis type='number' tick={{ fontSize: 11 }} />
          <YAxis type='category' dataKey='category' tick={{ fontSize: 11 }} width={80} />
          <Tooltip />
          <Bar dataKey='views' fill='#3b82f6' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ViewsByCategory
