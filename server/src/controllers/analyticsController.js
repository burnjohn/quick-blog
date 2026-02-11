import jwt from 'jsonwebtoken'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import BlogView from '../models/BlogView.js'
import { asyncHandler } from '../helpers/asyncHandler.js'
import { sendData, sendError } from '../helpers/response.js'
import {
  getDateRange,
  getPreviousPeriod,
  calculateTrend,
  getBucketSize,
  buildBlogFilter,
  buildViewFilter,
  parseChartDateToRange,
  CATEGORIES
} from '../helpers/analyticsAggregations.js'
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  HTTP_STATUS
} from '../constants/messages.js'

const referrerSourceEnum = ['direct', 'search', 'social', 'other']

export const getKpis = asyncHandler(async (req, res) => {
  const filter = req.analyticsFilter
  const { from, to } = filter
  const prev = getPreviousPeriod(from, to)

  const blogFilter = buildBlogFilter(filter)
  const prevBlogFilter = buildBlogFilter({
    ...filter,
    from: prev.from,
    to: prev.to
  })

  const [blogs, prevBlogs] = await Promise.all([
    Blog.find(blogFilter).select('_id category isPublished').lean(),
    Blog.find(prevBlogFilter).select('_id isPublished').lean()
  ])

  const blogIds = blogs.map((b) => b._id)
  const prevBlogIds = prevBlogs.map((b) => b._id)
  const publishedCount = blogs.filter((b) => b.isPublished).length
  const publishedBlogIds = blogs.filter((b) => b.isPublished).map((b) => b._id)
  const prevPublishedCount = prevBlogs.filter((b) => b.isPublished).length
  const prevPublishedBlogIds = prevBlogs
    .filter((b) => b.isPublished)
    .map((b) => b._id)

  const viewFilterCur = buildViewFilter({ from, to }, blogIds)
  const viewFilterPrev = buildViewFilter(
    { from: prev.from, to: prev.to },
    prevBlogIds
  )

  const [
    totalViewsCur,
    totalViewsPrev,
    totalCommentsCur,
    totalCommentsPrev,
    approvedCur,
    approvedPrev,
    prevViewsForPublished
  ] = await Promise.all([
    BlogView.countDocuments(viewFilterCur),
    BlogView.countDocuments(viewFilterPrev),
    Comment.countDocuments({
      blog: { $in: blogIds },
      createdAt: { $gte: from, $lte: to }
    }),
    Comment.countDocuments({
      blog: { $in: prevBlogIds },
      createdAt: { $gte: prev.from, $lte: prev.to }
    }),
    Comment.countDocuments({
      blog: { $in: blogIds },
      createdAt: { $gte: from, $lte: to },
      isApproved: true
    }),
    Comment.countDocuments({
      blog: { $in: prevBlogIds },
      createdAt: { $gte: prev.from, $lte: prev.to },
      isApproved: true
    }),
    prevPublishedBlogIds.length > 0
      ? BlogView.countDocuments(
          buildViewFilter(
            { from: prev.from, to: prev.to },
            prevPublishedBlogIds
          )
        )
      : Promise.resolve(0)
  ])

  const totalBlogs = blogs.length

  const avgEngagementCur = publishedCount > 0 ? totalViewsCur / publishedCount : 0
  const avgEngagementPrev =
    prevPublishedCount > 0 ? prevViewsForPublished / prevPublishedCount : 0

  const approvalRateCur =
    totalCommentsCur > 0 ? (approvedCur / totalCommentsCur) * 100 : 0
  const approvalRatePrev =
    totalCommentsPrev > 0 ? (approvedPrev / totalCommentsPrev) * 100 : 0

  const categoryCounts = await Blog.aggregate([
    { $match: blogFilter },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ])
  const mostActiveCategory =
    categoryCounts.length > 0 ? categoryCounts[0]._id : null
  const mostActiveCategoryCount =
    categoryCounts.length > 0 ? categoryCounts[0].count : 0

  const kpis = {
    totalViews: {
      value: totalViewsCur,
      trend: calculateTrend(totalViewsCur, totalViewsPrev)
    },
    totalBlogs: {
      value: totalBlogs,
      published: publishedCount,
      drafts: totalBlogs - publishedCount,
      trend: calculateTrend(totalBlogs, prevBlogs.length)
    },
    totalComments: {
      value: totalCommentsCur,
      approved: approvedCur,
      pending: totalCommentsCur - approvedCur,
      trend: calculateTrend(totalCommentsCur, totalCommentsPrev)
    },
    avgEngagement: {
      value: Math.round(avgEngagementCur * 100) / 100,
      trend: calculateTrend(avgEngagementCur, avgEngagementPrev)
    },
    approvalRate: {
      value: Math.round(approvalRateCur * 100) / 100,
      trend: calculateTrend(approvalRateCur, approvalRatePrev)
    },
    mostActiveCategory: {
      value: mostActiveCategory,
      count: mostActiveCategoryCount,
      trend: { direction: 'unchanged', percentChange: 0 }
    }
  }

  return sendData(res, { kpis })
})

export const getViewsOverTime = asyncHandler(async (req, res) => {
  const filter = req.analyticsFilter
  const { from, to } = filter
  const bucketSize = getBucketSize(from, to)

  const blogFilter = buildBlogFilter(filter)
  const blogs = await Blog.find(blogFilter).select('_id').lean()
  const blogIds = blogs.map((b) => b._id)

  if (blogIds.length === 0) {
    return sendData(res, { data: [] })
  }

  const viewFilter = buildViewFilter(filter, blogIds)

  const dateExpr =
    bucketSize === 'day'
      ? { $dateToString: { format: '%Y-%m-%d', date: '$viewedAt' } }
      : bucketSize === 'week'
        ? {
            $concat: [
              { $toString: { $isoWeekYear: '$viewedAt' } },
              '-W',
              {
                $cond: [
                  { $lt: [{ $isoWeek: '$viewedAt' }, 10] },
                  { $concat: ['0', { $toString: { $isoWeek: '$viewedAt' } }] },
                  { $toString: { $isoWeek: '$viewedAt' } }
                ]
              }
            ]
          }
        : {
            $dateToString: {
              format: '%Y-%m',
              date: '$viewedAt'
            }
          }

  const pipeline = [
    { $match: viewFilter },
    {
      $group: {
        _id: dateExpr,
        views: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]

  const result = await BlogView.aggregate(pipeline)

  const data = result.map((r) => ({
    date: r._id,
    views: r.views
  }))

  return sendData(res, { data })
})

export const getPublicationsOverTime = asyncHandler(async (req, res) => {
  const filter = req.analyticsFilter
  const blogFilter = buildBlogFilter(filter)

  const pipeline = [
    { $match: blogFilter },
    {
      $group: {
        _id: {
          month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          category: '$category'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.month',
        categories: { $push: { category: '$_id.category', count: '$count' } }
      }
    },
    { $sort: { _id: 1 } }
  ]

  const result = await Blog.aggregate(pipeline)

  const categoryKeys = CATEGORIES.filter((c) => c !== 'All')
  const data = result.map((r) => {
    const row = { month: r._id }
    categoryKeys.forEach((cat) => {
      const found = r.categories.find((c) => c.category === cat)
      row[cat] = found ? found.count : 0
    })
    return row
  })

  return sendData(res, { data })
})

export const getCategoryDistribution = asyncHandler(async (req, res) => {
  const filter = req.analyticsFilter
  const blogFilter = { ...buildBlogFilter(filter), isPublished: true }

  const result = await Blog.aggregate([
    { $match: blogFilter },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])

  const data = result.map((r) => ({
    category: r._id,
    count: r.count
  }))

  return sendData(res, { data })
})

export const getCommentActivity = asyncHandler(async (req, res) => {
  const filter = req.analyticsFilter
  const { from, to } = filter

  const blogFilter = buildBlogFilter(filter)
  const blogs = await Blog.find(blogFilter).select('_id').lean()
  const blogIds = blogs.map((b) => b._id)

  if (blogIds.length === 0) {
    return sendData(res, { data: [] })
  }

  const result = await Comment.aggregate([
    {
      $match: {
        blog: { $in: blogIds },
        createdAt: { $gte: from, $lte: to }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        approved: {
          $sum: { $cond: ['$isApproved', 1, 0] }
        },
        pending: {
          $sum: { $cond: ['$isApproved', 0, 1] }
        }
      }
    },
    { $sort: { _id: 1 } }
  ])

  const data = result.map((r) => ({
    month: r._id,
    approved: r.approved,
    pending: r.pending
  }))

  return sendData(res, { data })
})

export const getViewsByCategory = asyncHandler(async (req, res) => {
  const filter = req.analyticsFilter
  const blogFilter = buildBlogFilter(filter)
  const blogs = await Blog.find(blogFilter).select('_id').lean()
  const blogIds = blogs.map((b) => b._id)

  if (blogIds.length === 0) {
    return sendData(res, { data: [] })
  }

  const viewFilter = buildViewFilter(filter, blogIds)

  const result = await BlogView.aggregate([
    { $match: viewFilter },
    {
      $lookup: {
        from: 'blogs',
        localField: 'blog',
        foreignField: '_id',
        as: 'blogDoc'
      }
    },
    { $unwind: '$blogDoc' },
    {
      $group: {
        _id: '$blogDoc.category',
        views: { $sum: 1 }
      }
    },
    { $sort: { views: -1 } }
  ])

  const data = result.map((r) => ({
    category: r._id,
    views: r.views
  }))

  return sendData(res, { data })
})

export const getTopViewed = asyncHandler(async (req, res) => {
  const filter = req.analyticsFilter
  const { from, to } = filter

  const blogFilter = buildBlogFilter(filter)
  const blogs = await Blog.find(blogFilter).select('_id').lean()
  const blogIds = blogs.map((b) => b._id)

  if (blogIds.length === 0) {
    return sendData(res, { data: [] })
  }

  const viewFilter = buildViewFilter(filter, blogIds)

  const result = await BlogView.aggregate([
    { $match: viewFilter },
    {
      $group: {
        _id: '$blog',
        views: { $sum: 1 }
      }
    },
    { $sort: { views: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'blogs',
        localField: '_id',
        foreignField: '_id',
        as: 'blog'
      }
    },
    { $unwind: '$blog' },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'blog',
        as: 'comments'
      }
    },
    {
      $project: {
        id: '$_id',
        title: '$blog.title',
        category: '$blog.category',
        views: 1,
        comments: { $size: '$comments' },
        publishDate: '$blog.createdAt',
        _id: 0
      }
    }
  ])

  const data = result.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    views: r.views,
    comments: r.comments,
    publishDate: r.publishDate
  }))

  return sendData(res, { data })
})

export const getTopCommented = asyncHandler(async (req, res) => {
  const filter = req.analyticsFilter
  const { from, to } = filter

  const blogFilter = buildBlogFilter(filter)
  const blogs = await Blog.find(blogFilter).select('_id').lean()
  const blogIds = blogs.map((b) => b._id)

  if (blogIds.length === 0) {
    return sendData(res, { data: [] })
  }

  const result = await Comment.aggregate([
    {
      $match: {
        blog: { $in: blogIds },
        createdAt: { $gte: from, $lte: to }
      }
    },
    {
      $group: {
        _id: '$blog',
        total: { $sum: 1 },
        approved: { $sum: { $cond: ['$isApproved', 1, 0] } }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'blogs',
        localField: '_id',
        foreignField: '_id',
        as: 'blog'
      }
    },
    { $unwind: '$blog' },
    {
      $lookup: {
        from: 'blogviews',
        let: { blogId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$blog', '$$blogId'] },
              viewedAt: { $gte: from, $lte: to },
              isAdminView: false
            }
          },
          { $count: 'views' }
        ],
        as: 'viewCount'
      }
    },
    {
      $project: {
        id: '$_id',
        title: '$blog.title',
        category: '$blog.category',
        comments: {
          approved: '$approved',
          total: '$total'
        },
        views: { $ifNull: [{ $arrayElemAt: ['$viewCount.views', 0] }, 0] },
        _id: 0
      }
    }
  ])

  const data = result.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    comments: r.comments,
    views: r.views
  }))

  return sendData(res, { data })
})

export const getLastComments = asyncHandler(async (req, res) => {
  const filter = req.analyticsFilter
  const blogFilter = buildBlogFilter(filter)
  const blogs = await Blog.find(blogFilter).select('_id').lean()
  const blogIds = blogs.map((b) => b._id)

  if (blogIds.length === 0) {
    return sendData(res, { data: [] })
  }

  const comments = await Comment.find({ blog: { $in: blogIds } })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('blog', 'title')
    .lean()

  const data = comments.map((c) => ({
    id: c._id,
    authorName: c.name,
    contentExcerpt:
      c.content?.length > 100 ? c.content.slice(0, 100) + '...' : c.content,
    blogTitle: c.blog?.title ?? '',
    blogId: c.blog?._id,
    createdAt: c.createdAt,
    status: c.isApproved ? 'approved' : 'pending'
  }))

  return sendData(res, { data })
})

export const exportCsv = asyncHandler(async (req, res) => {
  const filter = req.analyticsFilter
  const blogFilter = buildBlogFilter(filter)
  const blogs = await Blog.find(blogFilter).lean()

  const blogIds = blogs.map((b) => b._id)

  const [viewCounts, commentCounts] = await Promise.all([
    BlogView.aggregate([
      { $match: buildViewFilter(filter, blogIds) },
      { $group: { _id: '$blog', views: { $sum: 1 } } }
    ]),
    Comment.aggregate([
      { $match: { blog: { $in: blogIds } } },
      { $group: { _id: '$blog', count: { $sum: 1 } } }
    ])
  ])

  const viewMap = Object.fromEntries(viewCounts.map((v) => [v._id.toString(), v.views]))
  const commentMap = Object.fromEntries(
    commentCounts.map((c) => [c._id.toString(), c.count])
  )

  const rows = blogs.map((b) => {
    const id = b._id.toString()
    const views = viewMap[id] ?? 0
    const commentCount = commentMap[id] ?? 0
    const publishDate = b.createdAt
      ? new Date(b.createdAt).toISOString().slice(0, 10)
      : ''
    const status = b.isPublished ? 'Published' : 'Draft'
    return [
      escapeCSV(b.title),
      escapeCSV(b.category),
      escapeCSV(publishDate),
      String(views),
      String(commentCount),
      escapeCSV(status)
    ]
  })

  const header = 'Title,Category,Publish Date,Views,Comment Count,Status'
  const csv = [header, ...rows.map((r) => r.join(','))].join('\n')

  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="analytics-export-${new Date().toISOString().slice(0, 10)}.csv"`
  )
  res.send(csv)
})

function escapeCSV(val) {
  if (val == null) return ''
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export const getDrillDown = asyncHandler(async (req, res) => {
  const filter = req.analyticsFilter
  const dateStr = req.query?.date
  const range = parseChartDateToRange(dateStr)

  if (!range) {
    return sendError(
      res,
      ERROR_MESSAGES.INVALID_DRILL_DOWN_DATE,
      HTTP_STATUS.BAD_REQUEST
    )
  }

  const blogFilter = buildBlogFilter(filter)
  const blogs = await Blog.find(blogFilter).select('_id').lean()
  const blogIds = blogs.map((b) => b._id)

  if (blogIds.length === 0) {
    return sendData(res, { data: [] })
  }

  const viewFilter = {
    ...buildViewFilter({ from: range.from, to: range.to }, blogIds),
    viewedAt: { $gte: range.from, $lte: range.to }
  }

  const result = await BlogView.aggregate([
    { $match: viewFilter },
    {
      $group: {
        _id: '$blog',
        views: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'blogs',
        localField: '_id',
        foreignField: '_id',
        as: 'blog'
      }
    },
    { $unwind: '$blog' },
    {
      $project: {
        id: '$_id',
        title: '$blog.title',
        category: '$blog.category',
        views: 1,
        publishDate: '$blog.createdAt',
        _id: 0
      }
    },
    { $sort: { views: -1 } }
  ])

  const data = result.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    views: r.views,
    publishDate: r.publishDate
  }))

  return sendData(res, { data })
})

export const recordView = asyncHandler(async (req, res) => {
  const blogId = req.params?.blogId
  const visitorKey = req.body?.visitorKey
  const referrerSource = req.body?.referrerSource ?? 'direct'

  if (!visitorKey || typeof visitorKey !== 'string' || !visitorKey.trim()) {
    return sendError(
      res,
      ERROR_MESSAGES.MISSING_VISITOR_KEY,
      HTTP_STATUS.BAD_REQUEST
    )
  }

  if (!referrerSourceEnum.includes(referrerSource)) {
    return sendError(
      res,
      'referrerSource must be one of: direct, search, social, other',
      HTTP_STATUS.BAD_REQUEST
    )
  }

  const blog = await Blog.findById(blogId).select('isPublished').lean()
  if (!blog) {
    return sendError(res, ERROR_MESSAGES.BLOG_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
  }
  if (!blog.isPublished) {
    return sendError(
      res,
      ERROR_MESSAGES.BLOG_NOT_PUBLISHED,
      HTTP_STATUS.BAD_REQUEST
    )
  }

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const existing = await BlogView.findOne({
    blog: blogId,
    visitorKey: visitorKey.trim(),
    viewedAt: { $gte: twentyFourHoursAgo }
  })

  if (existing) {
    return sendError(
      res,
      ERROR_MESSAGES.VIEW_ALREADY_RECORDED,
      HTTP_STATUS.BAD_REQUEST
    )
  }

  let isAdminView = false
  const authHeader = req.headers?.authorization
  if (authHeader) {
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      if (decoded?.role === 'admin') {
        isAdminView = true
      }
    } catch {
      // Invalid/expired token — treat as non-admin view
    }
  }

  await BlogView.create({
    blog: blogId,
    visitorKey: visitorKey.trim(),
    referrerSource,
    isAdminView
  })

  return sendData(res, { message: SUCCESS_MESSAGES.VIEW_RECORDED })
})
