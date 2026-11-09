import React from 'react'
import CommentItem from '../CommentItem'
import { MESSAGES } from '../../../constants/messages'

function CommentList({ comments }) {
  return (
    <div className='mx-5 mt-20 mb-10 max-w-[72ch] md:mx-auto'>
      <p className='font-display text-2xl font-semibold tracking-tight text-ink mb-6'>Comments ({comments.length})</p>
      {comments.length === 0 ? (
        <p className='text-muted text-sm'>{MESSAGES.INFO_NO_COMMENTS}</p>
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
