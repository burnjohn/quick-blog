import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useAnalyticsCommentActivity } from '../../../../hooks'

function CommentActivity({ filterParams }) {
  const { series, loading, error, refetch } = useAnalyticsCommentActivity(filterParams)

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
      <h3 className='text-sm font-semibold text-gray-600 mb-4'>Comment Activity</h3>
      <ResponsiveContainer width='100%' height={240}>
        <BarChart data={series}>
          <XAxis dataKey='date' tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey='approved' fill='#22c55e' name='Approved' />
          <Bar dataKey='pending' fill='#f97316' name='Pending' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CommentActivity
