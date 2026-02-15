import React from 'react'
import { formatShortDate } from '../../../utils/formatters'
import ChartCard from './ChartCard'

function TopViewedPosts({ posts }) {
  return (
    <ChartCard
      title='Top Viewed Posts'
      isEmpty={!posts?.length}
      emptyMessage='No views data'
    >
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='text-xs text-gray-400 text-left border-b'>
              <th className='pb-2 pr-4'>Title</th>
              <th className='pb-2 px-3'>Category</th>
              <th className='pb-2 px-3 text-right'>Views</th>
              <th className='pb-2 px-3 text-right'>Comments</th>
              <th className='pb-2 pl-3 text-right'>Publish Date</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id} className='border-b last:border-0 align-top'>
                <td className='py-2 pr-4 font-medium text-indigo-600'>
                  {post.title}
                </td>
                <td className='py-2 px-3 text-gray-500 whitespace-nowrap'>{post.category}</td>
                <td className='py-2 px-3 text-right font-semibold text-gray-700'>
                  {post.views}
                </td>
                <td className='py-2 px-3 text-right text-gray-700'>
                  {post.comments}
                </td>
                <td className='py-2 pl-3 text-right text-gray-500 text-xs'>
                  {formatShortDate(post.publishDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  )
}

function TopCommentedPosts({ posts }) {
  return (
    <ChartCard
      title='Top Commented Posts'
      isEmpty={!posts?.length}
      emptyMessage='No comments data'
    >
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='text-xs text-gray-400 text-left border-b'>
              <th className='pb-2 pr-4'>Title</th>
              <th className='pb-2 px-3'>Category</th>
              <th className='pb-2 px-3 text-right'>Comments</th>
              <th className='pb-2 pl-3 text-right'>Views</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id} className='border-b last:border-0 align-top'>
                <td className='py-2 pr-4 font-medium text-indigo-600'>
                  {post.title}
                </td>
                <td className='py-2 px-3 text-gray-500 whitespace-nowrap'>{post.category}</td>
                <td className='py-2 px-3 text-right font-semibold text-gray-700 whitespace-nowrap'>
                  {post.approvedComments} / {post.totalComments}
                </td>
                <td className='py-2 pl-3 text-right text-gray-700'>
                  {post.views}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  )
}

function TopPostsTable({ topByViews, topByComments, loading, error, refetch }) {
  if (loading) {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        <ChartCard title='Top Viewed Posts' loading />
        <ChartCard title='Top Commented Posts' loading />
      </div>
    )
  }

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

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
      <TopViewedPosts posts={topByViews} />
      <TopCommentedPosts posts={topByComments} />
    </div>
  )
}

export default TopPostsTable
