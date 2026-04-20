import React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../../../ui/Card'
import { PRIMARY_COLOR } from '../constants'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})
const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})
const numberFormatter = new Intl.NumberFormat('en-US')

function formatAxisDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return shortDateFormatter.format(date)
}

function ViewsTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { date, views } = payload[0].payload
  const parsed = new Date(date)
  const label = Number.isNaN(parsed.getTime()) ? date : dateFormatter.format(parsed)
  return (
    <div className='rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow'>
      <p className='font-medium text-gray-900'>{label}</p>
      <p className='text-gray-600'>
        Views: <span className='font-semibold text-gray-900'>{numberFormatter.format(views ?? 0)}</span>
      </p>
    </div>
  )
}

function ViewsOverTimeChart({ data, onPointClick, loading }) {
  return (
    <Card className='p-5'>
      <h3 className='mb-4 text-sm font-semibold text-gray-900'>Views Over Time</h3>
      {loading ? (
        <div className='h-[300px] w-full animate-pulse rounded-md bg-gray-100' />
      ) : !data || data.length === 0 ? (
        <div className='flex h-[300px] items-center justify-center text-sm text-gray-500'>
          No views data for selected period
        </div>
      ) : (
        <ResponsiveContainer width='100%' height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            onClick={(state) => {
              if (onPointClick && state?.activePayload?.[0]?.payload?.date) {
                onPointClick(state.activePayload[0].payload.date)
              }
            }}
          >
            <defs>
              <linearGradient id='viewsGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor={PRIMARY_COLOR} stopOpacity={0.35} />
                <stop offset='95%' stopColor={PRIMARY_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
            <XAxis
              dataKey='date'
              tickFormatter={formatAxisDate}
              stroke='#9ca3af'
              fontSize={12}
            />
            <YAxis stroke='#9ca3af' fontSize={12} allowDecimals={false} />
            <Tooltip content={<ViewsTooltip />} />
            <Area
              type='monotone'
              dataKey='views'
              stroke={PRIMARY_COLOR}
              strokeWidth={2}
              fill='url(#viewsGradient)'
              activeDot={{ r: 5, style: { cursor: 'pointer' } }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}

export default ViewsOverTimeChart
