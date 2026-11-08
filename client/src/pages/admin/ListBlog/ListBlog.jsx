import React from 'react'
import { BlogTableItem } from '../../../components/admin'
import { Loader } from '../../../components/ui'
import { useAdminBlogs } from '../../../hooks'

function ListBlog() {
  const { blogs, loading, refetch } = useAdminBlogs()

  if (loading) {
    return <Loader />
  }

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-background h-full min-h-full'>
      <h1 className='font-display text-3xl font-bold tracking-tight text-foreground mb-4'>All Blogs</h1>

      <div className='relative h-4/5 mt-4 max-w-4xl overflow-x-auto rounded-2xl border border-border shadow-card scrollbar-hide bg-card'>
        <table className='w-full text-sm text-muted-foreground'>
          <thead className='text-xs tracking-wider text-muted-foreground text-left uppercase bg-muted'>
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
                <td colSpan='5' className='text-center py-8 text-muted-foreground'>
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
