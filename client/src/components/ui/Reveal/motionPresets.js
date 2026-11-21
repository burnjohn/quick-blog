// Shared motion tokens — see client/docs/motion.md
export const EASE_EDITORIAL = [0.22, 1, 0.36, 1]
export const STAGGER_SECONDS = 0.06
export const MAX_STAGGERED = 8
export const VIEWPORT_ONCE = { once: true, margin: '-10% 0px' }

// Browsers (and test environments) without IntersectionObserver show content immediately
export const canObserve = () => typeof window !== 'undefined' && 'IntersectionObserver' in window

export const getStaggerDelay = (index = 0) => Math.min(index, MAX_STAGGERED) * STAGGER_SECONDS
