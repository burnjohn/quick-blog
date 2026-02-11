import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drill-down-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 id="drill-down-title" className="text-lg font-semibold text-gray-800">
            Posts for {date}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Close modal"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 rounded animate-pulse bg-gray-200"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">No posts with views for this date</p>
        ) : (
          <ul className="space-y-2">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <a
                  href={getBlogDetailPath(post.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex-1 min-w-0 truncate mr-2"
                >
                  {post.title}
                </a>
                <span className="text-gray-600 shrink-0">
                  {formatNumber(post.views)} views
                </span>
                <span className="text-gray-500 text-sm shrink-0 ml-2">{post.category}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

export default DrillDownModal
