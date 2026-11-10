import React, { useEffect, useState } from 'react'
import { PERIOD_PRESETS, PERIOD_CUSTOM } from '../../../../constants/analytics'
import { classNames } from '../../../../utils/helpers'

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet'
const SEGMENT = 'min-h-10 rounded-lg px-3 text-sm font-medium transition'
const DATE_INPUT = `min-h-10 rounded-lg border border-white/10 bg-ink-800 px-2 text-sm text-ink-text [color-scheme:dark] ${FOCUS_RING}`

function PeriodPicker({ period, from, to, dateBounds, onPeriodChange, onCustomRange }) {
  const isCustom = period === PERIOD_CUSTOM
  const [showCustom, setShowCustom] = useState(isCustom)
  const [draftFrom, setDraftFrom] = useState(from || '')
  const [draftTo, setDraftTo] = useState(to || '')

  useEffect(() => {
    setDraftFrom(from || '')
    setDraftTo(to || '')
    if (period === PERIOD_CUSTOM) setShowCustom(true)
  }, [from, to, period])

  const invalidOrder = Boolean(draftFrom && draftTo && draftFrom > draftTo)
  const canApply = Boolean(draftFrom && draftTo) && !invalidOrder

  const segment = (active) =>
    classNames(
      SEGMENT,
      FOCUS_RING,
      active ? 'bg-accent-violet text-ink-950 shadow shadow-accent-violet/30' : 'text-ink-text hover:bg-white/10'
    )

  return (
    <div className='flex flex-wrap items-start gap-2'>
      <div role='group' aria-label='Period' className='flex max-w-full flex-wrap gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur'>
        {PERIOD_PRESETS.map((preset) => (
          <button
            key={preset.key}
            type='button'
            aria-pressed={period === preset.key}
            onClick={() => {
              setShowCustom(false)
              onPeriodChange(preset.key)
            }}
            className={segment(period === preset.key)}
          >
            {preset.label}
          </button>
        ))}
        <button
          type='button'
          aria-pressed={isCustom}
          aria-expanded={showCustom}
          onClick={() => setShowCustom((value) => !value)}
          className={segment(isCustom)}
        >
          Custom
        </button>
      </div>
      {showCustom && (
        <div className='flex flex-wrap items-center gap-2'>
          <input
            type='date'
            aria-label='From date'
            value={draftFrom}
            min={dateBounds?.min || undefined}
            max={dateBounds?.max || undefined}
            onChange={(event) => setDraftFrom(event.target.value)}
            aria-invalid={invalidOrder}
            aria-describedby={invalidOrder ? 'period-range-error' : undefined}
            className={DATE_INPUT}
          />
          <input
            type='date'
            aria-label='To date'
            value={draftTo}
            min={dateBounds?.min || undefined}
            max={dateBounds?.max || undefined}
            onChange={(event) => setDraftTo(event.target.value)}
            aria-invalid={invalidOrder}
            aria-describedby={invalidOrder ? 'period-range-error' : undefined}
            className={DATE_INPUT}
          />
          <button
            type='button'
            disabled={!canApply}
            onClick={() => onCustomRange(draftFrom, draftTo)}
            className={classNames(
              SEGMENT,
              FOCUS_RING,
              'bg-gradient-to-r from-accent-violet to-accent-cyan text-ink-950 disabled:cursor-not-allowed disabled:opacity-40'
            )}
          >
            Apply
          </button>
          {invalidOrder && (
            <p id='period-range-error' role='alert' className='w-full text-sm text-rose-300'>
              From date must be on or before To date.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default PeriodPicker
