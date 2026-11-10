import React, { useEffect, useId, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react' // eslint-disable-line no-unused-vars
import { useAnalyticsPost } from '../../../../hooks/api/queries/useAnalyticsPost'
import ErrorState from '../ErrorState'
import PostDetailContent from './PostDetailContent'

const FALLBACK_FOCUS_ID = 'top-posts-heading'

function Skeleton() {
  return (
    <div role='status' aria-label='Loading post details' className='space-y-4'>
      <div className='analytics-shimmer h-8 w-2/3 rounded-xl bg-white/5' />
      <div className='grid grid-cols-3 gap-3'>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className='analytics-shimmer h-16 rounded-2xl bg-white/5' />
        ))}
      </div>
      <div className='analytics-shimmer h-40 rounded-2xl bg-white/5' />
    </div>
  )
}

function PostDetailDialog({ postId, params, onClose, returnFocusRef }) {
  const dialogRef = useRef(null)
  const postIdRef = useRef(postId)
  const wasOpenRef = useRef(false)
  const reduceMotion = useReducedMotion()
  const titleId = useId()
  const { post, loading, error, notFound, refetch } = useAnalyticsPost(postId, params)

  useEffect(() => {
    postIdRef.current = postId
    const dialog = dialogRef.current
    if (!dialog) return
    if (postId) {
      wasOpenRef.current = true
      if (!dialog.open) dialog.showModal()
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false
      if (dialog.open) dialog.close()
      const target = returnFocusRef?.current || document.getElementById(FALLBACK_FOCUS_ID)
      target?.focus?.()
    }
  }, [postId, returnFocusRef])

  const handleCancel = (event) => {
    event.preventDefault()
    onClose?.()
  }

  // Native close (e.g. form method=dialog) while still "open" in parent state
  const handleClose = () => {
    if (postIdRef.current) onClose?.()
  }

  const handleBackdrop = (event) => {
    if (event.target === dialogRef.current) onClose?.()
  }

  let body = null
  if (postId) {
    if ((loading && !post) || (post && post.id !== postId && !error)) body = <Skeleton />
    else if (notFound) body = <ErrorState title='Post not found' message='This post no longer exists or is outside the selected range.' />
    else if (error) body = <ErrorState title='Could not load post' message='We could not load this post.' onRetry={refetch} />
    else if (post && post.id === postId) body = <PostDetailContent post={post} titleId={titleId} />
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={post ? titleId : undefined}
      aria-label={post ? undefined : 'Post details'}
      onCancel={handleCancel}
      onClose={handleClose}
      onClick={handleBackdrop}
      className='m-auto w-[min(48rem,calc(100%-1.5rem))] max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-ink-800/95 p-0 text-ink-text shadow-2xl shadow-black/50 backdrop:bg-ink-950/70 backdrop:backdrop-blur-sm'
    >
      {postId && (
        <motion.div
          className='relative p-5 sm:p-8'
          initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.25 }}
        >
          <button
            type='button'
            aria-label='Close post details'
            onClick={() => onClose?.()}
            className='absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-ink-text transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan'
          >
            <span aria-hidden='true'>✕</span>
          </button>
          {body}
        </motion.div>
      )}
    </dialog>
  )
}

export default PostDetailDialog
