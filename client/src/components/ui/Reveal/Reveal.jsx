import React from 'react'
import { motion } from 'motion/react'
import { EASE_EDITORIAL, VIEWPORT_ONCE, canObserve, getStaggerDelay } from './motionPresets'

/**
 * Scroll-triggered fade + rise. Use `index` to stagger siblings (capped at 8).
 * Animates only opacity and transform; content is visible instantly without IntersectionObserver.
 */
function Reveal({ as = 'div', index = 0, y = 20, className = '', children, ...props }) {
  const Component = motion[as] ?? motion.div
  const observe = canObserve()

  return (
    <Component
      initial={observe ? { opacity: 0, y } : false}
      whileInView={observe ? { opacity: 1, y: 0 } : undefined}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.55, delay: getStaggerDelay(index), ease: EASE_EDITORIAL }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Reveal
