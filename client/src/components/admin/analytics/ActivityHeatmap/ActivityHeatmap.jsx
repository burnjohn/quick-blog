import React, { useRef, useState } from 'react'
import ChartCard from '../ChartCard'
import { formatNumber } from '../../../../utils/analyticsFormat'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const HOURS = Array.from({ length: 24 }, (_, h) => h)
// Level 0 = no views, 1..5 = quantized intensity
const LEVEL_CLASSES = [
  'bg-white/5',
  'bg-accent-violet/20',
  'bg-accent-violet/35',
  'bg-accent-violet/50',
  'bg-accent-violet/70',
  'bg-accent-violet/90'
]

const pad = (h) => String(h).padStart(2, '0')
const levelOf = (value, max) => (value > 0 && max > 0 ? Math.min(5, Math.max(1, Math.ceil((value / max) * 5))) : 0)

function ActivityHeatmap({ heatmap }) {
  const rows = heatmap?.cells ?? []
  const max = heatmap?.max ?? Math.max(0, ...rows.flat())
  const [focus, setFocus] = useState({ d: 0, h: 0 })
  const [active, setActive] = useState(null)
  const gridRef = useRef(null)

  const cellLabel = (d, h) => `${DAYS[d]} ${pad(h)}:00 UTC — ${formatNumber(rows[d]?.[h] ?? 0)} views`

  const moveTo = (d, h) => {
    setFocus({ d, h })
    setActive({ d, h })
    gridRef.current?.querySelector(`[data-cell='${d}-${h}']`)?.focus()
  }

  const onKeyDown = (event, d, h) => {
    const moves = {
      ArrowRight: [d, Math.min(23, h + 1)],
      ArrowLeft: [d, Math.max(0, h - 1)],
      ArrowDown: [Math.min(6, d + 1), h],
      ArrowUp: [Math.max(0, d - 1), h],
      Home: [d, 0],
      End: [d, 23]
    }
    const next = moves[event.key]
    if (!next) return
    event.preventDefault()
    moveTo(...next)
  }

  const total = rows.flat().reduce((sum, v) => sum + v, 0)

  return (
    <ChartCard
      title='Activity by hour'
      subtitle='Times in UTC'
      description={`Views by day of week and hour (UTC). ${formatNumber(total)} views in total.`}
    >
      <p
        role='status'
        className='mb-2 min-h-5 font-mono text-xs text-ink-text'
      >
        {active ? cellLabel(active.d, active.h) : ''}
      </p>
      <div className='overflow-x-auto pb-2'>
        <div ref={gridRef} role='grid' aria-label='Activity heatmap, times in UTC' aria-rowcount={7} aria-colcount={24} className='min-w-160 space-y-1'>
          <div role='row' className='flex items-center gap-1'>
            <span role='columnheader' className='w-10 shrink-0'><span className='sr-only'>Day</span></span>
            {HOURS.map((h) => (
              <span key={h} role='columnheader' className='flex-1 text-center font-mono text-[10px] text-ink-muted'>
                {h % 3 === 0 ? pad(h) : <span className='sr-only'>{pad(h)}</span>}
              </span>
            ))}
          </div>
          {DAYS.map((day, d) => (
            <div key={day} role='row' className='flex items-center gap-1'>
              <span role='rowheader' className='w-10 shrink-0 text-xs text-ink-muted'>
                <span aria-hidden='true'>{day.slice(0, 3)}</span>
                <span className='sr-only'>{day}</span>
              </span>
              {HOURS.map((h) => {
                const value = rows[d]?.[h] ?? 0
                const isFocus = focus.d === d && focus.h === h
                return (
                  <div
                    key={h}
                    role='gridcell'
                    data-cell={`${d}-${h}`}
                    data-level={levelOf(value, max)}
                    tabIndex={isFocus ? 0 : -1}
                    aria-label={cellLabel(d, h)}
                    onKeyDown={(e) => onKeyDown(e, d, h)}
                    onFocus={() => { setFocus({ d, h }); setActive({ d, h }) }}
                    onBlur={() => setActive(null)}
                    onMouseEnter={() => setActive({ d, h })}
                    onMouseLeave={() => setActive(null)}
                    className={`aspect-square flex-1 rounded-sm outline-none transition hover:ring-2 hover:ring-accent-cyan focus-visible:ring-2 focus-visible:ring-accent-cyan ${LEVEL_CLASSES[levelOf(value, max)]}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className='mt-3 flex items-center gap-2 text-xs text-ink-muted' data-testid='heatmap-legend'>
        <span>Less</span>
        <ul className='flex gap-1'>
          {LEVEL_CLASSES.map((cls, i) => (
            <li key={cls} data-level={i} className={`h-3 w-5 rounded-sm ${cls}`} />
          ))}
        </ul>
        <span>More</span>
        <span className='ml-auto'>Max {formatNumber(max)} views / hour</span>
      </div>
    </ChartCard>
  )
}

export default ActivityHeatmap
