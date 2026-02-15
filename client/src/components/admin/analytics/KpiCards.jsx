import React from 'react'
import KpiCard from './KpiCard'

function KpiCardsSkeleton() {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6'>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className='bg-white rounded-lg shadow p-4 animate-pulse'>
          <div className='h-3 bg-gray-200 rounded w-2/3 mb-2' />
          <div className='h-7 bg-gray-200 rounded w-1/2' />
        </div>
      ))}
    </div>
  )
}

function KpiCards({ summary, loading, error, refetch }) {
  if (loading) return <KpiCardsSkeleton />

  if (error) {
    return (
      <div className='bg-white rounded-lg shadow p-6 mb-6 text-center text-gray-400'>
        <p>{error}</p>
        <button
          onClick={refetch}
          className='text-sm text-primary hover:underline mt-2 cursor-pointer'
        >
          Try again
        </button>
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Views',
      value: summary.totalViews,
      trend: summary.trends?.views
    },
    {
      title: 'Total Blogs',
      value: summary.totalBlogs,
      trend: summary.trends?.blogs,
      subtitle: `${summary.publishedBlogs} published, ${summary.draftBlogs} drafts`
    },
    {
      title: 'Total Comments',
      value: summary.totalComments,
      trend: summary.trends?.comments,
      subtitle: `${summary.approvedComments} approved, ${summary.pendingComments} pending`
    },
    {
      title: 'Avg Engagement',
      value: summary.avgEngagement,
      format: 'percent',
      trend: summary.trends?.views
    },
    {
      title: 'Approval Rate',
      value: summary.approvalRate,
      format: 'percent',
      trend: summary.trends?.approvalRate
    },
    {
      title: 'Most Active Category',
      value: summary.mostActiveCategory?.category ?? '—',
      subtitle: summary.mostActiveCategory
        ? `${summary.mostActiveCategory.count} posts`
        : undefined
    }
  ]

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6'>
      {cards.map((card) => (
        <KpiCard key={card.title} {...card} />
      ))}
    </div>
  )
}

export default KpiCards
