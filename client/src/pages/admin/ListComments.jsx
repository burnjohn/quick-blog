import React from 'react'
import { CommentTableItem } from '../../components/admin'
import { Loader } from '../../components/ui'
import { useAdminComments } from '../../hooks'

function ListComments() {
  const { comments, loading, refetch } = useAdminComments()

  if (loading) {
    return <Loader />
  }

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
      <h1 className='text-2xl font-semibold mb-4'>All Comments</h1>

      <div className='relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-gray-600 text-left uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-2 py-4 xl:px-6'>#</th>
              <th scope='col' className='px-2 py-4'>Commenter</th>
              <th scope='col' className='px-2 py-4 max-sm:hidden'>Blog</th>
              <th scope='col' className='px-2 py-4'>Comment</th>
              <th scope='col' className='px-2 py-4 max-sm:hidden'>Status</th>
              <th scope='col' className='px-2 py-4 max-sm:hidden'>Date</th>
              <th scope='col' className='px-2 py-4'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 ? (
              <tr>
                <td colSpan='7' className='text-center py-8 text-gray-400'>
                  No comments found
                </td>
              </tr>
            ) : (
              comments.map((comment, index) => (
                <CommentTableItem 
                  key={comment._id} 
                  comment={comment} 
                  onUpdate={refetch}
                  index={index + 1}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListComments

