// Motion presets for the admin "front page" language.
// See client/docs/motion.md.

export const EASE_EDITORIAL = [0.22, 1, 0.36, 1]
export const EASE_OUT_CUBIC = [0.33, 1, 0.68, 1]

const STAGGER_STEP = 0.06
const MAX_STAGGERED = 8

export const staggerDelay = (index = 0) => Math.min(index, MAX_STAGGERED - 1) * STAGGER_STEP

export const VIEWPORT_ONCE = { once: true, margin: '-10% 0px' }

// Fade + rise. Pass the item's position as `custom` to stagger it.
export const riseIn = {
  hidden: { opacity: 0, y: 20 },
  show: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_EDITORIAL, delay: staggerDelay(index) }
  })
}

// Table rows: rise in, slide out to the left on delete / approve / publish.
export const rowMotion = {
  hidden: { opacity: 0, y: 16 },
  show: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_EDITORIAL, delay: staggerDelay(index) }
  }),
  exit: {
    opacity: 0,
    x: -32,
    transition: { duration: 0.28, ease: EASE_EDITORIAL }
  }
}

// Route content inside the admin outlet: crossfade + 12px slide.
export const pageMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_EDITORIAL } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: EASE_EDITORIAL } }
}

export const HOVER_TRANSITION = { duration: 0.18, ease: EASE_EDITORIAL }
export const SLIDE_TRANSITION = { duration: 0.4, ease: EASE_EDITORIAL }

// Environments without IntersectionObserver (jsdom, very old browsers) show
// scroll-revealed content immediately instead of waiting for a view event.
export const CAN_OBSERVE = typeof window !== 'undefined' && 'IntersectionObserver' in window

export const revealOnScroll = (index = 0, variants = riseIn) => (CAN_OBSERVE
  ? { variants, custom: index, initial: 'hidden', whileInView: 'show', viewport: VIEWPORT_ONCE }
  : { variants, custom: index, initial: false, animate: 'show' })
