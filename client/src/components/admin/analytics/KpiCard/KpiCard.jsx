import React, { useEffect, useState } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import DeltaBadge from '../DeltaBadge'
import Sparkline from '../Sparkline'
import { formatByType } from '../../../../utils/analyticsFormat'

const COUNT_UP_SECONDS = 0.9

// Eases 0 -> value; with reduced motion the final value is shown immediately.
const useCountUp = (value, reduceMotion) => {
  const [shown, setShown] = useState(reduceMotion ? value : 0)

  useEffect(() => {
    if (reduceMotion) {
      setShown(value)
      return undefined
    }
    const controls = animate(0, value, {
      duration: COUNT_UP_SECONDS,
      ease: 'easeOut',
      onUpdate: setShown,
    })
    return () => controls.stop()
  }, [value, reduceMotion])

  return reduceMotion ? value : shown
}

function KpiCard({ kpi, label, format = 'number', compare = true }) {
  const reduceMotion = useReducedMotion()
  const value = kpi?.value ?? 0
  const shown = useCountUp(value, reduceMotion)

  return (
    <article
      aria-label={label}
      className='group flex min-w-0 flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-black/20 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-accent-violet/40 hover:shadow-accent-violet/10 sm:p-5'
    >
      <h3 className='text-xs font-medium uppercase tracking-wider text-ink-muted'>{label}</h3>
      <div className='flex items-end justify-between gap-3'>
        <div className='min-w-0'>
          <p className='sr-only'>{formatByType(value, format)}</p>
          <p
            aria-hidden='true'
            data-testid='kpi-value'
            className='truncate bg-gradient-to-br from-white to-accent-violet/70 bg-clip-text font-display text-3xl font-semibold tabular-nums text-transparent'
          >
            {formatByType(shown, format)}
          </p>
        </div>
        <Sparkline data={kpi?.sparkline} />
      </div>
      {compare && kpi?.delta && <DeltaBadge delta={kpi.delta} />}
    </article>
  )
}

export default KpiCard
