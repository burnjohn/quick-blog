import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import BlogView from '../models/BlogView.js'
import { asyncHandler } from '../helpers/asyncHandler.js'
import {
  getDateRange,
  getPreviousPeriod,
  buildBlogFilter,
  buildViewFilter,
  getBucketSize
} from '../helpers/analyticsHelpers.js'

const parseFilters = (query) => {
  const { period, from, to, category } = query
  const dateRange = getDateRange(period, from, to)
  const viewFilter = buildViewFilter(category, dateRange)
  const blogFilter = buildBlogFilter(category, dateRange)
  return { period: period || '30d', from, to, category, dateRange, viewFilter, blogFilter }
}

export const trackView = asyncHandler(async (req, res) => {
  const { blogId } = req.params
  const { visitorKey, referrerSource = 'direct' } = req.body

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ success: false, message: 'Invalid blog ID' })
  }

  if (!visitorKey) {
    return res.status(400).json({ success: false, message: 'visitorKey is required' })
  }

  const blog = await Blog.findOne({ _id: blogId, isPublished: true })
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' })
  }

  // Detect admin via optional JWT (do NOT use auth middleware — this route must stay public)
  let isAdminView = false
  const authHeader = req.headers.authorization
  if (authHeader) {
    try {
      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      isAdminView = decoded.role === 'admin'
    } catch (_) { /* ignore — public route, invalid token is fine */ }
  }

  // Deduplication: skip if same visitorKey + blog within 24h
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const existing = await BlogView.findOne({
    blog: blogId,
    visitorKey,
    viewedAt: { $gte: cutoff }
  })
  if (existing) {
    return res.json({ success: true, message: 'Already recorded' })
  }

  await BlogView.create({ blog: blogId, visitorKey, referrerSource, isAdminView })
  return res.status(201).json({ success: true, message: 'View recorded' })
})

export const getKpis = asyncHandler(async (req, res) => {
  const { period, from, to, category, dateRange, viewFilter, blogFilter } = parseFilters(req.query)

  const prevPeriod = getPreviousPeriod(dateRange.startDate, dateRange.endDate)
  const prevViewFilter = buildViewFilter(category, prevPeriod)
  const prevBlogFilter = buildBlogFilter(category, prevPeriod)

  const [
    totalViews, totalBlogs, totalComments, approvedComments,
    prevViews, prevBlogs, prevComments, prevApproved,
    categoryGroups
  ] = await Promise.all([
    BlogView.countDocuments(viewFilter),
    Blog.countDocuments(blogFilter),
    Comment.countDocuments(),
    Comment.countDocuments({ isApproved: true }),
    BlogView.countDocuments(prevViewFilter),
    Blog.countDocuments(prevBlogFilter),
    Comment.countDocuments(),
    Comment.countDocuments({ isApproved: true }),
    Blog.aggregate([
      { $match: blogFilter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
  ])

  const avgEngagement = totalBlogs > 0 ? parseFloat((totalViews / totalBlogs).toFixed(1)) : 0
  const prevAvgEngagement = prevBlogs > 0 ? parseFloat((prevViews / prevBlogs).toFixed(1)) : 0
  const approvalRate = totalComments > 0 ? Math.round((approvedComments / totalComments) * 100) : 0
  const prevApprovalRate = prevComments > 0 ? Math.round((prevApproved / prevComments) * 100) : 0
  const mostActiveCategory = categoryGroups[0]?._id || 'N/A'

  const calcTrend = (current, previous) => {
    if (previous === 0) return { direction: 'neutral', percent: 0 }
    const diff = current - previous
    const percent = Math.round(Math.abs(diff / previous) * 100)
    return { direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral', percent }
  }

  res.json({
    success: true,
    kpis: { totalViews, totalBlogs, totalComments, avgEngagement, approvalRate, mostActiveCategory },
    trends: {
      totalViews: calcTrend(totalViews, prevViews),
      totalBlogs: calcTrend(totalBlogs, prevBlogs),
      totalComments: calcTrend(totalComments, prevComments),
      avgEngagement: calcTrend(avgEngagement, prevAvgEngagement),
      approvalRate: calcTrend(approvalRate, prevApprovalRate)
    }
  })
})

export const getViewsOverTime = asyncHandler(async (req, res) => {
  const { dateRange, viewFilter } = parseFilters(req.query)
  const bucketSize = getBucketSize(dateRange.startDate, dateRange.endDate)
  const dateFormat = bucketSize === 'day' ? '%Y-%m-%d' : bucketSize === 'week' ? '%Y-%V' : '%Y-%m'

  const series = await BlogView.aggregate([
    { $match: viewFilter },
    { $group: { _id: { $dateToString: { format: dateFormat, date: '$viewedAt' } }, views: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: '$_id', views: 1 } }
  ])

  res.json({ success: true, series, bucketSize })
})

export const getPublications = asyncHandler(async (req, res) => {
  const { dateRange, blogFilter } = parseFilters(req.query)
  const bucketSize = getBucketSize(dateRange.startDate, dateRange.endDate)
  const dateFormat = bucketSize === 'day' ? '%Y-%m-%d' : bucketSize === 'week' ? '%Y-%V' : '%Y-%m'

  const raw = await Blog.aggregate([
    { $match: blogFilter },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          category: '$category'
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.date': 1 } }
  ])

  // Reshape into [{ date, Technology: N, Lifestyle: N, Startup: N, Finance: N }]
  const dateMap = {}
  raw.forEach(({ _id: { date, category }, count }) => {
    if (!dateMap[date]) dateMap[date] = { date }
    dateMap[date][category] = count
  })
  const series = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date))

  res.json({ success: true, series, bucketSize })
})

export const getCategoryDistribution = asyncHandler(async (req, res) => {
  const { blogFilter } = parseFilters(req.query)
  const total = await Blog.countDocuments(blogFilter)
  const groups = await Blog.aggregate([
    { $match: blogFilter },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])
  const distribution = groups.map(g => ({
    category: g._id,
    count: g.count,
    percentage: total > 0 ? Math.round((g.count / total) * 100) : 0
  }))
  res.json({ success: true, distribution })
})

export const getCommentActivity = asyncHandler(async (req, res) => {
  const { dateRange } = parseFilters(req.query)
  const bucketSize = getBucketSize(dateRange.startDate, dateRange.endDate)
  const dateFormat = bucketSize === 'day' ? '%Y-%m-%d' : bucketSize === 'week' ? '%Y-%V' : '%Y-%m'

  const commentDateFilter = dateRange
    ? { createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate } }
    : {}

  const series = await Comment.aggregate([
    { $match: commentDateFilter },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
        approved: { $sum: { $cond: ['$isApproved', 1, 0] } },
        pending:  { $sum: { $cond: ['$isApproved', 0, 1] } }
      }
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: '$_id', approved: 1, pending: 1 } }
  ])

  res.json({ success: true, series, bucketSize })
})

export const getViewsByCategory = asyncHandler(async (req, res) => {
  const { category, viewFilter } = parseFilters(req.query)

  const pipeline = [
    { $match: viewFilter },
    { $lookup: { from: 'blogs', localField: 'blog', foreignField: '_id', as: 'blogData' } },
    { $unwind: '$blogData' },
    ...(category && category !== 'all' ? [{ $match: { 'blogData.category': category } }] : []),
    { $group: { _id: '$blogData.category', views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $project: { _id: 0, category: '$_id', views: 1 } }
  ]

  const categories = await BlogView.aggregate(pipeline)
  res.json({ success: true, categories })
})

export const getTopViewed = asyncHandler(async (req, res) => {
  const { viewFilter } = parseFilters(req.query)

  const topBlogs = await BlogView.aggregate([
    { $match: viewFilter },
    { $group: { _id: '$blog', views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'blogs', localField: '_id', foreignField: '_id', as: 'blog' } },
    { $unwind: '$blog' },
    { $project: { _id: 0, blogId: '$blog._id', title: '$blog.title', category: '$blog.category', publishDate: '$blog.createdAt', isPublished: '$blog.isPublished', views: 1 } }
  ])

  const blogs = await Promise.all(
    topBlogs.map(async (b) => ({
      ...b,
      comments: await Comment.countDocuments({ blog: b.blogId })
    }))
  )

  res.json({ success: true, blogs })
})

export const getTopCommented = asyncHandler(async (req, res) => {
  const { blogFilter, viewFilter } = parseFilters(req.query)

  const topBlogs = await Comment.aggregate([
    { $group: { _id: '$blog', total: { $sum: 1 }, approved: { $sum: { $cond: ['$isApproved', 1, 0] } } } },
    { $sort: { approved: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'blogs', localField: '_id', foreignField: '_id', as: 'blog' } },
    { $unwind: '$blog' },
    { $project: { _id: 0, blogId: '$blog._id', title: '$blog.title', category: '$blog.category', publishDate: '$blog.createdAt', approved: 1, total: 1 } }
  ])

  const blogs = await Promise.all(
    topBlogs.map(async (b) => ({
      ...b,
      comments: `${b.approved}/${b.total}`,
      views: await BlogView.countDocuments({ blog: b.blogId, ...viewFilter })
    }))
  )

  res.json({ success: true, blogs })
})

export const getLastComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('blog', 'title')
    .lean()

  const formatted = comments.map(c => ({
    author: c.name,
    text: c.content.length > 100 ? c.content.slice(0, 100) + '…' : c.content,
    blogTitle: c.blog?.title || 'Unknown',
    date: c.createdAt,
    isApproved: c.isApproved
  }))

  res.json({ success: true, comments: formatted })
})

export const getDrillDown = asyncHandler(async (req, res) => {
  const { date, bucketSize = 'day', viewFilter } = { ...parseFilters(req.query), ...req.query }

  if (!date) {
    return res.status(400).json({ success: false, message: 'date param required' })
  }

  const dateFormat = bucketSize === 'day' ? '%Y-%m-%d' : bucketSize === 'week' ? '%Y-%V' : '%Y-%m'

  const blogs = await BlogView.aggregate([
    { $match: viewFilter },
    { $match: { $expr: { $eq: [{ $dateToString: { format: dateFormat, date: '$viewedAt' } }, date] } } },
    { $group: { _id: '$blog', views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $lookup: { from: 'blogs', localField: '_id', foreignField: '_id', as: 'blog' } },
    { $unwind: '$blog' },
    { $project: { _id: 0, title: '$blog.title', category: '$blog.category', publishDate: '$blog.createdAt', views: 1 } }
  ])

  res.json({ success: true, date, bucketSize, blogs })
})

export const exportCsv = asyncHandler(async (req, res) => {
  const { period = '30d', blogFilter, viewFilter } = parseFilters(req.query)

  const blogs = await Blog.find(blogFilter).sort({ createdAt: -1 }).lean()

  const blogsWithCounts = await Promise.all(
    blogs.map(async (blog) => {
      const views = await BlogView.countDocuments({ blog: blog._id, ...viewFilter })
      const comments = await Comment.countDocuments({ blog: blog._id })
      return { ...blog, views, commentCount: comments }
    })
  )

  const escape = (str) => `"${String(str).replace(/"/g, '""')}"`
  const header = 'Title,Category,Publish Date,Views,Comment Count,Status'
  const rows = blogsWithCounts.map(b => [
    escape(b.title),
    b.category,
    new Date(b.createdAt).toISOString().slice(0, 10),
    b.views,
    b.commentCount,
    b.isPublished ? 'Published' : 'Draft'
  ].join(','))

  const csv = [header, ...rows].join('\n')
  const filename = `blog-analytics-${period}-${new Date().toISOString().slice(0, 10)}.csv`

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(csv)
})
