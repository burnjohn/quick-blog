import { DEVICES, SOURCES } from '../../constants/analytics.js'

const share = (views, total) => (total ? Math.round((views / total) * 10000) / 10000 : 0)
const byViewsDesc = (a, b) => b.views - a.views

const toEntries = (map, total, keyName) =>
  [...map.entries()].map(([key, views]) => ({ [keyName]: key, views, share: share(views, total) })).sort(byViewsDesc)

const totalOf = (map) => [...map.values()].reduce((a, b) => a + b, 0)

export const sourceBreakdown = (rows) => {
  const map = new Map(SOURCES.map(s => [s, 0]))
  for (const row of rows) map.set(row.source, (map.get(row.source) || 0) + row.views)
  return toEntries(new Map([...map].filter(([, v]) => v > 0)), totalOf(map), 'key')
}

export const deviceBreakdown = (rows) => {
  const map = new Map(DEVICES.map(d => [d, 0]))
  for (const row of rows) for (const d of DEVICES) map.set(d, map.get(d) + (row.devices?.[d] || 0))
  return toEntries(new Map([...map].filter(([, v]) => v > 0)), totalOf(map), 'key')
}

// Rows may carry countries as a Map or (from lean queries) a plain object
export const countryBreakdown = (rows) => {
  const map = new Map()
  for (const row of rows) {
    const entries = row.countries instanceof Map ? row.countries.entries() : Object.entries(row.countries || {})
    for (const [code, views] of entries) map.set(code, (map.get(code) || 0) + views)
  }
  return toEntries(map, totalOf(map), 'code')
}

// Views grouped by a per-post key list (tags) or single key (category); "posts" counts distinct posts
const groupByPost = (rows, blogsById, keysOf) => {
  const views = new Map()
  const postSets = new Map()
  for (const row of rows) {
    const blog = blogsById.get(String(row.blog))
    if (!blog) continue
    for (const key of keysOf(blog)) {
      views.set(key, (views.get(key) || 0) + row.views)
      if (!postSets.has(key)) postSets.set(key, new Set())
      postSets.get(key).add(String(row.blog))
    }
  }
  return [...views.entries()]
    .map(([key, v]) => ({ key, views: v, posts: postSets.get(key).size }))
    .sort((a, b) => b.views - a.views || a.key.localeCompare(b.key))
}

export const tagBreakdown = (rows, blogsById) => groupByPost(rows, blogsById, blog => blog.tags || [])

export const categoryBreakdown = (rows, blogsById) => groupByPost(rows, blogsById, blog => [blog.category])
