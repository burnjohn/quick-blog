import React, { useId } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useReducedMotion } from 'motion/react'
import ChartCard from '../ChartCard'
import ChartActions from '../ChartActions'
import ChartTooltip from '../ChartTooltip'
import { formatCompact, formatNumber } from '../../../../utils/analyticsFormat'

const TOP = 10
const truncate = (text, max = 22) => (text.length > max ? `${text.slice(0, max - 1)}…` : text)

function TopPostsBarChart({ posts = [], onOpenPost }) {
  const reduceMotion = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const data = [...posts].sort((a, b) => b.views - a.views).slice(0, TOP).map((p) => ({ id: p.id, key: p.title, title: p.title, views: p.views }))

  const alternative = (
    <>
      <table className='sr-only'>
        <caption>Top posts by views</caption>
        <thead>
          <tr><th scope='col'>Post</th><th scope='col'>Views</th></tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.id}><th scope='row'>{p.title}</th><td>{formatNumber(p.views)}</td></tr>
          ))}
        </tbody>
      </table>
      <ChartActions
        label='Open post details'
        items={data.map((p) => ({ key: p.id, label: p.title, value: `${formatNumber(p.views)} views` }))}
        onSelect={onOpenPost}
      />
    </>
  )

  return (
    <ChartCard
      title='Top posts'
      subtitle={onOpenPost ? 'Click a bar for post details' : undefined}
      description={`Top ${data.length} posts by views.`}
      alternative={alternative}
    >
      <div aria-hidden='true' className='h-80 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart accessibilityLayer={false} data={data} layout='vertical' margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`${uid}-bar`} x1='0' y1='0' x2='1' y2='0'>
                <stop offset='0%' stopColor='#f472b6' stopOpacity={0.5} />
                <stop offset='100%' stopColor='#8b8cff' stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid horizontal={false} stroke='rgba(255,255,255,0.05)' />
            <XAxis type='number' tickFormatter={formatCompact} stroke='transparent' tick={{ fill: '#a6a6c0', fontSize: 11 }} />
            <YAxis type='category' dataKey='title' tickFormatter={truncate} stroke='transparent' tick={{ fill: '#a6a6c0', fontSize: 11 }} width={140} interval={0} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.06)' }} />
            <Bar
              dataKey='views'
              name='Views'
              fill={`url(#${uid}-bar)`}
              radius={[0, 8, 8, 0]}
              isAnimationActive={!reduceMotion}
              onClick={(entry) => onOpenPost?.(entry?.id ?? entry?.payload?.id)}
              className={onOpenPost ? 'cursor-pointer' : undefined}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export default TopPostsBarChart
