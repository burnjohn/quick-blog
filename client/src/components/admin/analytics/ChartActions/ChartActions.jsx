import React from 'react'
import { classNames } from '../../../../utils/helpers'

// Keyboard equivalent of clicking chart bars/segments. Visually hidden until focused.
// items: [{ key, label, value (formatted string) }]
function ChartActions({ label, items, onSelect, selected = [] }) {
  if (!onSelect || items.length === 0) return null
  return (
    <div
      role='group'
      aria-label={label}
      className='sr-only focus-within:not-sr-only focus-within:mt-3 focus-within:flex focus-within:flex-wrap focus-within:gap-2'
    >
      {items.map((item) => {
        const active = selected.includes(item.key)
        return (
          <button
            key={item.key}
            type='button'
            aria-pressed={active}
            onClick={() => onSelect(item.key)}
            className={classNames(
              'rounded-full border px-3 py-1 text-xs text-ink-text focus-visible:outline-2 focus-visible:outline-accent-cyan',
              active ? 'border-accent-violet bg-accent-violet/20' : 'border-white/10 bg-white/5'
            )}
          >
            {item.label}{item.value ? ` — ${item.value}` : ''}
          </button>
        )
      })}
    </div>
  )
}

export default ChartActions
