import React from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import { useAnalyticsViewsOverTime } from '../../../../hooks'

function ViewsOverTime({ filterParams }) {
  const { series, loading, error, refetch } = useAnalyticsViewsOverTime(filterParams)

  if (loading) return <div className='h-64 animate-pulse bg-gray-200 rounded-lg' />
  if (error) return (
    <div className='h-64 bg-white rounded-lg shadow flex flex-col items-center justify-center gap-2'>
      <p className='text-red-500 text-sm'>Failed to load chart</p>
      <button onClick={refetch} className='text-xs text-primary underline'>Retry</button>
    </div>
  )
  if (!series.length) return (
    <div className='h-64 bg-white rounded-lg shadow flex items-center justify-center'>
      <p className='text-gray-400 text-sm'>No data for this period</p>
    </div>
  )

  return (
    <div className='bg-white rounded-lg shadow p-4'>
      <h3 className='text-sm font-semibold text-gray-600 mb-4'>Views Over Time</h3>
      <ResponsiveContainer width='100%' height={240}>
        <AreaChart data={series}>
          <XAxis dataKey='date' tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Area type='monotone' dataKey='views' stroke='#2563eb' fill='#3b82f6' fillOpacity={0.15} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ViewsOverTime
