/**
 * Generate page numbers for pagination with ellipsis
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @returns {Array<number|string>} Array of page numbers and '...' for ellipsis
 */
export function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 0) return []
  if (totalPages === 1) return [1]
  if (totalPages <= 7) {
    // Show all pages if 7 or fewer
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = []
  
  // Always show first page
  pages.push(1)
  
  if (currentPage <= 3) {
    // Near the beginning: 1, 2, 3, 4, ..., last
    pages.push(2, 3, 4)
    pages.push('...')
    pages.push(totalPages)
  } else if (currentPage >= totalPages - 2) {
    // Near the end: 1, ..., last-3, last-2, last-1, last
    pages.push('...')
    pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
  } else {
    // In the middle: 1, ..., current-1, current, current+1, ..., last
    pages.push('...')
    pages.push(currentPage - 1, currentPage, currentPage + 1)
    pages.push('...')
    pages.push(totalPages)
  }
  
  return pages
}

/**
 * Calculate start and end indices for pagination display
 * @param {number} currentPage - Current page number
 * @param {number} limit - Items per page
 * @param {number} totalCount - Total number of items
 * @returns {{startIndex: number, endIndex: number}}
 */
export function getPaginationRange(currentPage, limit, totalCount) {
  const startIndex = (currentPage - 1) * limit + 1
  const endIndex = Math.min(currentPage * limit, totalCount)
  return { startIndex, endIndex }
}

