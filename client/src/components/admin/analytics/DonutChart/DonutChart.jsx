import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useReducedMotion } from 'motion/react'
import ChartCard from '../ChartCard'
import ChartActions from '../ChartActions'
import ChartTooltip from '../ChartTooltip'
import { CHART_COLORS } from '../../../../constants/analytics'
import { formatNumber, formatPercent } from '../../../../utils/analyticsFormat'

function DonutChart({ title, description, data = [], labels = {}, onSelect, selected = [] }) {
  const reduceMotion = useReducedMotion()
  const rows = data.map((d, i) => ({ ...d, name: labels[d.key] ?? d.key, color: CHART_COLORS[i % CHART_COLORS.length] }))
  const total = rows.reduce((sum, r) => sum + r.views, 0)
  const hasSelection = selected.length > 0

  const alternative = (
    <>
      <table className='sr-only'>
        <caption>{title}</caption>
        <thead>
          <tr><th scope='col'>Name</th><th scope='col'>Views</th><th scope='col'>Share</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}><th scope='row'>{r.name}</th><td>{formatNumber(r.views)}</td><td>{formatPercent(r.share * 100)}</td></tr>
          ))}
        </tbody>
      </table>
      <ChartActions
        label={`Filter by ${title.toLowerCase()}`}
        items={rows.map((r) => ({ key: r.key, label: r.name, value: formatPercent(r.share * 100) }))}
        onSelect={onSelect}
        selected={selected}
      />
    </>
  )

  return (
    <ChartCard title={title} description={description} alternative={alternative}>
      <div className='flex flex-col items-center gap-4 sm:flex-row'>
        <div aria-hidden='true' className='relative h-48 w-48 shrink-0'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Tooltip content={<ChartTooltip />} />
              <Pie
                data={rows}
                dataKey='views'
                nameKey='name'
                innerRadius='65%'
                outerRadius='95%'
                paddingAngle={2}
                cornerRadius={6}
                stroke='none'
                isAnimationActive={!reduceMotion}
                onClick={(entry) => onSelect?.(entry?.key ?? entry?.payload?.key)}
                className={onSelect ? 'cursor-pointer' : undefined}
              >
                {rows.map((r) => (
                  <Cell key={r.key} fill={r.color} fillOpacity={hasSelection && !selected.includes(r.key) ? 0.3 : 1} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
            <span className='font-mono text-xl text-ink-text'>{formatNumber(total)}</span>
            <span className='text-xs text-ink-muted'>views</span>
          </div>
        </div>
        <ul className='w-full space-y-2 text-sm' data-testid='donut-legend'>
          {rows.map((r) => (
            <li key={r.key} className='flex items-center justify-between gap-3'>
              <span className='flex items-center gap-2 text-ink-text'>
                <svg width='10' height='10' aria-hidden='true'><circle cx='5' cy='5' r='5' fill={r.color} /></svg>
                {r.name}
              </span>
              <span className='font-mono text-ink-muted'>{formatPercent(r.share * 100)}</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  )
}

export default DonutChart
