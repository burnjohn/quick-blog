import React from 'react'
import { assets } from '../../assets/assets'
import { formatRelativeTime } from '../../utils/formatters'

function CommentItem({ comment }) {
  return (
    <div className='relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600'>
      <div className='flex items-center gap-2 mb-2'>
        <img src={assets.user_icon} alt='' className='w-6' />
        <p className='font-medium'>{comment.name}</p>
      </div>
      <p className='text-sm max-w-md ml-8'>{comment.content}</p>
      <div className='absolute right-4 bottom-3 flex items-center gap-2 text-xs'>
        {formatRelativeTime(comment.createdAt)}
      </div>
    </div>
  )
}

export default CommentItem

