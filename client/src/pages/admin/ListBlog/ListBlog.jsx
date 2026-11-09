import React from 'react'
import { BlogTableItem } from '../../../components/admin'
import { Loader, Panel } from '../../../components/ui'
import { useAdminBlogs } from '../../../hooks'

function ListBlog() {
  const { blogs, loading, refetch } = useAdminBlogs()

  if (loading) {
    return <Loader />
  }

  return (
    <div className='max-w-4xl p-4 md:p-10'>
      <p className='font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted'>SYS / BLOGS</p>
      <h1 className='mb-6 mt-2 font-display text-3xl font-bold tracking-tighter text-ink'>All Blogs</h1>

      <Panel className='overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='border-b border-white/10 text-left'>
              <tr>
                <th scope='col' className='px-2 py-4 font-mono text-[0.7rem] font-normal uppercase tracking-[0.2em] text-muted xl:px-6'>#</th>
                <th scope='col' className='px-2 py-4 font-mono text-[0.7rem] font-normal uppercase tracking-[0.2em] text-muted'>Blog Title</th>
                <th scope='col' className='px-2 py-4 font-mono text-[0.7rem] font-normal uppercase tracking-[0.2em] text-muted max-sm:hidden'>Date</th>
                <th scope='col' className='px-2 py-4 font-mono text-[0.7rem] font-normal uppercase tracking-[0.2em] text-muted max-sm:hidden'>Status</th>
                <th scope='col' className='px-2 py-4 font-mono text-[0.7rem] font-normal uppercase tracking-[0.2em] text-muted'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-white/10'>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan='5' className='py-8 text-center text-muted'>
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
      </Panel>
    </div>
  )
}

export default ListBlog
