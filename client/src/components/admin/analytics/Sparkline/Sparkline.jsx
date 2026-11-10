import React, { useId } from 'react'
import { Area, AreaChart } from 'recharts'

// Decorative mini trend: fixed size, no axes, hidden from assistive tech.
function Sparkline({ data, color = '#8b8cff', width = 120, height = 40 }) {
  const gradientId = `spark-${useId().replace(/:/g, '')}`
  if (!data || data.length < 2) return null
  return (
    <div aria-hidden='true' data-testid='sparkline' className='shrink-0'>
      <AreaChart width={width} height={height} data={data} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor={color} stopOpacity={0.5} />
            <stop offset='100%' stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type='monotone'
          dataKey='value'
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          isAnimationActive={false}
          dot={false}
        />
      </AreaChart>
    </div>
  )
}

export default Sparkline
