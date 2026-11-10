import React from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getBlogDetailPath } from '../../../../constants/routes'
import { KPI_META, SOURCE_LABELS, DEVICE_LABELS, DELTA_COLORS, SERIES_COLORS } from '../../../../constants/analytics'
import { widthClass } from '../../../../utils/widthClass'
import { formatByType, formatDate, formatNumber, formatPercent } from '../../../../utils/analyticsFormat'

const ARROWS = { up: '▲', down: '▼', flat: '–', new: '●' }

function Delta({ delta }) {
  if (!delta) return null
  const text = delta.direction === 'new' ? 'New' : formatPercent(Math.abs(delta.percent ?? 0))
  return (
    <span className={`text-xs ${DELTA_COLORS[delta.direction] || DELTA_COLORS.flat}`}>
      <span aria-hidden='true'>{ARROWS[delta.direction]} </span>
      {text}
      <span className='sr-only'> {delta.direction}</span>
    </span>
  )
}

function ShareList({ title, items = [], labels }) {
  return (
    <section>
      <h3 className='mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted'>{title}</h3>
      <ul className='space-y-2'>
        {items.map((item) => (
          <li key={item.key} className='text-sm text-ink-text'>
            <div className='flex justify-between'>
              <span>{labels[item.key] || item.key}</span>
              <span className='font-mono text-ink-muted'>
                {formatNumber(item.views)} · {formatPercent((item.share || 0) * 100, 0)}
              </span>
            </div>
            <div className='mt-1 h-1.5 overflow-hidden rounded-full bg-white/10'>
              <div
                className={`h-full rounded-full bg-accent-violet ${widthClass(item.share || 0, 1)}`}
                role='presentation'
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function PostDetailContent({ post, titleId }) {
  const kpis = post.kpis || []
  const series = post.series || []
  return (
    <div className='space-y-6'>
      <header className='pr-10'>
        <h2 id={titleId} className='font-display text-2xl font-semibold text-ink-text'>
          {post.title}
        </h2>
        <div className='mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-muted'>
          {post.category && (
            <span className='rounded-full bg-accent-violet/20 px-2 py-0.5 text-accent-violet'>{post.category}</span>
          )}
          {(post.tags || []).map((tag) => (
            <span key={tag} className='rounded-full bg-white/10 px-2 py-0.5'>#{tag}</span>
          ))}
          {post.author?.name && <span>By {post.author.name}</span>}
          {post.publishedAt && <span>Published {formatDate(post.publishedAt)}</span>}
        </div>
      </header>

      <dl className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
        {KPI_META.map((meta) => {
          const kpi = kpis.find((k) => k.key === meta.key)
          return (
            <div key={meta.key} className='rounded-2xl border border-white/10 bg-white/5 p-3'>
              <dt className='text-xs text-ink-muted'>{meta.label}</dt>
              <dd className='font-mono text-lg text-ink-text'>{formatByType(kpi?.value, meta.format)}</dd>
              <Delta delta={kpi?.delta} />
            </div>
          )
        })}
      </dl>

      <section aria-label='Views trend' className='h-40'>
        <ResponsiveContainer width='100%' height='100%' minWidth={0}>
          <AreaChart data={series} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <XAxis dataKey='date' tick={{ fill: '#a6a6c0', fontSize: 10 }} tickFormatter={(d) => formatDate(d, { month: 'short', day: 'numeric' })} minTickGap={24} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: '#11111f', border: '1px solid #26263d', borderRadius: 12 }}
              labelFormatter={(d) => formatDate(d)}
            />
            <Area type='monotone' dataKey='views' name='Views' stroke={SERIES_COLORS.views} fill={SERIES_COLORS.views} fillOpacity={0.25} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      <div className='grid gap-6 sm:grid-cols-2'>
        <ShareList title='Traffic sources' items={post.sources} labels={SOURCE_LABELS} />
        <ShareList title='Devices' items={post.devices} labels={DEVICE_LABELS} />
      </div>

      <a
        href={getBlogDetailPath(post.id)}
        target='_blank'
        rel='noopener noreferrer'
        className='inline-block rounded-full bg-accent-violet px-5 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-accent-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan'
      >
        Open post
      </a>
    </div>
  )
}

export default PostDetailContent
