import React, { useId } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useReducedMotion } from 'motion/react'
import ChartCard from '../ChartCard'
import ChartActions from '../ChartActions'
import ChartTooltip from '../ChartTooltip'
import { formatCompact, formatNumber } from '../../../../utils/analyticsFormat'

const MAX_TAGS_SHOWN = 12

function TagsBarChart({ tags = [], onSelectTag, selectedTags = [] }) {
  const reduceMotion = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const data = tags.slice(0, MAX_TAGS_SHOWN)
  const hasSelection = selectedTags.length > 0
  const actionable = typeof onSelectTag === 'function'

  const table = (
    <table className='sr-only'>
      <caption>Views by tag</caption>
      <thead>
        <tr><th scope='col'>Tag</th><th scope='col'>Views</th><th scope='col'>Posts</th></tr>
      </thead>
      <tbody>
        {data.map((t) => (
          <tr key={t.key}><th scope='row'>{t.key}</th><td>{formatNumber(t.views)}</td><td>{formatNumber(t.posts)}</td></tr>
        ))}
      </tbody>
    </table>
  )

  const alternative = (
    <>
      {table}
      <ChartActions
        label='Filter by tag'
        items={data.map((t) => ({ key: t.key, label: t.key, value: `${formatNumber(t.views)} views` }))}
        onSelect={onSelectTag}
        selected={selectedTags}
      />
    </>
  )

  return (
    <ChartCard
      title='Views by tag'
      subtitle={actionable ? 'Click a bar to filter' : undefined}
      description={`Top ${data.length} tags by views.`}
      alternative={alternative}
    >
      <div aria-hidden='true' className='h-72 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`${uid}-bar`} x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#8b8cff' stopOpacity={1} />
                <stop offset='100%' stopColor='#22d3ee' stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke='rgba(255,255,255,0.05)' />
            <XAxis dataKey='key' stroke='transparent' tick={{ fill: '#a6a6c0', fontSize: 11 }} interval={0} />
            <YAxis tickFormatter={formatCompact} stroke='transparent' tick={{ fill: '#a6a6c0', fontSize: 11 }} width={44} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.06)' }} />
            <Bar
              dataKey='views'
              name='Views'
              radius={[8, 8, 0, 0]}
              isAnimationActive={!reduceMotion}
              onClick={(entry) => onSelectTag?.(entry?.key ?? entry?.payload?.key)}
              className={actionable ? 'cursor-pointer' : undefined}
            >
              {data.map((t) => (
                <Cell
                  key={t.key}
                  fill={`url(#${uid}-bar)`}
                  fillOpacity={hasSelection && !selectedTags.includes(t.key) ? 0.3 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export default TagsBarChart
