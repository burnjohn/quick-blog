import React from 'react'
import { classNames } from '../../../utils/helpers'

const tones = {
  signal: 'bg-signal text-ink border-ink',
  ink: 'bg-ink text-signal border-signal',
  paper: 'bg-paper text-ink border-ink'
}

const tilts = {
  left: '-rotate-3',
  right: 'rotate-2',
  none: ''
}

const sizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-[11px]',
  lg: 'px-4 py-1.5 text-sm'
}

/** Rotated print-style badge for categories, deltas and "Featured" labels */
function Sticker({ children, tone = 'signal', tilt = 'left', size = 'md', className = '', ...props }) {
  return (
    <span
      className={classNames(
        'inline-block border-2 font-mono font-medium uppercase tracking-[0.16em]',
        tones[tone],
        tilts[tilt],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Sticker
