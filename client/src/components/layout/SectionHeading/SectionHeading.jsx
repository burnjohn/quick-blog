import React from 'react'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { EASE_EDITORIAL, VIEWPORT_ONCE, canObserve } from '../../ui/Reveal'
import { classNames } from '../../../utils/helpers'

/**
 * Numbered section kicker + display title. The number comes from the
 * `section-counter` on an ancestor, so sections renumber themselves when one is hidden.
 */
function SectionHeading({ id, kicker, title, tone = 'paper', children, className = '' }) {
  const observe = canObserve()
  const isInk = tone === 'ink'

  return (
    <div className={classNames('relative mb-10 flex flex-col gap-5 pb-5 lg:flex-row lg:items-end lg:justify-between', className)}>
      <div className='min-w-0'>
        <p className={classNames(
          'section-no font-mono text-[11px] uppercase tracking-[0.18em]',
          isInk ? 'text-signal [&::before]:text-paper/60' : 'text-ink'
        )}>
          {kicker}
        </p>
        <h2
          id={id}
          className={classNames(
            'mt-3 font-serif text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl',
            isInk ? 'text-paper' : 'text-ink'
          )}
        >
          {title}
        </h2>
      </div>
      {children && <div className='shrink-0'>{children}</div>}
      <motion.span
        aria-hidden='true'
        initial={observe ? { scaleX: 0 } : false}
        whileInView={observe ? { scaleX: 1 } : undefined}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
        className={classNames('absolute inset-x-0 bottom-0 h-0.5 origin-left', isInk ? 'bg-paper/40' : 'bg-ink')}
      />
    </div>
  )
}

export default SectionHeading
