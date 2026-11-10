import React, { useId, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useReducedMotion } from 'motion/react'
import ChartCard from '../ChartCard'
import ChartLegend from '../ChartLegend'
import ChartTooltip from '../ChartTooltip'
import { SERIES_COLORS } from '../../../../constants/analytics'
import { formatCompact, formatDate, formatNumber } from '../../../../utils/analyticsFormat'

const SERIES = [
  { key: 'views', label: 'Views', color: SERIES_COLORS.views, prev: 'previousViews' },
  { key: 'uniqueVisitors', label: 'Unique visitors', color: SERIES_COLORS.uniqueVisitors, prev: 'previousUniqueVisitors' }
]

function TrendChart({ series = [], bucket = 'day', compare = false }) {
  const reduceMotion = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const [hidden, setHidden] = useState([])
  const toggle = (key) => setHidden((h) => (h.includes(key) ? h.filter((k) => k !== key) : [...h, key]))

  const legendItems = SERIES.flatMap((s) => [
    { key: s.key, label: s.label, color: s.color },
    ...(compare ? [{ key: s.prev, label: `${s.label} (previous)`, color: SERIES_COLORS.previous, dashed: true }] : [])
  ])
  const total = series.reduce((sum, p) => sum + (p.views || 0), 0)
  const description = `${series.length} ${bucket === 'week' ? 'weeks' : 'days'} of data, ${formatNumber(total)} views in total.`
  const tickFormat = (d) => formatDate(d, { month: 'short', day: 'numeric' })

  const table = (
    <table className='sr-only'>
      <caption>Views and unique visitors per {bucket}</caption>
      <thead>
        <tr>
          <th scope='col'>{bucket === 'week' ? 'Week of' : 'Date'}</th>
          <th scope='col'>Views</th>
          <th scope='col'>Unique visitors</th>
          {compare && <th scope='col'>Previous views</th>}
          {compare && <th scope='col'>Previous unique visitors</th>}
        </tr>
      </thead>
      <tbody>
        {series.map((p) => (
          <tr key={p.date}>
            <th scope='row'>{formatDate(p.date)}</th>
            <td>{formatNumber(p.views)}</td>
            <td>{formatNumber(p.uniqueVisitors)}</td>
            {compare && <td>{formatNumber(p.previousViews)}</td>}
            {compare && <td>{formatNumber(p.previousUniqueVisitors)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <ChartCard
      title='Traffic trend'
      subtitle={`Per ${bucket}`}
      description={description}
      actions={<ChartLegend items={legendItems} hidden={hidden} onToggle={toggle} />}
      alternative={table}
    >
      <div aria-hidden='true' className='h-72 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              {SERIES.map((s) => (
                <linearGradient key={s.key} id={`${uid}-${s.key}`} x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor={s.color} stopOpacity={0.5} />
                  <stop offset='100%' stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} stroke='rgba(255,255,255,0.05)' />
            <XAxis dataKey='date' tickFormatter={tickFormat} stroke='transparent' tick={{ fill: '#a6a6c0', fontSize: 11 }} minTickGap={24} />
            <YAxis tickFormatter={formatCompact} stroke='transparent' tick={{ fill: '#a6a6c0', fontSize: 11 }} width={44} />
            <Tooltip content={<ChartTooltip isDate bucket={bucket} />} cursor={{ stroke: 'rgba(255,255,255,0.2)' }} />
            {SERIES.map((s) => !hidden.includes(s.key) && (
              <Area
                key={s.key}
                type='monotone'
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#${uid}-${s.key})`}
                isAnimationActive={!reduceMotion}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            ))}
            {compare && SERIES.map((s) => !hidden.includes(s.prev) && (
              <Area
                key={s.prev}
                type='monotone'
                dataKey={s.prev}
                name={`${s.label} (previous)`}
                stroke={SERIES_COLORS.previous}
                strokeDasharray='4 4'
                strokeWidth={1.5}
                fill='none'
                isAnimationActive={!reduceMotion}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export default TrendChart
