/**
 * Compute a { startDate, endDate } range from a number of days ago until today.
 * Returns empty strings when `days` is falsy (used for "All" preset).
 */
export const getDateRange = (days) => {
  if (!days) return { startDate: '', endDate: '' }
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  }
}
