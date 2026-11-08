import React from 'react'
import { assets } from '../../../assets/assets'
import { formatRelativeTime } from '../../../utils/formatters'

function CommentItem({ comment }) {
  return (
    <div className='bg-card border border-border rounded-2xl p-5 text-muted-foreground'>
      <div className='flex items-center justify-between gap-3 mb-3'>
        <div className='flex items-center gap-3 min-w-0'>
          <span className='flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-muted'>
            <img src={assets.user_icon} alt='' className='w-5 dark:invert' />
          </span>
          <p className='font-semibold text-foreground truncate'>{comment.name}</p>
        </div>
        <span className='shrink-0 text-xs'>{formatRelativeTime(comment.createdAt)}</span>
      </div>
      <p className='text-sm leading-relaxed pl-12'>{comment.content}</p>
    </div>
  )
}

export default CommentItem
