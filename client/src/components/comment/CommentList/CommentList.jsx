import React from 'react'
import CommentItem from '../CommentItem'
import { MESSAGES } from '../../../constants/messages'

function CommentList({ comments }) {
  return (
    <div>
      <p className='section-no font-mono text-[11px] uppercase tracking-[0.18em] text-ink'>
        Conversation
      </p>
      <div className='mt-3 mb-8 flex items-end justify-between gap-4 border-b-2 border-ink pb-5'>
        <h2 className='font-serif text-5xl font-semibold leading-[0.95] tracking-tight text-ink sm:text-6xl'>
          {`Comments (${comments.length})`}
        </h2>
        <span aria-hidden='true' className='hidden -rotate-3 border-2 border-ink bg-signal px-3 py-1 font-mono text-sm tabular-nums text-ink sm:inline-block'>
          {String(comments.length).padStart(2, '0')}
        </span>
      </div>
      {comments.length === 0 ? (
        <div className='relative overflow-hidden border-2 border-dashed border-ink bg-surface px-6 py-12 text-center'>
          <span aria-hidden='true' className='halftone absolute -left-8 -bottom-8 h-24 w-24 rotate-12 opacity-60' />
          <p className='relative font-serif text-2xl italic text-ink'>{MESSAGES.INFO_NO_COMMENTS}</p>
        </div>
      ) : (
        <ol className='flex flex-col'>
          {comments.map((comment, index) => (
            <CommentItem key={comment._id} comment={comment} index={index} />
          ))}
        </ol>
      )}
    </div>
  )
}

export default CommentList
