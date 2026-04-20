import React from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import Card from '../../../ui/Card'
import { CATEGORY_COLORS } from '../constants'

const numberFormatter = new Intl.NumberFormat('en-US')

function DistributionTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
  return (
    <div className='rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow'>
      <p className='font-medium text-gray-900'>{name}</p>
      <p className='text-gray-600'>
        Count: <span className='font-semibold text-gray-900'>{numberFormatter.format(value ?? 0)}</span>
      </p>
      <p className='text-gray-600'>
        Percentage: <span className='font-semibold text-gray-900'>{percentage}%</span>
      </p>
    </div>
  )
}

function CategoryDistributionChart({ data, onCategoryClick }) {
  const hasData = Array.isArray(data) && data.length > 0
  const total = hasData ? data.reduce((sum, item) => sum + (item.value ?? 0), 0) : 0

  const handleSliceClick = (entry) => {
    if (onCategoryClick && entry?.name) {
      onCategoryClick(entry.name)
    }
  }

  return (
    <Card className='p-5'>
      <h3 className='mb-4 text-sm font-semibold text-gray-900'>Category Distribution</h3>
      {!hasData ? (
        <div className='flex h-[300px] items-center justify-center text-sm text-gray-500'>
          No category data available
        </div>
      ) : (
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey='value'
              nameKey='name'
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              onClick={handleSliceClick}
              cursor='pointer'
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLORS[entry.name] || '#9ca3af'}
                />
              ))}
            </Pie>
            <Tooltip content={<DistributionTooltip total={total} />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}

export default CategoryDistributionChart
