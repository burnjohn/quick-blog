import React from 'react'
import CommentItem from './CommentItem'
import { MESSAGES } from '../../constants/messages'

function CommentList({ comments }) {
  return (
    <div className='mt-14 mb-10 max-w-3xl mx-auto'>
      <p className='font-semibold mb-4'>Comments ({comments.length})</p>
      {comments.length === 0 ? (
        <p className='text-gray-500 text-sm'>{MESSAGES.INFO_NO_COMMENTS}</p>
      ) : (
        <div className='flex flex-col gap-4'>
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentList

