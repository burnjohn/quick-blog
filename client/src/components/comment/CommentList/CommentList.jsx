import React from 'react'
import CommentItem from '../CommentItem'
import { MESSAGES } from '../../../constants/messages'

function CommentList({ comments }) {
  return (
    <section className='mt-16 mb-12 max-w-3xl mx-auto px-5 md:px-0'>
      <h3 className='font-display text-2xl font-semibold text-foreground mb-6'>Comments ({comments.length})</h3>
      {comments.length === 0 ? (
        <p className='text-muted-foreground text-sm'>{MESSAGES.INFO_NO_COMMENTS}</p>
      ) : (
        <div className='flex flex-col gap-4'>
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  )
}

export default CommentList

