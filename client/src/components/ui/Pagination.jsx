import React from 'react'
import { getPageNumbers, getPaginationRange } from '../../utils/pagination'

function Pagination({ pagination, limit, onPageChange, itemLabel = 'items' }) {
  const pageNumbers = getPageNumbers(pagination.currentPage, pagination.totalPages)
  const { startIndex, endIndex } = getPaginationRange(
    pagination.currentPage,
    limit,
    pagination.totalCount
  )

  return (
    <div className='mt-6'>
      <p className='text-sm text-gray-500 mb-4 text-center'>
        Showing {startIndex}-{endIndex} of {pagination.totalCount} {itemLabel}
      </p>
      <div className='flex items-center justify-center gap-2'>
        <button
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className='px-3 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          Prev
        </button>

        {pageNumbers.map((num, idx) => (
          <React.Fragment key={idx}>
            {num === '...' ? (
              <span className='px-2'>...</span>
            ) : (
              <button
                onClick={() => onPageChange(num)}
                className={`px-3 py-2 border rounded transition-colors ${
                  num === pagination.currentPage
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                {num}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className='px-3 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Pagination

