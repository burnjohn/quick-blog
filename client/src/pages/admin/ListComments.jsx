import React, { useState } from 'react'
import { CommentTableItem } from '../../components/admin'
import { Loader, Pagination } from '../../components/ui'
import { useAdminComments } from '../../hooks'

function ListComments() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const limit = 10
  const sortOrder = 'desc'

  const { comments, pagination, loading, refetch } = useAdminComments(page, limit, sortBy, sortOrder)

  if (loading) {
    return <Loader />
  }

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50 h-full min-h-full'>
      <h1 className='text-2xl font-semibold mb-4'>All Comments</h1>

      {/* Sorting Tabs */}
      <div className='flex gap-2 mb-4'>
        <button
          onClick={() => {
            setSortBy('createdAt')
            setPage(1)
          }}
          className={`px-4 py-2 rounded transition-colors ${
            sortBy === 'createdAt'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Latest
        </button>
        <button
          onClick={() => {
            setSortBy('blog')
            setPage(1)
          }}
          className={`px-4 py-2 rounded transition-colors ${
            sortBy === 'blog'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          By Blog
        </button>
      </div>

      <div className='relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-gray-600 text-left uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-2 py-4 xl:px-6'>#</th>
              <th scope='col' className='px-2 py-4'>Blog Title & Comment</th>
              <th scope='col' className='px-2 py-4 max-sm:hidden'>Date</th>
              <th scope='col' className='px-2 py-4'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 ? (
              <tr>
                <td colSpan='4' className='text-center py-8 text-gray-400'>
                  No comments found
                </td>
              </tr>
            ) : (
              comments.map((comment, index) => (
                <CommentTableItem
                  key={comment._id}
                  comment={comment}
                  onUpdate={refetch}
                  index={(page - 1) * limit + index + 1}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        limit={limit}
        onPageChange={setPage}
        itemLabel='comments'
      />
    </div>
  )
}

export default ListComments

