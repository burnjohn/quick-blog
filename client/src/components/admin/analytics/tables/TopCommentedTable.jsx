import React from 'react'
import { useAnalyticsTopCommented } from '../../../../hooks'

function TopCommentedTable({ filterParams }) {
  const { blogs, loading, error, refetch } = useAnalyticsTopCommented(filterParams)

  return (
    <div>
      <h3 className='text-sm font-semibold text-gray-600 mb-3'>Top Commented Posts</h3>
      <div className='bg-white rounded-lg shadow overflow-x-auto'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-gray-600 uppercase bg-gray-50'>
            <tr>
              <th className='px-4 py-3 text-left'>#</th>
              <th className='px-4 py-3 text-left'>Title</th>
              <th className='px-4 py-3 text-left'>Category</th>
              <th className='px-4 py-3 text-left'>Comments</th>
              <th className='px-4 py-3 text-left'>Views</th>
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
            ) : !blogs.length ? (
              <tr><td colSpan={5} className='text-center py-8 text-gray-400'>No data</td></tr>
            ) : (
              blogs.map((blog, i) => (
                <tr key={blog.blogId || i}>
                  <td className='px-4 py-3'>{i + 1}</td>
                  <td className='px-4 py-3'>
                    <a href={`/blog/${blog.blogId}`} target='_blank' rel='noreferrer' className='text-purple-600 hover:underline font-medium'>
                      {blog.title}
                    </a>
                  </td>
                  <td className='px-4 py-3'>{blog.category}</td>
                  <td className='px-4 py-3'>{blog.comments}</td>
                  <td className='px-4 py-3'>{blog.views?.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TopCommentedTable
