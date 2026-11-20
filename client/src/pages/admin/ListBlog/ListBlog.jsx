import React from 'react'
import { AdminPageHeader, AdminTable, BlogTableItem } from '../../../components/admin'
import { Loader } from '../../../components/ui'
import { useAdminBlogs } from '../../../hooks'

const BLOG_COLUMNS = [
  { label: '#', className: 'w-14' },
  { label: 'Blog Title' },
  { label: 'Date', className: 'max-sm:hidden' },
  { label: 'Status', className: 'max-sm:hidden' },
  { label: 'Actions' },
]

function ListBlog() {
  const { blogs, loading, refetch } = useAdminBlogs()

  if (loading) {
    return <Loader />
  }

  return (
    <div className='min-h-full bg-paper p-5 md:p-10'>
      <AdminPageHeader eyebrow={`${blogs.length} total`} title='All Blogs' />

      <AdminTable
        columns={BLOG_COLUMNS}
        isEmpty={blogs.length === 0}
        emptyMessage='No blogs found'
        className='max-w-5xl'
      >
        {blogs.map((blog, index) => (
          <BlogTableItem
            key={blog._id}
            blog={blog}
            onUpdate={refetch}
            index={index + 1}
          />
        ))}
      </AdminTable>
    </div>
  )
}

export default ListBlog
