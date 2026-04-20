import React from 'react'
import {
  CategoryDistributionChart,
  CommentActivityChart,
  PublicationsChart,
  ViewsByCategoryChart,
  ViewsOverTimeChart,
} from './charts'

function ChartSection({
  viewsOverTime,
  publications,
  categoryDistribution,
  commentActivity,
  viewsByCategory,
  onViewsPointClick,
  onCategoryClick,
  loading,
}) {
  return (
    <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
      <div className='lg:col-span-2'>
        <ViewsOverTimeChart
          data={viewsOverTime}
          onPointClick={onViewsPointClick}
          loading={loading}
        />
      </div>
      <PublicationsChart data={publications} />
      <CategoryDistributionChart
        data={categoryDistribution}
        onCategoryClick={onCategoryClick}
      />
      <CommentActivityChart data={commentActivity} />
      <ViewsByCategoryChart data={viewsByCategory} />
    </div>
  )
}

export default ChartSection
