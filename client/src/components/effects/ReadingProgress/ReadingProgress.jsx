import React from 'react'
import { motion, useScroll, useSpring } from 'motion/react'

// Aliased so ESLint (no react plugin) sees the JSX usage.
const MotionDiv = motion.div

// Thin gradient bar at the top of the viewport that fills as the page is read.
// It tracks the scroll position rather than animating on its own, so it stays under reduced motion.
function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  return (
    <MotionDiv
      aria-hidden='true'
      style={{ scaleX }}
      className='fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-primary via-cyan to-lime'
    />
  )
}

export default ReadingProgress
