import { bucketKey, formatDay, listBuckets } from './dateRange.js'

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

// Trend series with the previous period aligned by bucket index
export const buildSeries = (currentRows, previousRows, range, previous) => {
  const current = sumByBucket(currentRows, range.bucket)
  const prior = sumByBucket(previousRows, range.bucket)
  const priorKeys = listBuckets({ ...previous, bucket: range.bucket })
  return listBuckets(range).map((date, i) => {
    const cur = current.get(date)
    const prev = prior.get(priorKeys[i])
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
