import React from 'react'
import { BlogTableItem } from '../../components/admin'
import { Loader } from '../../components/ui'
import { useAdminBlogs } from '../../hooks'

function ListBlog() {
  const { blogs, loading, refetch } = useAdminBlogs()

  if (loading) {
    return <Loader />
  }

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50 h-full min-h-full'>
      <h1 className='text-2xl font-semibold mb-4'>All Blogs</h1>

      <div className='relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-gray-600 text-left uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-2 py-4 xl:px-6'>#</th>
              <th scope='col' className='px-2 py-4'>Blog Title</th>
              <th scope='col' className='px-2 py-4 max-sm:hidden'>Date</th>
              <th scope='col' className='px-2 py-4 max-sm:hidden'>Status</th>
              <th scope='col' className='px-2 py-4'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan='5' className='text-center py-8 text-gray-400'>
                  No blogs found
                </td>
              </tr>
            ) : (
              blogs.map((blog, index) => (
                <BlogTableItem 
                  key={blog._id} 
                  blog={blog} 
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

export default ListBlog
