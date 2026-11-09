import React from 'react'
import { assets } from '../../../assets/assets'
import { BlogTableItem } from '../../../components/admin'
import { Loader, Panel } from '../../../components/ui'
import { useAdminDashboard } from '../../../hooks'

function Dashboard() {
  const { dashboardData, loading, refetch } = useAdminDashboard()

  if (loading) {
    return <Loader />
  }

  return (
    <div className='p-4 md:p-10'>
      {/* Stats Cards */}
      <div className='grid gap-4 sm:grid-cols-3 max-w-4xl'>
        <Panel className='flex items-center gap-4 p-5 transition-colors duration-300 hover:border-white/20'>
          <img src={assets.dashboard_icon_1} alt='' className='size-10 invert opacity-80' />
          <div>
            <p className='font-mono text-3xl font-semibold text-ink'>{dashboardData.blogs}</p>
            <p className='font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted'>Blogs</p>
          </div>
        </Panel>

        <Panel className='flex items-center gap-4 p-5 transition-colors duration-300 hover:border-white/20'>
          <img src={assets.dashboard_icon_2} alt='' className='size-10 invert opacity-80' />
          <div>
            <p className='font-mono text-3xl font-semibold text-ink'>{dashboardData.comments}</p>
            <p className='font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted'>Comments</p>
          </div>
        </Panel>

        <Panel className='flex items-center gap-4 p-5 transition-colors duration-300 hover:border-white/20'>
          <img src={assets.dashboard_icon_3} alt='' className='size-10 invert opacity-80' />
          <div>
            <p className='font-mono text-3xl font-semibold text-ink'>{dashboardData.drafts}</p>
            <p className='font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted'>Drafts</p>
          </div>
        </Panel>
      </div>

      {/* Latest Blogs */}
      <div className='max-w-4xl'>
        <div className='mb-4 mt-8 flex items-center gap-3'>
          <img src={assets.dashboard_icon_4} alt='' className='size-6 invert opacity-80' />
          <p className='font-display text-lg font-semibold tracking-tight text-ink'>Latest Blogs</p>
        </div>

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
                {dashboardData.recentBlogs.length === 0 ? (
                  <tr>
                    <td colSpan='5' className='py-8 text-center text-muted'>
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
        </Panel>
      </div>
    </div>
  )
}

export default Dashboard
