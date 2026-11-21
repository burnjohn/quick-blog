import { useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useReducedMotion } from 'motion/react' // eslint-disable-line no-unused-vars
import { CAN_OBSERVE, EASE_OUT_CUBIC } from '../motion'

const formatInteger = (n) => Math.round(n).toLocaleString('en-US')

// Counts from 0 to `value` the first time it scrolls into view.
// The animated digits are aria-hidden; screen readers get the final value.
// `format` should be a stable (module-level) function.
function CountUp({ value = 0, format = formatInteger, className }) {
  const digitsRef = useRef(null)
  const shownRef = useRef(0)
  const [hasEntered, setHasEntered] = useState(false)
  const reduceMotion = useReducedMotion()
  const target = Number(value) || 0

  useLayoutEffect(() => {
    const node = digitsRef.current
    if (!node) return undefined

    const render = (n) => {
      shownRef.current = n
      node.textContent = format(n)
    }

    if (reduceMotion || !CAN_OBSERVE) {
      render(target)
      return undefined
    }
    if (!hasEntered) {
      render(shownRef.current)
      return undefined
    }

    const controls = animate(shownRef.current, target, {
      duration: 0.9,
      ease: EASE_OUT_CUBIC,
      onUpdate: render
    })
    return () => controls.stop()
  }, [target, hasEntered, reduceMotion, format])

  return (
    <motion.span
      className={className}
      {...(CAN_OBSERVE && { viewport: { once: true }, onViewportEnter: () => setHasEntered(true) })}
    >
      <span className='sr-only'>{format(target)}</span>
      <span ref={digitsRef} aria-hidden='true' />
    </motion.span>
  )
}

export default CountUp
