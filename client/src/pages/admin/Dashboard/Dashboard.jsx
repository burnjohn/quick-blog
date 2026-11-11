import React from 'react'
import { AdminPageHeader, AdminTable, BlogTableItem } from '../../../components/admin'
import { Loader } from '../../../components/ui'
import { useAdminDashboard } from '../../../hooks'

const BLOG_COLUMNS = [
  { label: '#', className: 'w-14' },
  { label: 'Blog Title' },
  { label: 'Date', className: 'max-sm:hidden' },
  { label: 'Status', className: 'max-sm:hidden' },
  { label: 'Actions' },
]

function StatCard({ label, value, highlight = false }) {
  return (
    <div className={`flex flex-col justify-between border border-ink p-6 ${highlight ? 'bg-signal' : 'bg-surface'}`}>
      <p className='font-mono text-[11px] uppercase tracking-[0.18em] text-ink'>{label}</p>
      <p className='mt-8 font-mono text-5xl font-medium tabular-nums text-ink sm:text-6xl'>
        {String(value ?? 0).padStart(2, '0')}
      </p>
    </div>
  )
}

function Dashboard() {
  const { dashboardData, loading, refetch } = useAdminDashboard()

  if (loading) {
    return <Loader />
  }

  return (
    <div className='min-h-full bg-paper p-5 md:p-10'>
      <AdminPageHeader eyebrow='Overview' title='Dashboard' />

      <div className='grid gap-4 sm:grid-cols-3'>
        <StatCard label='Blogs' value={dashboardData.blogs} highlight />
        <StatCard label='Comments' value={dashboardData.comments} />
        <StatCard label='Drafts' value={dashboardData.drafts} />
      </div>

      <section aria-labelledby='latest-blogs' className='mt-12 max-w-5xl'>
        <h2 id='latest-blogs' className='mb-4 font-serif text-3xl font-semibold tracking-tight text-ink'>
          Latest Blogs
        </h2>

        <AdminTable
          columns={BLOG_COLUMNS}
          isEmpty={dashboardData.recentBlogs.length === 0}
          emptyMessage='No blogs found'
        >
          {dashboardData.recentBlogs.map((blog, index) => (
            <BlogTableItem
              key={blog._id}
              blog={blog}
              onUpdate={refetch}
              index={index + 1}
            />
          ))}
        </AdminTable>
      </section>
    </div>
  )
}

export default Dashboard
