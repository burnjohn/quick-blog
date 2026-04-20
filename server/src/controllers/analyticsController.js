import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import BlogView from '../models/BlogView.js'
import { asyncHandler } from '../helpers/asyncHandler.js'
import { sendSuccess, sendError } from '../helpers/response.js'
import {
  getDateRange,
  getPreviousPeriod,
  buildBlogFilter,
  buildViewFilter,
  getBucketSize,
  calculateTrend,
  isValidCategory,
  VALID_CATEGORIES
} from '../helpers/analyticsAggregations.js'

const DAY_MS = 24 * 60 * 60 * 1000
const BUCKET_UNIT = { day: 'day', week: 'week', month: 'month' }

const SEARCH_HOST_RE = /^(www\.)?(google|bing|yahoo|duckduckgo|baidu|yandex|ecosia)\./
const SOCIAL_HOST_RE = /(facebook|twitter|t\.co|x\.com|linkedin|reddit|instagram|tiktok|pinterest|youtube|whatsapp|telegram|mastodon)/

const makeVisitorKey = (req) => {
  const ip = (req.ip || req.connection?.remoteAddress || '').toString()
  const ua = (req.get?.('user-agent') || req.headers['user-agent'] || '').toString()
  return crypto.createHash('sha256').update(`${ip}|${ua}`).digest('hex').slice(0, 48)
}

const deriveReferrerSource = (req) => {
  const referer = req.get?.('referer') || req.headers.referer || ''
  if (!referer) return 'direct'

  let hostname
  try {
    hostname = new URL(referer).hostname.toLowerCase()
  } catch {
    return 'direct'
  }

  const ownHost = (req.get?.('host') || req.headers.host || '').toLowerCase().split(':')[0]
  if (ownHost && hostname === ownHost) return 'direct'
  if (SEARCH_HOST_RE.test(hostname)) return 'search'
  if (SOCIAL_HOST_RE.test(hostname)) return 'social'
  return 'other'
}

const detectAdmin = (req) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return false
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
  if (!token) return false
  try {
    jwt.verify(token, process.env.JWT_SECRET)
    return true
  } catch {
    return false
  }
}

// Parse and validate shared query filters (period|from|to|category).
const parseFilters = (query) => {
  const { period, from, to, category } = query
  const range = getDateRange(period, from, to)
  if (range.error) return { error: range.error }
  if (category && !isValidCategory(category)) return { error: 'Invalid category' }
  return {
    from: range.from,
    to: range.to,
    category: category || 'All'
  }
}

// Distinct Blog _ids for a specific category, or null when "All".
const resolveBlogIds = async (category) => {
  if (!category || category === 'All') return null
  return Blog.find({ category }).distinct('_id')
}

const buildCommentMatch = ({ from, to }, blogIds) => {
  const match = {}
  if (from || to) {
    match.createdAt = {}
    if (from) match.createdAt.$gte = from
    if (to) match.createdAt.$lte = to
  }
  if (Array.isArray(blogIds)) match.blog = { $in: blogIds }
  return match
}

const fmtIsoDate = (d) => new Date(d).toISOString().slice(0, 10)

const csvEscape = (value) => {
  const s = String(value ?? '')
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

// 1) recordView — POST public. Wired by Agent 6 at POST /api/blog/:blogId/view.
export const recordView = asyncHandler(async (req, res) => {
  const { blogId } = req.params

  if (!mongoose.isValidObjectId(blogId)) {
    return sendError(res, 'Invalid blog id', 400)
  }

  const exists = await Blog.exists({ _id: blogId })
  if (!exists) return sendError(res, 'Blog not found', 404)

  const visitorKey = makeVisitorKey(req)
  const referrerSource = deriveReferrerSource(req)
  const isAdminView = detectAdmin(req)

  const since = new Date(Date.now() - DAY_MS)
  const recent = await BlogView.findOne({
    blog: blogId,
    visitorKey,
    viewedAt: { $gte: since }
  }).lean()

  if (recent) {
    return sendSuccess(res, { recorded: false }, 'View already recorded within last 24h')
  }

  await BlogView.create({
    blog: blogId,
    viewedAt: new Date(),
    visitorKey,
    referrerSource,
    isAdminView
  })

  return sendSuccess(res, { recorded: true }, 'View recorded')
})

// 2) getKpis — 6 KPIs, each with {value, trend}.
export const getKpis = asyncHandler(async (req, res) => {
  const filters = parseFilters(req.query)
  if (filters.error) return sendError(res, filters.error, 400)
  const { from, to, category } = filters

  const blogIds = await resolveBlogIds(category)
  const prev = getPreviousPeriod(from, to)

  const blogFilter = buildBlogFilter({ from, to, category })
  const prevBlogFilter = buildBlogFilter({ from: prev.from, to: prev.to, category })

  const viewFilter = buildViewFilter({ from, to }, blogIds)
  const prevViewFilter = buildViewFilter({ from: prev.from, to: prev.to }, blogIds)

  const commentMatch = buildCommentMatch({ from, to }, blogIds)
  const prevCommentMatch = buildCommentMatch({ from: prev.from, to: prev.to }, blogIds)

  const [
    totalViews,
    prevTotalViews,
    publishedCount,
    draftCount,
    prevPublishedCount,
    prevDraftCount,
    approvedCount,
    pendingCount,
    totalCommentsCount,
    prevApprovedCount,
    prevTotalComments,
    mostActiveCatAgg
  ] = await Promise.all([
    BlogView.countDocuments(viewFilter),
    BlogView.countDocuments(prevViewFilter),
    Blog.countDocuments({ ...blogFilter, isPublished: true }),
    Blog.countDocuments({ ...blogFilter, isPublished: false }),
    Blog.countDocuments({ ...prevBlogFilter, isPublished: true }),
    Blog.countDocuments({ ...prevBlogFilter, isPublished: false }),
    Comment.countDocuments({ ...commentMatch, isApproved: true }),
    Comment.countDocuments({ ...commentMatch, isApproved: false }),
    Comment.countDocuments(commentMatch),
    Comment.countDocuments({ ...prevCommentMatch, isApproved: true }),
    Comment.countDocuments(prevCommentMatch),
    BlogView.aggregate([
      { $match: buildViewFilter({ from, to }) },
      {
        $lookup: {
          from: 'blogs',
          localField: 'blog',
          foreignField: '_id',
          as: 'blogDoc'
        }
      },
      { $unwind: '$blogDoc' },
      { $group: { _id: '$blogDoc.category', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 1 }
    ])
  ])

  const totalBlogs = publishedCount + draftCount
  const prevTotalBlogs = prevPublishedCount + prevDraftCount

  const engagementCurrent = publishedCount === 0 ? 0 : totalCommentsCount / publishedCount
  const engagementPrev = prevPublishedCount === 0 ? 0 : prevTotalComments / prevPublishedCount

  const approvalCurrent = totalCommentsCount === 0 ? 0 : (approvedCount / totalCommentsCount) * 100
  const approvalPrev = prevTotalComments === 0 ? 0 : (prevApprovedCount / prevTotalComments) * 100

  const mostActiveCategory = mostActiveCatAgg[0]?._id || '—'

  return sendSuccess(res, {
    kpis: {
      totalViews: {
        value: totalViews,
        trend: calculateTrend(totalViews, prevTotalViews)
      },
      totalBlogs: {
        value: totalBlogs,
        published: publishedCount,
        drafts: draftCount,
        trend: calculateTrend(totalBlogs, prevTotalBlogs)
      },
      totalComments: {
        value: totalCommentsCount,
        approved: approvedCount,
        pending: pendingCount,
        trend: calculateTrend(totalCommentsCount, prevTotalComments)
      },
      avgEngagement: {
        value: Math.round(engagementCurrent * 100) / 100,
        trend: calculateTrend(engagementCurrent, engagementPrev)
      },
      approvalRate: {
        value: Math.round(approvalCurrent * 10) / 10,
        trend: calculateTrend(approvalCurrent, approvalPrev)
      },
      mostActiveCategory: {
        value: mostActiveCategory,
        trend: { direction: 'neutral', percentChange: 0 }
      }
    }
  })
})

// 3) getViewsOverTime — adaptive day/week/month bucket. Admin views excluded via buildViewFilter.
export const getViewsOverTime = asyncHandler(async (req, res) => {
  const filters = parseFilters(req.query)
  if (filters.error) return sendError(res, filters.error, 400)
  const { from, to, category } = filters

  const blogIds = await resolveBlogIds(category)
  const viewFilter = buildViewFilter({ from, to }, blogIds)
  const bucket = getBucketSize(from, to)

  const series = await BlogView.aggregate([
    { $match: viewFilter },
    {
      $group: {
        _id: { $dateTrunc: { date: '$viewedAt', unit: BUCKET_UNIT[bucket] } },
        views: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: '$_id', views: 1 } }
  ])

  return sendSuccess(res, { bucket, series })
})

// 4) getPublications — stacked bars: month x category.
export const getPublications = asyncHandler(async (req, res) => {
  const filters = parseFilters(req.query)
  if (filters.error) return sendError(res, filters.error, 400)
  const { from, to, category } = filters

  const rows = await Blog.aggregate([
    { $match: buildBlogFilter({ from, to, category }) },
    {
      $group: {
        _id: {
          month: { $dateTrunc: { date: '$createdAt', unit: 'month' } },
          category: '$category'
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.month': 1 } }
  ])

  const map = new Map()
  for (const row of rows) {
    const key = row._id.month.toISOString()
    if (!map.has(key)) {
      map.set(key, { date: row._id.month, Technology: 0, Lifestyle: 0, Startup: 0, Finance: 0 })
    }
    if (VALID_CATEGORIES.includes(row._id.category)) {
      map.get(key)[row._id.category] = row.count
    }
  }
  const series = Array.from(map.values()).sort((a, b) => a.date - b.date)

  return sendSuccess(res, { series })
})

// 5) getCategoryDistribution — blog count per category (donut source).
export const getCategoryDistribution = asyncHandler(async (req, res) => {
  const filters = parseFilters(req.query)
  if (filters.error) return sendError(res, filters.error, 400)
  const { from, to, category } = filters

  const distribution = await Blog.aggregate([
    { $match: buildBlogFilter({ from, to, category }) },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, category: '$_id', count: 1 } }
  ])

  return sendSuccess(res, { distribution })
})

// 6) getCommentActivity — approved vs pending per month.
export const getCommentActivity = asyncHandler(async (req, res) => {
  const filters = parseFilters(req.query)
  if (filters.error) return sendError(res, filters.error, 400)
  const { from, to, category } = filters

  const blogIds = await resolveBlogIds(category)
  const match = buildCommentMatch({ from, to }, blogIds)

  const series = await Comment.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateTrunc: { date: '$createdAt', unit: 'month' } },
        approved: { $sum: { $cond: ['$isApproved', 1, 0] } },
        pending: { $sum: { $cond: ['$isApproved', 0, 1] } }
      }
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: '$_id', approved: 1, pending: 1 } }
  ])

  return sendSuccess(res, { series })
})

// 7) getViewsByCategory — horizontal bar, sorted desc.
export const getViewsByCategory = asyncHandler(async (req, res) => {
  const filters = parseFilters(req.query)
  if (filters.error) return sendError(res, filters.error, 400)
  const { from, to, category } = filters

  const blogIds = await resolveBlogIds(category)
  const viewFilter = buildViewFilter({ from, to }, blogIds)

  const series = await BlogView.aggregate([
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
    { $group: { _id: '$blogDoc.category', views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $project: { _id: 0, category: '$_id', views: 1 } }
  ])

  return sendSuccess(res, { series })
})

// 8) getTopViewed — top 5 blogs by view count.
export const getTopViewed = asyncHandler(async (req, res) => {
  const filters = parseFilters(req.query)
  if (filters.error) return sendError(res, filters.error, 400)
  const { from, to, category } = filters

  const blogIds = await resolveBlogIds(category)
  const viewFilter = buildViewFilter({ from, to }, blogIds)

  const rows = await BlogView.aggregate([
    { $match: viewFilter },
    { $group: { _id: '$blog', views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'blogs',
        localField: '_id',
        foreignField: '_id',
        as: 'blogDoc'
      }
    },
    { $unwind: '$blogDoc' },
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
        _id: 0,
        id: '$_id',
        title: '$blogDoc.title',
        category: '$blogDoc.category',
        views: 1,
        commentsCount: { $size: '$comments' },
        publishedAt: '$blogDoc.createdAt'
      }
    }
  ])

  return sendSuccess(res, { rows })
})

// 9) getTopCommented — top 5 blogs by comment count, with approved/total and views.
export const getTopCommented = asyncHandler(async (req, res) => {
  const filters = parseFilters(req.query)
  if (filters.error) return sendError(res, filters.error, 400)
  const { from, to, category } = filters

  const blogIds = await resolveBlogIds(category)
  const match = buildCommentMatch({ from, to }, blogIds)

  const rows = await Comment.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$blog',
        approvedCount: { $sum: { $cond: ['$isApproved', 1, 0] } },
        totalCount: { $sum: 1 }
      }
    },
    { $sort: { totalCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'blogs',
        localField: '_id',
        foreignField: '_id',
        as: 'blogDoc'
      }
    },
    { $unwind: '$blogDoc' },
    {
      $lookup: {
        from: 'blogviews',
        let: { blogId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$blog', '$$blogId'] }, isAdminView: { $ne: true } } },
          { $count: 'count' }
        ],
        as: 'viewsAgg'
      }
    },
    {
      $project: {
        _id: 0,
        id: '$_id',
        title: '$blogDoc.title',
        category: '$blogDoc.category',
        approvedCount: 1,
        totalCount: 1,
        views: { $ifNull: [{ $arrayElemAt: ['$viewsAgg.count', 0] }, 0] }
      }
    }
  ])

  return sendSuccess(res, { rows })
})

// 10) getLastComments — last 5 comments within window/category.
export const getLastComments = asyncHandler(async (req, res) => {
  const filters = parseFilters(req.query)
  if (filters.error) return sendError(res, filters.error, 400)
  const { from, to, category } = filters

  const blogIds = await resolveBlogIds(category)
  const match = buildCommentMatch({ from, to }, blogIds)

  const comments = await Comment.find(match)
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('blog', 'title')
    .lean()

  const rows = comments.map((c) => ({
    blogId: c.blog?._id || c.blog,
    blogTitle: c.blog?.title || '',
    author: c.name,
    text: c.content,
    createdAt: c.createdAt,
    isApproved: c.isApproved
  }))

  return sendSuccess(res, { rows })
})

// 11) exportCsv — attachment download with six columns.
export const exportCsv = asyncHandler(async (req, res) => {
  const filters = parseFilters(req.query)
  if (filters.error) return sendError(res, filters.error, 400)
  const { from, to, category } = filters

  const blogFilter = buildBlogFilter({ from, to, category })
  const blogs = await Blog.find(blogFilter).sort({ createdAt: -1 }).lean()
  const blogIdList = blogs.map((b) => b._id)

  const [viewAgg, commentAgg] = await Promise.all([
    BlogView.aggregate([
      { $match: { blog: { $in: blogIdList }, isAdminView: { $ne: true } } },
      { $group: { _id: '$blog', views: { $sum: 1 } } }
    ]),
    Comment.aggregate([
      { $match: { blog: { $in: blogIdList } } },
      { $group: { _id: '$blog', comments: { $sum: 1 } } }
    ])
  ])

  const viewsByBlog = new Map(viewAgg.map((v) => [String(v._id), v.views]))
  const commentsByBlog = new Map(commentAgg.map((c) => [String(c._id), c.comments]))

  const header = ['title', 'category', 'date', 'views', 'comments', 'status']
  const lines = [header.join(',')]

  for (const b of blogs) {
    lines.push([
      csvEscape(b.title),
      csvEscape(b.category),
      csvEscape(fmtIsoDate(b.createdAt)),
      viewsByBlog.get(String(b._id)) || 0,
      commentsByBlog.get(String(b._id)) || 0,
      csvEscape(b.isPublished ? 'Published' : 'Draft')
    ].join(','))
  }

  const fromStr = from ? fmtIsoDate(from) : 'all'
  const toStr = to ? fmtIsoDate(to) : fmtIsoDate(new Date())
  const filename = `analytics-${fromStr}-to-${toStr}.csv`

  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  return res.status(200).send(lines.join('\n'))
})

// 12) getDrillDown — posts for a clicked date bucket.
export const getDrillDown = asyncHandler(async (req, res) => {
  const { date, bucket = 'day', category } = req.query

  if (!date) return sendError(res, 'date is required', 400)
  const when = new Date(date)
  if (Number.isNaN(when.getTime())) return sendError(res, 'Invalid date', 400)

  const unit = BUCKET_UNIT[bucket]
  if (!unit) return sendError(res, 'Invalid bucket', 400)

  if (category && !isValidCategory(category)) {
    return sendError(res, 'Invalid category', 400)
  }

  const start = new Date(when)
  const end = new Date(when)
  if (unit === 'day') {
    start.setUTCHours(0, 0, 0, 0)
    end.setTime(start.getTime() + DAY_MS)
  } else if (unit === 'week') {
    start.setUTCHours(0, 0, 0, 0)
    end.setTime(start.getTime() + 7 * DAY_MS)
  } else {
    start.setUTCDate(1)
    start.setUTCHours(0, 0, 0, 0)
    end.setTime(start.getTime())
    end.setUTCMonth(end.getUTCMonth() + 1)
  }

  const blogIds = await resolveBlogIds(category)
  const viewMatch = {
    viewedAt: { $gte: start, $lt: end },
    isAdminView: { $ne: true }
  }
  if (blogIds) viewMatch.blog = { $in: blogIds }

  const rows = await BlogView.aggregate([
    { $match: viewMatch },
    { $group: { _id: '$blog', views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $limit: 50 },
    {
      $lookup: {
        from: 'blogs',
        localField: '_id',
        foreignField: '_id',
        as: 'blogDoc'
      }
    },
    { $unwind: '$blogDoc' },
    {
      $project: {
        _id: 0,
        id: '$_id',
        title: '$blogDoc.title',
        category: '$blogDoc.category',
        views: 1
      }
    }
  ])

  return sendSuccess(res, { date: start, bucket: unit, rows })
})
