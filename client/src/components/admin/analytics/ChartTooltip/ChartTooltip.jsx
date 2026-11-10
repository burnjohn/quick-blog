import React from 'react'
import { formatDate, formatNumber } from '../../../../utils/analyticsFormat'

// Recharts `content` renderer: glass tooltip with exact en-US values.
// `isDate` formats the label ('YYYY-MM-DD') as a date; otherwise `labelMap` or the raw label is used.
function ChartTooltip({ active, payload, label, isDate = false, labelMap, bucket }) {
  if (!active || !payload || payload.length === 0) return null
  const first = payload[0]
  const rawLabel = label ?? first?.payload?.key ?? first?.name
  let heading = labelMap?.[rawLabel] ?? rawLabel
  if (isDate) {
    heading = formatDate(rawLabel)
    if (bucket === 'week') heading = `Week of ${heading}`
  }

  return (
    <div
      role='presentation'
      className='min-w-40 rounded-xl border border-white/10 bg-ink-900/90 px-3 py-2 text-xs shadow-xl shadow-black/40 backdrop-blur-md'
    >
      <p className='mb-1 font-display text-ink-muted'>{heading}</p>
      <ul className='space-y-1'>
        {payload.map((item) => (
          <li key={item.dataKey ?? item.name} className='flex items-center justify-between gap-4'>
            <span className='flex items-center gap-2 text-ink-text'>
              <svg width='8' height='8' aria-hidden='true'>
                <circle cx='4' cy='4' r='4' fill={item.color || item.payload?.fill || item.fill || '#8b8cff'} />
              </svg>
              {item.name}
            </span>
            <span className='font-mono text-ink-text'>{formatNumber(item.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChartTooltip
