import React from 'react'
import { motion, useReducedMotion } from 'motion/react' // eslint-disable-line no-unused-vars

// Staggered entrance wrapper; renders statically with reduced motion.
function Reveal({ index = 0, className, children }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: reduceMotion ? 0 : index * 0.06 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default Reveal
