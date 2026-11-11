import React from 'react'
import CommentItem from '../CommentItem'
import { MESSAGES } from '../../../constants/messages'

function CommentList({ comments }) {
  return (
    <div>
      <p className='font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted'>
        Conversation
      </p>
      <h2 className='mt-3 mb-8 font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl'>
        {`Comments (${comments.length})`}
      </h2>
      {comments.length === 0 ? (
        <p className='border border-dashed border-ink-muted px-6 py-10 text-center text-ink-muted'>
          {MESSAGES.INFO_NO_COMMENTS}
        </p>
      ) : (
        <ol className='flex flex-col border-t border-ink'>
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </ol>
      )}
    </div>
  )
}

export default CommentList
