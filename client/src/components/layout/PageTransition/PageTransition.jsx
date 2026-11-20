import React from 'react'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { EASE_EDITORIAL } from '../../ui/Reveal'

/** Route enter transition: crossfade + 12px rise. Keyed by the caller so it replays per page. */
function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
