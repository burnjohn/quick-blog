import React from 'react'
import TopViewedTable from './TopViewedTable'
import TopCommentedTable from './TopCommentedTable'
import RecentCommentsTable from './RecentCommentsTable'

function TableSection({
  topViewed,
  topViewedLoading = false,
  topCommented,
  topCommentedLoading = false,
  recentComments,
  recentCommentsLoading = false,
}) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <TopViewedTable rows={topViewed} loading={topViewedLoading} />
        <TopCommentedTable rows={topCommented} loading={topCommentedLoading} />
      </div>
      <RecentCommentsTable rows={recentComments} loading={recentCommentsLoading} />
    </div>
  )
}

export default TableSection
