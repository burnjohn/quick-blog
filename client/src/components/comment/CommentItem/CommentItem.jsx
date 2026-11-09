import React from 'react'
import { assets } from '../../../assets/assets'
import { formatRelativeTime } from '../../../utils/formatters'
import Panel from '../../ui/Panel'

function CommentItem({ comment }) {
  return (
    <Panel className='p-5'>
      <div className='flex items-center gap-3 mb-3'>
        <span className='flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]'>
          <img src={assets.user_icon} alt='' className='size-5 invert opacity-70' />
        </span>
        <p className='font-medium text-ink'>{comment.name}</p>
        <span className='ml-auto font-mono text-[0.7rem] uppercase tracking-[0.2em] text-faint'>
          {formatRelativeTime(comment.createdAt)}
        </span>
      </div>
      <p className='text-sm text-muted break-words sm:ml-12'>{comment.content}</p>
    </Panel>
  )
}

export default CommentItem
