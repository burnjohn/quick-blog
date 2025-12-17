import React from 'react'
import { assets } from '../../assets/assets'
import { formatRelativeTime } from '../../utils/formatters'

function CommentsList({ comments }) {
  if (!comments || comments.length === 0) {
    return null
  }

  return (
    <div className='mt-12'>
      <h2 className='text-2xl font-semibold mb-6 text-gray-900'>
        Comments ({comments.length})
      </h2>
      
      <div className='space-y-4'>
        {comments.map((comment) => (
          <div 
            key={comment._id} 
            className='bg-gray-50 rounded-lg p-6 flex gap-4'
          >
            <div className='flex-shrink-0'>
              <div className='w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center'>
                <img 
                  src={assets.user_icon} 
                  alt='' 
                  className='w-6 h-6'
                />
              </div>
            </div>
            
            <div className='flex-1 min-w-0'>
              <div className='flex items-start justify-between gap-4'>
                <h3 className='font-semibold text-gray-900 text-lg'>
                  {comment.name}
                </h3>
                <span className='text-gray-500 text-sm whitespace-nowrap'>
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              <p className='mt-2 text-gray-600 leading-relaxed'>
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommentsList

