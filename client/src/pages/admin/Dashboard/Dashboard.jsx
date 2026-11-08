import React from 'react'
import { assets } from '../../../assets/assets'
import { BlogTableItem } from '../../../components/admin'
import { Loader } from '../../../components/ui'
import { useAdminDashboard } from '../../../hooks'

function Dashboard() {
  const { dashboardData, loading, refetch } = useAdminDashboard()

  if (loading) {
    return <Loader />
  }

  return (
    <div className='flex-1 p-4 md:p-10 bg-background h-full min-h-full'>
      {/* Stats Cards */}
      <div className='flex flex-wrap gap-4'>
        <div className='flex items-center gap-4 bg-card border border-border p-5 min-w-58 rounded-2xl shadow-card hover:-translate-y-0.5 hover:border-accent/40 transition-all duration-200 motion-reduce:hover:translate-y-0'>
          <img src={assets.dashboard_icon_1} alt='' />
          <div>
            <p className='font-display text-2xl font-bold text-foreground'>{dashboardData.blogs}</p>
            <p className='text-sm text-muted-foreground'>Blogs</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-card border border-border p-5 min-w-58 rounded-2xl shadow-card hover:-translate-y-0.5 hover:border-accent/40 transition-all duration-200 motion-reduce:hover:translate-y-0'>
          <img src={assets.dashboard_icon_2} alt='' />
          <div>
            <p className='font-display text-2xl font-bold text-foreground'>{dashboardData.comments}</p>
            <p className='text-sm text-muted-foreground'>Comments</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-card border border-border p-5 min-w-58 rounded-2xl shadow-card hover:-translate-y-0.5 hover:border-accent/40 transition-all duration-200 motion-reduce:hover:translate-y-0'>
          <img src={assets.dashboard_icon_3} alt='' />
          <div>
            <p className='font-display text-2xl font-bold text-foreground'>{dashboardData.drafts}</p>
            <p className='text-sm text-muted-foreground'>Drafts</p>
          </div>
        </div>
      </div>

      {/* Latest Blogs */}
      <div>
        <div className='flex items-center gap-3 m-4 mt-8 text-foreground'>
          <img src={assets.dashboard_icon_4} alt='' />
          <p className='font-semibold'>Latest Blogs</p>
        </div>

        <div className='relative max-w-4xl overflow-x-auto rounded-2xl border border-border shadow-card scrollbar-hide bg-card'>
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
              {dashboardData.recentBlogs.length === 0 ? (
                <tr>
                  <td colSpan='5' className='text-center py-8 text-muted-foreground'>
                    No blogs found
                  </td>
                </tr>
              ) : (
                dashboardData.recentBlogs.map((blog, index) => (
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
    </div>
  )
}

export default Dashboard
