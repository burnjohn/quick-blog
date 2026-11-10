import React from 'react'
import { DELTA_COLORS } from '../../../../constants/analytics'
import { formatPercent } from '../../../../utils/analyticsFormat'
import { classNames } from '../../../../utils/helpers'

const ARROWS = { up: '↑', down: '↓', flat: '→', new: '✦' }

const describeDelta = (delta) => {
  if (!delta) return null
  const { direction, percent } = delta
  if (direction === 'new') return 'New vs previous period'
  if (direction === 'flat') return 'No change'
  const sign = direction === 'up' ? '+' : '-'
  return `${sign}${formatPercent(Math.abs(percent ?? 0))} vs previous period`
}

// Direction is conveyed by arrow + text, never by color alone.
function DeltaBadge({ delta }) {
  const text = describeDelta(delta)
  if (!text) return null
  return (
    <span
      data-direction={delta.direction}
      className={classNames(
        'inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-0.5 text-xs font-medium tabular-nums',
        DELTA_COLORS[delta.direction]
      )}
    >
      <span aria-hidden='true'>{ARROWS[delta.direction]}</span>
      {text}
    </span>
  )
}

export default DeltaBadge
