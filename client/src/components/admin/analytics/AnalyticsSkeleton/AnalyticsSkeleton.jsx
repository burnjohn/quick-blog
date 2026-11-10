import React from 'react'
import AnalyticsShell from '../AnalyticsShell'

const Block = ({ className }) => (
  <div
    className={`analytics-shimmer rounded-2xl border border-white/10 bg-white/5 ${className}`}
  />
)

const KPI_PLACEHOLDERS = [0, 1, 2, 3, 4, 5]

// Loading placeholder shaped like the page. `embedded` skips the dark shell
// (used inside the page, which already renders one).
function AnalyticsSkeleton({ embedded = false }) {
  const content = (
    <div role='status' aria-busy='true' aria-label='Loading analytics' className='space-y-6'>
      <Block className='h-12 w-64 max-w-full' />
      <Block className='h-12 w-full' />
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {KPI_PLACEHOLDERS.map((i) => (
          <Block key={i} className='h-32' />
        ))}
      </div>
      <Block className='h-72 w-full' />
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <Block className='h-64' />
        <Block className='h-64' />
      </div>
    </div>
  )

  return embedded ? content : <AnalyticsShell>{content}</AnalyticsShell>
}

export default AnalyticsSkeleton
