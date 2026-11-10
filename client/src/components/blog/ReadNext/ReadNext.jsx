import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react'
import { useRelatedBlogs } from '../../../hooks'
import ReadNextCard from '../ReadNextCard'
import ReadNextSkeleton from '../ReadNextSkeleton'
import { useDragClickGuard } from './useDragClickGuard'

export const MAX_RELATED_POSTS = 6
const CARD_GAP_PX = 16
const EDGE_TOLERANCE_PX = 1
const SLIDE_SPRING = { type: 'spring', stiffness: 260, damping: 32 }

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const ArrowIcon = ({ direction }) => (
  <svg viewBox='0 0 24 24' aria-hidden='true' className='h-5 w-5' fill='none' stroke='currentColor' strokeWidth='2'>
    {direction === 'prev' ? (
      <path d='M15 18l-6-6 6-6' strokeLinecap='round' strokeLinejoin='round' />
    ) : (
      <path d='M9 6l6 6-6 6' strokeLinecap='round' strokeLinejoin='round' />
    )}
  </svg>
)

const NavButton = ({ direction, disabled, onClick, controls }) => (
  <button
    type='button'
    onClick={onClick}
    disabled={disabled}
    aria-controls={controls}
    aria-label={direction === 'prev' ? 'Previous posts' : 'Next posts'}
    className='flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ink-text transition hover:border-accent-violet/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet/60 disabled:cursor-not-allowed disabled:opacity-30 motion-safe:hover:-translate-y-0.5 disabled:hover:translate-y-0'
  >
    <ArrowIcon direction={direction} />
  </button>
)

// Measures how far the track can scroll and how long one card step is.
const useTrackMetrics = (viewportRef, trackRef, itemCount) => {
  const [metrics, setMetrics] = useState({ maxScroll: 0, step: 0 })

  const measure = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const firstItem = track.firstElementChild
    setMetrics({
      maxScroll: Math.max(0, track.scrollWidth - viewport.clientWidth),
      step: firstItem ? firstItem.offsetWidth + CARD_GAP_PX : 0,
    })
  }, [viewportRef, trackRef])

  useLayoutEffect(() => {
    measure()
    if (typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(measure)
    if (viewportRef.current) observer.observe(viewportRef.current)
    if (trackRef.current) observer.observe(trackRef.current)
    return () => observer.disconnect()
  }, [measure, itemCount, viewportRef, trackRef])

  return metrics
}

function ReadNextCarousel({ blogs, titleId }) {
  const reduceMotion = useReducedMotion()
  const trackId = useId()
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const x = useMotionValue(0)
  // Where the last button/focus slide is heading, so quick repeated clicks
  // step from the destination instead of a mid-animation position
  const targetRef = useRef(null)
  const [offset, setOffset] = useState(0)
  const { maxScroll, step } = useTrackMetrics(viewportRef, trackRef, blogs.length)
  const dragGuard = useDragClickGuard()

  useMotionValueEvent(x, 'change', setOffset)

  // Keep the track inside its bounds when the viewport is resized
  useEffect(() => {
    const bounded = clamp(x.get(), -maxScroll, 0)
    if (bounded !== x.get()) x.set(bounded)
    targetRef.current = null
  }, [maxScroll, x])

  const slideTo = (target) => {
    const bounded = clamp(target, -maxScroll, 0)
    targetRef.current = bounded
    if (reduceMotion) {
      x.set(bounded)
    } else {
      animate(x, bounded, SLIDE_SPRING)
    }
  }

  const slideBy = (delta) => slideTo((targetRef.current ?? x.get()) + delta)

  // Tabbing to a clipped card: bring it into view via `x` (the viewport itself never scrolls)
  const handleFocusCapture = (event) => {
    const viewport = viewportRef.current
    const item = event.target.closest('li')
    if (!viewport || !item) return
    viewport.scrollLeft = 0
    const visibleStart = -(targetRef.current ?? x.get())
    const visibleEnd = visibleStart + viewport.clientWidth
    const itemStart = item.offsetLeft
    const itemEnd = itemStart + item.offsetWidth
    if (itemStart < visibleStart) slideTo(-itemStart)
    else if (itemEnd > visibleEnd) slideTo(-(itemEnd - viewport.clientWidth))
  }

  const canPrev = offset < -EDGE_TOLERANCE_PX
  const canNext = offset > -maxScroll + EDGE_TOLERANCE_PX

  return (
    <>
      <div className='absolute right-5 top-6 hidden gap-2 sm:right-8 sm:top-8 sm:flex'>
        <NavButton direction='prev' disabled={!canPrev} onClick={() => slideBy(step)} controls={trackId} />
        <NavButton direction='next' disabled={!canNext} onClick={() => slideBy(-step)} controls={trackId} />
      </div>
      <div ref={viewportRef} className='-m-2 overflow-clip p-2'>
        <motion.ul
          id={trackId}
          ref={trackRef}
          aria-labelledby={titleId}
          className='flex cursor-grab touch-pan-y gap-4 active:cursor-grabbing'
          style={{ x }}
          drag={maxScroll > 0 ? 'x' : false}
          dragConstraints={{ left: -maxScroll, right: 0 }}
          dragElastic={0.12}
          dragMomentum={!reduceMotion}
          onPointerDown={dragGuard.onPointerDown}
          onDragStart={() => {
            targetRef.current = null
            dragGuard.onDragStart()
          }}
          onDrag={dragGuard.onDrag}
          onClickCapture={dragGuard.onClickCapture}
          onFocusCapture={handleFocusCapture}
        >
          {blogs.map((blog, index) => (
            <motion.li
              key={blog._id}
              className='w-[80%] shrink-0 sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]'
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.06 }}
            >
              <ReadNextCard blog={blog} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </>
  )
}

// "Read next" carousel of published posts from the current post's category.
// Hidden when there is nothing to show or the request failed.
function ReadNext({ blogId }) {
  const { blogs, loading } = useRelatedBlogs(blogId)
  const titleId = useId()
  const visibleBlogs = blogs.slice(0, MAX_RELATED_POSTS)

  if (!loading && visibleBlogs.length === 0) return null

  return (
    <section
      aria-labelledby={titleId}
      className='read-next-shell relative isolate mx-5 mt-20 max-w-5xl overflow-hidden rounded-[2rem] bg-ink-950 text-ink-text shadow-2xl shadow-ink-950/30 md:mx-auto'
    >
      <div className='read-next-glow' aria-hidden='true' />
      <div className='read-next-grain' aria-hidden='true' />
      <div className='relative z-10 px-5 py-6 sm:px-8 sm:py-8'>
        <div className='mb-6 pr-0 sm:pr-28'>
          <p className='font-mono text-xs uppercase tracking-wider text-ink-muted'>Same category</p>
          <h2 id={titleId} className='font-display text-2xl font-semibold text-ink-text sm:text-3xl'>
            Read next
          </h2>
        </div>
        {loading ? <ReadNextSkeleton /> : <ReadNextCarousel blogs={visibleBlogs} titleId={titleId} />}
      </div>
    </section>
  )
}

export default ReadNext
