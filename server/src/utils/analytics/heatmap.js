// 7 rows (Monday = 0 .. Sunday = 6, UTC) x 24 columns (hour 0..23) of views
export const buildHeatmap = (rows) => {
  const cells = Array.from({ length: 7 }, () => new Array(24).fill(0))
  for (const row of rows) {
    const dow = (new Date(row.date).getUTCDay() + 6) % 7
    const hours = row.hours || []
    for (let h = 0; h < 24; h++) cells[dow][h] += hours[h] || 0
  }
  return { max: Math.max(0, ...cells.flat()), cells }
}
