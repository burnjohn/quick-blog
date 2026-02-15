import React from 'react'
import { formatShortDate } from '../../../utils/formatters'
import ChartCard from './ChartCard'

function RecentCommentsList({ comments, loading, error, refetch }) {
  return (
    <ChartCard
      title='Recent Comments'
      loading={loading}
      error={error}
      isEmpty={!comments?.length}
      emptyMessage='No recent comments'
      onRetry={refetch}
    >
      <div className='divide-y divide-gray-100'>
        {comments.map((comment) => (
          <div key={comment._id} className='py-3 first:pt-0 last:pb-0'>
            <p className='text-sm font-semibold text-gray-800'>{comment.name}</p>
            <p className='text-sm text-gray-600 mt-0.5'>{comment.content}</p>
            <div className='flex items-center gap-2 mt-1.5'>
              <span className='text-xs text-indigo-600'>
                {comment.blog?.title}
              </span>
              <span className='text-xs text-gray-300'>·</span>
              <span className='text-xs text-gray-400'>
                {formatShortDate(comment.createdAt)}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  comment.isApproved
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}
              >
                {comment.isApproved ? 'Approved' : 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}

export default RecentCommentsList
