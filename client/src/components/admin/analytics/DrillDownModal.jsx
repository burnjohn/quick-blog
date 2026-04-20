import React, { useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Skeleton from '../../ui/Skeleton'
import { getBlogDetailPath } from '../../../constants/routes'
import { classNames } from '../../../utils/helpers'

const numberFormatter = new Intl.NumberFormat('en-US')

function formatViews(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—'
  return numberFormatter.format(value)
}

const FOCUSABLE_SELECTOR =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, ' +
  '[tabindex]:not([tabindex="-1"]), [contenteditable="true"]'

function DrillDownModal({ isOpen, onClose, title = 'Details', data, loading = false }) {
  const dialogRef = useRef(null)
  const previousActiveElementRef = useRef(null)

  const handleClose = useCallback(() => {
    onClose?.()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return undefined

    previousActiveElementRef.current = document.activeElement

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        handleClose()
        return
      }
      if (event.key !== 'Tab') return

      const container = dialogRef.current
      if (!container) return
      const focusables = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
      )
      if (focusables.length === 0) {
        event.preventDefault()
        container.focus()
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const dialog = dialogRef.current
    if (dialog) {
      const firstFocusable = dialog.querySelector(FOCUSABLE_SELECTOR)
      ;(firstFocusable ?? dialog).focus()
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = overflow
      const previous = previousActiveElementRef.current
      if (previous && typeof previous.focus === 'function') {
        previous.focus()
      }
    }
  }, [isOpen, handleClose])

  if (!isOpen) return null

  const items = Array.isArray(data) ? data : []

  return (
    <div
      className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose()
      }}
    >
      <div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby='drilldown-title'
        tabIndex={-1}
        className={classNames(
          'w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-lg bg-white shadow-xl',
          'outline-none'
        )}
      >
        <div className='flex items-center justify-between border-b border-gray-200 px-5 py-3'>
          <h2 id='drilldown-title' className='text-base font-semibold text-gray-900'>
            {title}
          </h2>
          <button
            type='button'
            onClick={handleClose}
            aria-label='Close'
            className='rounded-md px-2 py-1 text-xl leading-none text-gray-500 hover:bg-gray-100 cursor-pointer'
          >
            ×
          </button>
        </div>

        <div className='px-5 py-4'>
          {loading ? (
            <ul className='space-y-3'>
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className='flex items-center justify-between gap-3'>
                  <Skeleton height={14} width='70%' />
                  <Skeleton height={14} width={48} />
                </li>
              ))}
            </ul>
          ) : items.length === 0 ? (
            <p className='text-sm text-gray-500'>No posts for this period.</p>
          ) : (
            <ul className='divide-y divide-gray-100'>
              {items.map((item, index) => {
                const id = item._id ?? item.id
                const key = id ?? `${item.title ?? 'row'}-${index}`
                return (
                  <li
                    key={key}
                    className='flex items-center justify-between gap-3 py-2 text-sm'
                  >
                    {id ? (
                      <Link
                        to={getBlogDetailPath(id)}
                        className='text-primary hover:underline'
                      >
                        {item.title ?? 'Untitled'}
                      </Link>
                    ) : (
                      <span className='text-gray-900'>{item.title ?? 'Untitled'}</span>
                    )}
                    <span className='tabular-nums font-medium text-gray-700'>
                      {formatViews(item.views)}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default DrillDownModal
