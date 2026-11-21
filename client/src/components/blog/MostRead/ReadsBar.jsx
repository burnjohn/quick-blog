import React from 'react'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { EASE_EDITORIAL, VIEWPORT_ONCE, canObserve } from '../../ui/Reveal'
import { classNames } from '../../../utils/helpers'

const tracks = {
  paper: 'bg-line',
  ink: 'bg-paper/20'
}

const fills = {
  paper: 'bg-ink',
  ink: 'bg-signal'
}

/** Thin bar showing a post's reads relative to #1 (ratio 0–1); draws in once on scroll */
function ReadsBar({ ratio, tone = 'paper', className = '' }) {
  const observe = canObserve()
  const scale = Math.min(1, Math.max(0, ratio))

  return (
    <span aria-hidden='true' className={classNames('block h-1.5 w-full overflow-hidden', tracks[tone], className)}>
      <motion.span
        initial={observe ? { scaleX: 0 } : { scaleX: scale }}
        whileInView={observe ? { scaleX: scale } : undefined}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.9, ease: EASE_EDITORIAL }}
        className={classNames('block h-full w-full origin-left', fills[tone])}
      />
    </span>
  )
}

export default ReadsBar
