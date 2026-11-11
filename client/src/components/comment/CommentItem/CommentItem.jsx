import React from 'react'
import { formatRelativeTime, getInitials } from '../../../utils/formatters'

function CommentItem({ comment }) {
  return (
    <li className='flex gap-4 border-b border-line py-6 sm:gap-5'>
      <span
        aria-hidden='true'
        className='flex h-11 w-11 shrink-0 items-center justify-center border border-ink bg-signal font-mono text-xs font-medium text-ink'
      >
        {getInitials(comment.name)}
      </span>
      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1'>
          <p className='font-semibold text-ink'>{comment.name}</p>
          <time
            dateTime={comment.createdAt}
            className='font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted'
          >
            {formatRelativeTime(comment.createdAt)}
          </time>
        </div>
        <p className='mt-2 break-words leading-relaxed text-ink'>{comment.content}</p>
      </div>
    </li>
  )
}

export default CommentItem
