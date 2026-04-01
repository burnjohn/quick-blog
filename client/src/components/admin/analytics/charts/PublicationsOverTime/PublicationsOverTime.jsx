import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useAnalyticsPublications } from '../../../../../hooks'

const CATEGORY_COLORS = {
  Technology: '#3b82f6',
  Lifestyle: '#a855f7',
  Startup: '#22c55e',
  Finance: '#f97316'
}

function PublicationsOverTime({ filterParams }) {
  const { series, loading, error, refetch } = useAnalyticsPublications(filterParams)

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
      <h3 className='text-sm font-semibold text-gray-600 mb-4'>Publications Over Time</h3>
      <ResponsiveContainer width='100%' height={240}>
        <BarChart data={series}>
          <XAxis dataKey='date' tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <Bar key={cat} dataKey={cat} stackId='a' fill={color} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PublicationsOverTime
