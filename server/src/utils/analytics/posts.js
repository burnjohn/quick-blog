import { formatDay } from './dateRange.js'
import { emptyTotals, addRow, kpiValue, round1 } from './kpi.js'

// Blogs matching tag / author filters (empty filter = no restriction)
export const filterBlogs = (blogs, { tags = [], authors = [] } = {}) =>
  blogs.filter(blog =>
    (!tags.length || (blog.tags || []).some(tag => tags.includes(tag))) &&
    (!authors.length || authors.includes(String(blog.author?._id ?? blog.author))))

// Rows belonging to the given blog ids and (optionally) sources
export const filterRows = (rows, { blogIds, sources = [] } = {}) =>
  rows.filter(row =>
    (!blogIds || blogIds.has(String(row.blog))) && (!sources.length || sources.includes(row.source)))

export const authorOf = (blog) => ({ id: String(blog.author?._id ?? blog.author), name: blog.author?.name ?? blog.authorName })

// Post metadata shared by the posts table, post details and CSV
export const postInfo = (blog) => ({
  id: String(blog._id),
  title: blog.title,
  category: blog.category,
  tags: blog.tags || [],
  author: authorOf(blog),
  publishedAt: formatDay(blog.createdAt)
})

export const postMetrics = (totals) => ({
  views: totals.views,
  uniqueVisitors: totals.uniqueVisitors,
  avgReadTimeSec: kpiValue('avgReadTimeSec', totals),
  avgScrollDepth: kpiValue('avgScrollDepth', totals),
  likes: totals.likes,
  comments: totals.comments,
  shares: totals.shares,
  subscriptions: totals.subscriptions,
  engagementRate: round1(kpiValue('engagementRate', totals))
})

// One entry per blog (including those without views), sorted by views desc
export const buildPosts = (rows, blogs) => {
  const totals = new Map()
  for (const row of rows) {
    const key = String(row.blog)
    totals.set(key, addRow(totals.get(key) || emptyTotals(), row))
  }
  return blogs
    .map(blog => ({ ...postInfo(blog), ...postMetrics(totals.get(String(blog._id)) || emptyTotals()) }))
    .sort((a, b) => b.views - a.views || a.title.localeCompare(b.title))
}
