import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../../../ui/Card'
import { COMMENT_COLORS } from '../constants'

const numberFormatter = new Intl.NumberFormat('en-US')
const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })
const formatMonth = (value) => {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? String(value) : monthFormatter.format(d)
}

function CommentsTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className='rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow'>
      <p className='mb-1 font-medium text-gray-900'>{formatMonth(label)}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className='capitalize' style={{ color: item.color }}>
          {item.dataKey}:{' '}
          <span className='font-semibold'>{numberFormatter.format(item.value ?? 0)}</span>
        </p>
      ))}
    </div>
  )
}

function CommentActivityChart({ data }) {
  const hasData = Array.isArray(data) && data.length > 0

  return (
    <Card className='p-5'>
      <h3 className='mb-4 text-sm font-semibold text-gray-900'>Comment Activity</h3>
      {!hasData ? (
        <div className='flex h-[300px] items-center justify-center text-sm text-gray-500'>
          No comment activity for selected period
        </div>
      ) : (
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
            <XAxis dataKey='date' stroke='#9ca3af' fontSize={12} tickFormatter={formatMonth} />
            <YAxis stroke='#9ca3af' fontSize={12} allowDecimals={false} />
            <Tooltip content={<CommentsTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey='approved' fill={COMMENT_COLORS.approved} radius={[4, 4, 0, 0]} />
            <Bar dataKey='pending' fill={COMMENT_COLORS.pending} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}

export default CommentActivityChart
