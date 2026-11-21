import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { EASE_EDITORIAL } from '../shared/motion'
import { getBlogDetailPath } from '../../../constants/routes'
import { formatNumber } from '../../../utils/formatters'

function DrillDownModal({ isOpen, onClose, date, posts = [], loading }) {
  const previousFocusRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    previousFocusRef.current = document.activeElement

    const firstFocusable = modalRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()

    return () => {
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drill-down-title"
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_EDITORIAL } }}
        className="mx-4 max-h-[80vh] w-full max-w-lg overflow-y-auto border border-ink bg-surface shadow-hard-signal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink px-6 py-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">Drill-down</p>
            <h2 id="drill-down-title" className="mt-1 font-serif text-2xl font-semibold tracking-tight text-ink">
              Posts for {date}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-signal"
            aria-label="Close modal"
          >
            <span aria-hidden="true" className="text-lg leading-none">✕</span>
          </button>
        </div>

        <div className="px-6 py-5">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 animate-pulse bg-line/60"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">No posts with views for this date</p>
        ) : (
          <ul className="divide-y divide-line">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <a
                  href={getBlogDetailPath(post.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 truncate font-medium text-ink decoration-signal decoration-[3px] underline-offset-4 hover:underline"
                >
                  {post.title}
                </a>
                <span className="shrink-0 font-mono text-xs tabular-nums text-ink">
                  {formatNumber(post.views)} views
                </span>
                <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">{post.category}</span>
              </li>
            ))}
          </ul>
        )}
        </div>
      </motion.div>
    </motion.div>
  )

  return createPortal(content, document.body)
}

export default DrillDownModal
