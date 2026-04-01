import React from 'react'
import TopViewedTable from '../tables/TopViewedTable'
import TopCommentedTable from '../tables/TopCommentedTable'
import RecentCommentsTable from '../tables/RecentCommentsTable'

function TableSection({ filterParams }) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
      <TopViewedTable filterParams={filterParams} />
      <TopCommentedTable filterParams={filterParams} />
      <RecentCommentsTable filterParams={filterParams} />
    </div>
  )
}

export default TableSection
