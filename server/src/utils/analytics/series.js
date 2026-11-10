import { addDays, bucketKey, diffDays, formatDay, listBuckets } from './dateRange.js'

const sumByBucket = (rows, bucket) => {
  const map = new Map()
  for (const row of rows) {
    const key = bucketKey(formatDay(row.date), bucket)
    const acc = map.get(key) || { views: 0, uniqueVisitors: 0 }
    acc.views += row.views
    acc.uniqueVisitors += row.uniqueVisitors
    map.set(key, acc)
  }
  return map
}

// Same as sumByBucket, but maps each previous-period day onto the matching current day (by offset
// from the range start) so both series share the current bucket list
const sumPreviousByBucket = (rows, range, previous) => {
  const shifted = rows.map(row => ({
    ...row,
    date: new Date(`${addDays(formatDay(row.date), diffDays(previous.from, range.from))}T00:00:00.000Z`)
  }))
  return sumByBucket(shifted, range.bucket)
}

// Trend series with the previous period aligned by day offset from the range start
export const buildSeries = (currentRows, previousRows, range, previous) => {
  const current = sumByBucket(currentRows, range.bucket)
  const prior = sumPreviousByBucket(previousRows, range, previous)
  return listBuckets(range).map((date) => {
    const cur = current.get(date)
    const prev = prior.get(date)
    return {
      date,
      views: cur?.views || 0,
      uniqueVisitors: cur?.uniqueVisitors || 0,
      previousViews: prev?.views || 0,
      previousUniqueVisitors: prev?.uniqueVisitors || 0
    }
  })
}

// Series for one post, bucketed like the overview (no previous period)
export const buildPostSeries = (rows, range) => buildSeries(rows, [], { ...range, bucket: range.bucket }, range)
  .map(({ date, views, uniqueVisitors }) => ({ date, views, uniqueVisitors }))
