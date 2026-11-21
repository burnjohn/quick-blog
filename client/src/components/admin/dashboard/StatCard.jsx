import React from 'react'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { classNames } from '../../../utils/helpers'
import CountUp from '../shared/CountUp'
import { revealOnScroll } from '../shared/motion'

const TONES = {
  surface: 'bg-surface text-ink shadow-hard hover:shadow-hard-lg',
  signal: 'bg-signal text-ink shadow-hard hover:shadow-hard-lg',
  halftone: 'halftone text-ink shadow-hard hover:shadow-hard-lg',
  ink: 'bg-ink text-paper border-ink shadow-hard-signal hover:shadow-hard-signal-lg'
}

const formatPadded = (n) => String(Math.round(n)).padStart(2, '0')

function StatCard({ label, value, tone = 'surface', note, index = 0 }) {
  return (
    <motion.div
      {...revealOnScroll(index)}
      className={classNames('lift flex flex-col justify-between border border-ink p-6', TONES[tone])}
    >
      <p className={classNames('font-mono text-[11px] uppercase tracking-[0.18em]', tone === 'halftone' && 'self-start bg-signal px-1')}>
        {label}
      </p>
      <p className='mt-8 font-mono text-5xl font-medium tabular-nums sm:text-6xl'>
        <CountUp
          value={value ?? 0}
          format={formatPadded}
          className={classNames(tone === 'halftone' && 'bg-signal px-1')}
        />
      </p>
      {note && (
        <p className={classNames('mt-3 font-mono text-[11px] uppercase tracking-[0.14em]', tone === 'ink' ? 'text-paper/60' : 'text-ink-muted', tone === 'halftone' && 'self-start bg-signal px-1 text-ink')}>
          {note}
        </p>
      )}
    </motion.div>
  )
}

export default StatCard
