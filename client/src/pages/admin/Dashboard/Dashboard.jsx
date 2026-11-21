import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react' // eslint-disable-line no-unused-vars
import { AdminPageHeader, AdminTable, BlogTableItem, Masthead, StatCard } from '../../../components/admin'
import { revealOnScroll } from '../../../components/admin/shared/motion'
import { longDateLabel, plural } from '../../../components/admin/shared/editorial'
import { Loader } from '../../../components/ui'
import { useAdminDashboard } from '../../../hooks'
import { ROUTES } from '../../../constants/routes'

const BLOG_COLUMNS = [
  { label: '#', className: 'w-14' },
  { label: 'Blog Title' },
  { label: 'Date', className: 'max-sm:hidden' },
  { label: 'Status', className: 'max-sm:hidden' },
  { label: 'Actions' },
]

const buildInsights = ({ blogs, drafts, comments, blogsThisMonth, publishedThisMonth }) => [
  {
    kicker: 'Pipeline',
    text: <><em className='bg-signal px-1 not-italic text-ink'>{blogs - drafts} of {blogs}</em> stories are live on the site.</>
  },
  {
    kicker: 'On the spike',
    text: `${plural(drafts, 'draft')} waiting for an editor's pass.`
  },
  {
    kicker: 'This month',
    text: `${plural(blogsThisMonth, 'story', 'stories')} written, ${publishedThisMonth} sent to press. ${plural(comments, 'comment')} on record.`
  }
]

function Dashboard() {
  const { dashboardData, loading, refetch } = useAdminDashboard()
  const { recentBlogs } = dashboardData

  // Only block the page on the first load; refetches keep the table mounted
  // so rows can animate out after delete / publish.
  if (loading && recentBlogs.length === 0 && !dashboardData.blogs) {
    return <Loader />
  }

  return (
    <div className='section-counter min-h-full bg-paper p-5 md:p-10'>
      <AdminPageHeader eyebrow='Overview' title='Dashboard'>
        <Link
          to={ROUTES.ADMIN_ADD_BLOG}
          className='lift inline-flex min-h-11 items-center gap-2 self-start border border-ink bg-signal px-5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink shadow-hard-sm hover:shadow-hard'
        >
          ✦ Write a story
        </Link>
      </AdminPageHeader>

      <Masthead
        dateline={[`Vol. 1 · No. ${dashboardData.blogs}`, 'Quick Blog · Editor’s desk', longDateLabel()]}
        label='Stories on file'
        value={dashboardData.blogs}
        sticker={`+${dashboardData.blogsThisMonth} this month`}
        sub={`${plural(dashboardData.publishedThisMonth, 'story', 'stories')} went to press this month.`}
        insights={buildInsights(dashboardData)}
      />

      <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-5'>
        <StatCard index={0} label='Comments' value={dashboardData.comments} note='All time' />
        <StatCard index={1} label='Drafts' value={dashboardData.drafts} tone='halftone' note='Unpublished' />
        <StatCard index={2} label='Written this month' value={dashboardData.blogsThisMonth} />
        <StatCard index={3} label='Published this month' value={dashboardData.publishedThisMonth} tone='signal' />
        <StatCard index={4} label='Views this month' value={dashboardData.viewsThisMonth ?? 0} note='Readers' />
      </div>

      <motion.section
        aria-labelledby='latest-blogs'
        {...revealOnScroll()}
        className='mt-14'
      >
        <div className='mb-5 flex flex-wrap items-end justify-between gap-3'>
          <div>
            <p className='section-no font-mono text-[11px] uppercase tracking-[0.18em] text-ink'>Latest</p>
            <h2 id='latest-blogs' className='mt-1 font-serif text-3xl font-semibold tracking-tight text-ink'>
              Latest Blogs
            </h2>
          </div>
          <Link
            to={ROUTES.ADMIN_LIST_BLOG}
            className='inline-flex min-h-11 items-center font-mono text-[11px] uppercase tracking-[0.14em] text-ink underline decoration-signal decoration-[3px] underline-offset-4 hover:bg-signal'
          >
            All blogs →
          </Link>
        </div>

        <AdminTable
          columns={BLOG_COLUMNS}
          isEmpty={recentBlogs.length === 0}
          emptyMessage='No blogs found'
          emptyHint='Write your first story to see it here'
        >
          {recentBlogs.map((blog, index) => (
            <BlogTableItem
              key={blog._id}
              blog={blog}
              onUpdate={refetch}
              index={index + 1}
            />
          ))}
        </AdminTable>
      </motion.section>
    </div>
  )
}

export default Dashboard
