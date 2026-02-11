import React from 'react'
import { assets } from '../../assets/assets'
import { BlogTableItem, StatCard } from '../../components/admin'
import { Loader } from '../../components/ui'
import { useAdminDashboard } from '../../hooks'

const getStatCards = (dashboardData) => [
  { icon: assets.dashboard_icon_1, value: dashboardData.blogs, label: 'Blogs' },
  { icon: assets.dashboard_icon_2, value: dashboardData.comments, label: 'Comments' },
  { icon: assets.dashboard_icon_3, value: dashboardData.drafts, label: 'Drafts' },
  { icon: assets.dashboard_icon_1, value: dashboardData.blogsThisMonth, label: 'Written This Month' },
  { icon: assets.dashboard_icon_3, value: dashboardData.publishedThisMonth, label: 'Published This Month' }
]

function Dashboard() {
  const { dashboardData, loading, refetch } = useAdminDashboard()

  if (loading) {
    return <Loader />
  }

  const statCards = getStatCards(dashboardData)

  return (
    <div className='flex-1 p-4 md:p-10 bg-blue-50/50 h-full min-h-full'>
      {/* Stats Cards */}
      <div className='flex flex-wrap gap-4'>
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            icon={card.icon}
            value={card.value}
            label={card.label}
          />
        ))}
      </div>

      {/* Latest Blogs */}
      <div>
        <div className='flex items-center gap-3 m-4 mt-6 text-gray-600'>
          <img src={assets.dashboard_icon_4} alt='' />
          <p className='font-semibold'>Latest Blogs</p>
        </div>

        <div className='relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
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
              {dashboardData.recentBlogs.length === 0 ? (
                <tr>
                  <td colSpan='5' className='text-center py-8 text-gray-400'>
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
