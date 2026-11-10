import React from 'react'
import { classNames } from '../../../../utils/helpers'

// Legend whose items are toggle buttons. `hidden` is an array of hidden keys.
function ChartLegend({ items, hidden = [], onToggle, className }) {
  return (
    <ul className={classNames('flex flex-wrap items-center gap-2', className)}>
      {items.map((item) => {
        const visible = !hidden.includes(item.key)
        return (
          <li key={item.key}>
            <button
              type='button'
              aria-pressed={visible}
              onClick={() => onToggle?.(item.key)}
              className={classNames(
                'flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition focus-visible:outline-2 focus-visible:outline-accent-cyan',
                visible
                  ? 'border-white/20 bg-white/10 text-ink-text'
                  : 'border-white/5 text-ink-muted line-through opacity-60'
              )}
            >
              <svg width='16' height='4' aria-hidden='true'>
                <line
                  x1='0' y1='2' x2='16' y2='2'
                  stroke={item.color}
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeDasharray={item.dashed ? '3 3' : undefined}
                />
              </svg>
              {item.label}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default ChartLegend
