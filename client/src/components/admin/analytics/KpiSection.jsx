import React from 'react'
import { useAnalyticsKpis } from '../../../hooks'
import KpiCard from './KpiCard'

function SkeletonCard() {
  return <div className='bg-white rounded-lg shadow p-4 h-24 animate-pulse bg-gray-200' />
}

function KpiSection({ filterParams }) {
  const { kpis, trends, loading, error, refetch } = useAnalyticsKpis(filterParams)

  if (loading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8'>
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-white rounded-lg shadow p-4 mb-8 text-center'>
        <p className='text-red-500 text-sm mb-2'>Failed to load KPIs</p>
        <button onClick={refetch} className='text-xs text-primary underline'>Retry</button>
      </div>
    )
  }

  const cards = [
    { label: 'Total Views',       value: kpis.totalViews?.toLocaleString(),       trend: trends.totalViews },
    { label: 'Total Blogs',       value: kpis.totalBlogs?.toLocaleString(),        trend: trends.totalBlogs },
    { label: 'Total Comments',    value: kpis.totalComments?.toLocaleString(),     trend: trends.totalComments },
    { label: 'Avg Engagement',    value: kpis.avgEngagement,                       trend: trends.avgEngagement },
    { label: 'Approval Rate',     value: kpis.approvalRate != null ? `${kpis.approvalRate}%` : '\u2014', trend: trends.approvalRate },
    { label: 'Most Active',       value: kpis.mostActiveCategory }
  ]

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8'>
      {cards.map(card => <KpiCard key={card.label} {...card} />)}
    </div>
  )
}

export default KpiSection
