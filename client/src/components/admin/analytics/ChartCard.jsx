import React from 'react'

function ChartCardSkeleton() {
  return (
    <div className='animate-pulse space-y-4'>
      <div className='h-4 bg-gray-200 rounded w-1/3' />
      <div className='h-48 bg-gray-200 rounded' />
    </div>
  )
}

function ChartCard({ title, loading, error, isEmpty, emptyMessage, onRetry, children }) {
  return (
    <div className='bg-white rounded-lg shadow p-5'>
      {title && <h3 className='text-sm font-semibold text-gray-600 mb-4'>{title}</h3>}

      {loading ? (
        <ChartCardSkeleton />
      ) : error ? (
        <div className='flex flex-col items-center justify-center py-8 text-gray-400'>
          <p className='mb-2'>{error}</p>
          {onRetry && (
            <button onClick={onRetry} className='text-sm text-primary hover:underline cursor-pointer'>
              Try again
            </button>
          )}
        </div>
      ) : isEmpty ? (
        <div className='flex items-center justify-center py-8 text-gray-400'>
          <p>{emptyMessage || 'No data available'}</p>
        </div>
      ) : (
        children
      )}
    </div>
  )
}

export default ChartCard
