import Blog from '../models/Blog.js'
import AnalyticsDaily from '../models/AnalyticsDaily.js'
import { SOURCES } from '../constants/analytics.js'
import { defaultRange, formatDay, previousRange, splitRows } from '../utils/analytics/dateRange.js'
import { buildKpis, sumRows } from '../utils/analytics/kpi.js'
import { buildSeries, buildPostSeries } from '../utils/analytics/series.js'
import {
  sourceBreakdown, deviceBreakdown, countryBreakdown, tagBreakdown, categoryBreakdown
} from '../utils/analytics/breakdowns.js'
import { filterBlogs, buildPosts, postInfo } from '../utils/analytics/posts.js'
import { buildHeatmap } from '../utils/analytics/heatmap.js'
import { buildFunnel } from '../utils/analytics/funnel.js'
import { buildCsv, exportFilename } from '../utils/analytics/csv.js'

const ROW_PROJECTION = 'date blog source views uniqueVisitors readTimeSec scrollDepthSum engagedReads likes comments shares subscriptions countries devices hours'
const BLOG_PROJECTION = 'title category tags author authorName createdAt'

const dateBounds = async () => {
  const [first] = await AnalyticsDaily.find().sort({ date: 1 }).limit(1).select('date').lean()
  const [last] = await AnalyticsDaily.find().sort({ date: -1 }).limit(1).select('date').lean()
  return { min: first ? formatDay(first.date) : null, max: last ? formatDay(last.date) : null }
}

export const getMeta = async () => {
  const blogs = await Blog.find().select(BLOG_PROJECTION).lean()
  const authors = new Map(blogs.map(blog => [String(blog.author), blog.authorName]))
  return {
    tags: [...new Set(blogs.flatMap(blog => blog.tags || []))].sort(),
    categories: [...new Set(blogs.map(blog => blog.category))].sort(),
    authors: [...authors].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name)),
    sources: SOURCES,
    dateBounds: await dateBounds()
  }
}

// Explicit range, or the last 30 days ending at the latest day with data (today when there is none)
const resolveRange = async (range) => {
  if (range) return range
  const { max } = await dateBounds()
  return defaultRange(max || formatDay(new Date()))
}

// Loads filtered blogs and rows for the current and previous period
const loadSlice = async ({ range: requested, tags, authors, sources }) => {
  const range = await resolveRange(requested)
  const previous = previousRange(range)
  const allBlogs = await Blog.find().select(BLOG_PROJECTION).lean()
  const blogs = filterBlogs(allBlogs, { tags, authors })
  const query = { date: { $gte: new Date(`${previous.from}T00:00:00.000Z`), $lte: new Date(`${range.to}T00:00:00.000Z`) } }
  const rows = blogs.length ? await AnalyticsDaily.find({
    ...query,
    blog: { $in: blogs.map(blog => blog._id) },
    ...(sources.length && { source: { $in: sources } })
  }).select(ROW_PROJECTION).lean() : []
  const { current, previous: prior } = splitRows(rows, range, previous)
  return { range, previous, blogs, current, prior }
}

export const getOverview = async (query) => {
  const { range, previous, blogs, current, prior } = await loadSlice(query)
  const blogsById = new Map(blogs.map(blog => [String(blog._id), blog]))
  return {
    range,
    previousRange: { from: previous.from, to: previous.to },
    kpis: buildKpis(current, prior, range),
    series: buildSeries(current, prior, range, previous),
    sources: sourceBreakdown(current),
    devices: deviceBreakdown(current),
    countries: countryBreakdown(current),
    tags: tagBreakdown(current, blogsById),
    categories: categoryBreakdown(current, blogsById),
    heatmap: buildHeatmap(current),
    funnel: buildFunnel(sumRows(current)),
    posts: buildPosts(current, blogs)
  }
}

// Returns null for an unknown post. Tag/author filters are ignored; sources and range apply.
export const getPostDetails = async (id, query) => {
  const blog = await Blog.findById(id).select(BLOG_PROJECTION).lean()
  if (!blog) return null
  const range = await resolveRange(query.range)
  const previous = previousRange(range)
  const rows = await AnalyticsDaily.find({
    blog: blog._id,
    date: { $gte: new Date(`${previous.from}T00:00:00.000Z`), $lte: new Date(`${range.to}T00:00:00.000Z`) },
    ...(query.sources.length && { source: { $in: query.sources } })
  }).select(ROW_PROJECTION).lean()
  const { current, previous: prior } = splitRows(rows, range, previous)
  return {
    ...postInfo(blog),
    url: `/blog/${blog._id}`,
    kpis: buildKpis(current, prior, range),
    series: buildPostSeries(current, range),
    sources: sourceBreakdown(current),
    devices: deviceBreakdown(current)
  }
}

export const getExport = async (query) => {
  const { range, blogs, current } = await loadSlice(query)
  return { csv: buildCsv(buildPosts(current, blogs)), filename: exportFilename(range.from, range.to) }
}
