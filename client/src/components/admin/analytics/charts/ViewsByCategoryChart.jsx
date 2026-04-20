import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../../../ui/Card'
import { CATEGORY_COLORS } from '../constants'

const numberFormatter = new Intl.NumberFormat('en-US')

function ViewsByCategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { category, views } = payload[0].payload
  return (
    <div className='rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow'>
      <p className='font-medium text-gray-900'>{category}</p>
      <p className='text-gray-600'>
        Views:{' '}
        <span className='font-semibold text-gray-900'>{numberFormatter.format(views ?? 0)}</span>
      </p>
    </div>
  )
}

function ViewsByCategoryChart({ data }) {
  const hasData = Array.isArray(data) && data.length > 0
  const sorted = hasData ? [...data].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)) : []

  return (
    <Card className='p-5'>
      <h3 className='mb-4 text-sm font-semibold text-gray-900'>Views by Category</h3>
      {!hasData ? (
        <div className='flex h-[300px] items-center justify-center text-sm text-gray-500'>
          No category views available
        </div>
      ) : (
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={sorted}
            layout='vertical'
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' horizontal={false} />
            <XAxis
              type='number'
              stroke='#9ca3af'
              fontSize={12}
              allowDecimals={false}
              tickFormatter={(value) => numberFormatter.format(value)}
            />
            <YAxis
              type='category'
              dataKey='category'
              stroke='#9ca3af'
              fontSize={12}
              width={90}
            />
            <Tooltip content={<ViewsByCategoryTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <Bar dataKey='views' radius={[0, 4, 4, 0]}>
              {sorted.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLORS[entry.category] || '#9ca3af'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}

export default ViewsByCategoryChart
