import React, { useState, useMemo } from 'react'
import { CommentTableItem } from '../../components/admin'
import { Loader } from '../../components/ui'
import { useAdminComments } from '../../hooks'

function Comments() {
  const { comments, loading, refetch } = useAdminComments()
  const [filter, setFilter] = useState('Not Approved')

  const filteredComments = useMemo(() => {
    return filter === 'Approved'
      ? comments.filter((comment) => comment.isApproved)
      : comments.filter((comment) => !comment.isApproved)
  }, [comments, filter])

  if (loading) {
    return <Loader />
  }

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
      <div className='flex justify-between items-center max-w-3xl mb-4'>
        <h1 className='text-2xl font-semibold'>Comments</h1>
        <div className='flex gap-4'>
          <button
            onClick={() => setFilter('Approved')}
            className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs transition-colors ${
              filter === 'Approved' 
                ? 'text-primary border-primary bg-primary/10' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('Not Approved')}
            className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs transition-colors ${
              filter === 'Not Approved' 
                ? 'text-primary border-primary bg-primary/10' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Not Approved
          </button>
        </div>
      </div>

      <div className='relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-white shadow rounded-lg scrollbar-hide'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-gray-700 text-left uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-6 py-3'>Details</th>
              <th scope='col' className='px-6 py-3 max-sm:hidden'>Date</th>
              <th scope='col' className='px-6 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComments.length === 0 ? (
              <tr>
                <td colSpan='3' className='text-center py-8 text-gray-400'>
                  No {filter.toLowerCase()} comments found
                </td>
              </tr>
            ) : (
              filteredComments.map((comment) => (
                <CommentTableItem 
                  key={comment._id} 
                  comment={comment} 
                  onUpdate={refetch}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Comments
