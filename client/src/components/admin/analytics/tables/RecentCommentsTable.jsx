import React from 'react'
import { useAnalyticsLastComments } from '../../../../hooks'

function RecentCommentsTable({ filterParams }) {
  const { comments, loading, error, refetch } = useAnalyticsLastComments(filterParams)

  return (
    <div>
      <h3 className='text-sm font-semibold text-gray-600 mb-3'>Recent Comments</h3>
      <div className='bg-white rounded-lg shadow overflow-x-auto'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-gray-600 uppercase bg-gray-50'>
            <tr>
              <th className='px-4 py-3 text-left'>Author</th>
              <th className='px-4 py-3 text-left'>Comment</th>
              <th className='px-4 py-3 text-left'>Blog</th>
              <th className='px-4 py-3 text-left'>Date</th>
              <th className='px-4 py-3 text-left'>Status</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className='px-4 py-3'><div className='h-4 animate-pulse bg-gray-200 rounded' /></td></tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={5} className='text-center py-8'>
                  <p className='text-red-500 text-sm mb-2'>Failed to load data</p>
                  <button onClick={refetch} className='text-xs text-primary underline'>Retry</button>
                </td>
              </tr>
            ) : !comments.length ? (
              <tr><td colSpan={5} className='text-center py-8 text-gray-400'>No data</td></tr>
            ) : (
              comments.map((comment, i) => (
                <tr key={comment._id || i}>
                  <td className='px-4 py-3'>
                    <span className='font-medium text-gray-700'>{comment.author}</span>
                  </td>
                  <td className='px-4 py-3'>
                    <span className='italic text-gray-500 truncate block max-w-xs'>{comment.content}</span>
                  </td>
                  <td className='px-4 py-3'>{comment.blogTitle}</td>
                  <td className='px-4 py-3'>
                    {new Date(comment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className='px-4 py-3'>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      comment.isApproved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {comment.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentCommentsTable
