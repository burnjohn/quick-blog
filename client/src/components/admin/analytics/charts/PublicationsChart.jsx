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
import { CATEGORY_COLORS, CATEGORY_ORDER } from '../constants'

const numberFormatter = new Intl.NumberFormat('en-US')
const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })
const formatMonth = (value) => {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? String(value) : monthFormatter.format(d)
}

function PublicationsTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((sum, item) => sum + (item.value ?? 0), 0)
  return (
    <div className='rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow'>
      <p className='mb-1 font-medium text-gray-900'>{formatMonth(label)}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className='text-gray-600' style={{ color: item.color }}>
          {item.dataKey}: <span className='font-semibold'>{numberFormatter.format(item.value ?? 0)}</span>
        </p>
      ))}
      <p className='mt-1 border-t border-gray-100 pt-1 text-gray-700'>
        Total: <span className='font-semibold'>{numberFormatter.format(total)}</span>
      </p>
    </div>
  )
}

function PublicationsChart({ data }) {
  const hasData = Array.isArray(data) && data.length > 0

  return (
    <Card className='p-5'>
      <h3 className='mb-4 text-sm font-semibold text-gray-900'>Publications by Category</h3>
      {!hasData ? (
        <div className='flex h-[300px] items-center justify-center text-sm text-gray-500'>
          No publications data available
        </div>
      ) : (
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
            <XAxis dataKey='date' stroke='#9ca3af' fontSize={12} tickFormatter={formatMonth} />
            <YAxis stroke='#9ca3af' fontSize={12} allowDecimals={false} />
            <Tooltip content={<PublicationsTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {CATEGORY_ORDER.map((category) => (
              <Bar
                key={category}
                dataKey={category}
                stackId='publications'
                fill={CATEGORY_COLORS[category]}
                radius={[0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}

export default PublicationsChart
