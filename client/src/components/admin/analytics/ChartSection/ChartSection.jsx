import React, { useState } from 'react'
import ViewsOverTime from '../charts/ViewsOverTime'
import PublicationsOverTime from '../charts/PublicationsOverTime'
import CategoryDistribution from '../charts/CategoryDistribution'
import CommentActivity from '../charts/CommentActivity'
import ViewsByCategory from '../charts/ViewsByCategory'
import DrillDownModal from '../DrillDownModal'

function ChartSection({ filterParams, onFilterChange }) {
  const [drillDownDate, setDrillDownDate] = useState(null)

  const handleCategoryClick = (category) => {
    onFilterChange({ category })
  }

  return (
    <div className='mb-8'>
      <ViewsOverTime filterParams={filterParams} />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
        <PublicationsOverTime filterParams={filterParams} />
        <CategoryDistribution filterParams={filterParams} onSegmentClick={handleCategoryClick} />
        <CommentActivity filterParams={filterParams} />
        <ViewsByCategory filterParams={filterParams} />
      </div>
      {drillDownDate && (
        <DrillDownModal
          filterParams={filterParams}
          date={drillDownDate}
          onClose={() => setDrillDownDate(null)}
        />
      )}
    </div>
  )
}

export default ChartSection
