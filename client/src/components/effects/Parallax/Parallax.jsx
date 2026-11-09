import React, { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

// Aliased so ESLint (no react plugin) sees the JSX usage.
const MotionDiv = motion.div

// useScroll needs a positioned target to measure offsets; keep absolute/fixed layers as they are.
const withPosition = (className) =>
  /\b(absolute|fixed|sticky|relative)\b/.test(className) ? className : `relative ${className}`

// Shifts a decorative layer or image against the scroll while its wrapper crosses the viewport.
// `offset` is the total travel in percent of the layer's own height (keep it small: 8-15).
// The motion value has to go through `style` — the one inline-style exception in this codebase.
function ParallaxLayer({ children, offset, className }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${offset / 2}%`, `${offset / 2}%`])

  return (
    <div ref={ref} className={withPosition(className)}>
      <MotionDiv style={{ y }} className='h-full w-full will-change-transform'>
        {children}
      </MotionDiv>
    </div>
  )
}

function Parallax({ children, offset = 12, className = '' }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <div className={className}>
        <div className='h-full w-full'>{children}</div>
      </div>
    )
  }

  return (
    <ParallaxLayer offset={offset} className={className}>
      {children}
    </ParallaxLayer>
  )
}

export default Parallax
