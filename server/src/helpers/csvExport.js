/**
 * Escape a value for safe inclusion in a CSV field.
 * Handles commas, double-quotes, newlines, and carriage returns.
 */
export const escapeCsvField = (val) => {
  const str = String(val ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Format a blog document (from aggregation) into a CSV row string.
 */
export const formatBlogCsvRow = (blog) => {
  const dateStr = blog.createdAt ? new Date(blog.createdAt).toISOString().slice(0, 10) : ''
  const status = blog.isPublished ? 'published' : 'draft'
  return [
    escapeCsvField(blog.title),
    escapeCsvField(blog.category),
    dateStr,
    blog.views,
    blog.comments,
    status
  ].join(',')
}

export const CSV_HEADER = 'title,category,date,views,comments,status\n'
