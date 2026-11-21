import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminPageHeader, AdminTable, BlogTableItem, SegmentedControl } from '../../../components/admin'
import { Loader } from '../../../components/ui'
import { useAdminBlogs } from '../../../hooks'

const BLOG_COLUMNS = [
  { label: '#', className: 'w-14' },
  { label: 'Blog Title' },
  { label: 'Date', className: 'max-sm:hidden' },
  { label: 'Status', className: 'max-sm:hidden' },
  { label: 'Actions' },
]

const STATUS_FILTERS = {
  all: { label: 'All', match: () => true, empty: 'No blogs found' },
  published: { label: 'Published', match: (blog) => blog.isPublished, empty: 'Nothing published yet' },
  drafts: { label: 'Drafts', match: (blog) => !blog.isPublished, empty: 'No drafts on the spike' },
}

function ListBlog() {
  const { blogs, loading, refetch } = useAdminBlogs()
  const [searchParams, setSearchParams] = useSearchParams()

  const statusKey = STATUS_FILTERS[searchParams.get('status')] ? searchParams.get('status') : 'all'
  const activeFilter = STATUS_FILTERS[statusKey]
  const visibleBlogs = blogs.filter(activeFilter.match)

  const filterOptions = Object.entries(STATUS_FILTERS).map(([value, filter]) => ({
    value,
    label: filter.label,
    count: blogs.filter(filter.match).length,
  }))

  const handleFilterChange = (value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value === 'all') next.delete('status')
      else next.set('status', value)
      return next
    }, { replace: true })
  }

  // Only block on the first load; refetches keep rows mounted so they can animate out.
  if (loading && blogs.length === 0) {
    return <Loader />
  }

  return (
    <div className='min-h-full bg-paper p-5 md:p-10'>
      <AdminPageHeader eyebrow={`${blogs.length} total`} title='All Blogs'>
        <SegmentedControl
          label='Filter blogs by status'
          layoutId='blog-status-filter'
          options={filterOptions}
          value={statusKey}
          onChange={handleFilterChange}
        />
      </AdminPageHeader>

      <AdminTable
        columns={BLOG_COLUMNS}
        isEmpty={visibleBlogs.length === 0}
        emptyMessage={activeFilter.empty}
        emptyHint={statusKey === 'all' ? 'Start from “Add blogs” in the menu' : 'Try another filter'}
      >
        {visibleBlogs.map((blog, index) => (
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
