import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import BlogView from '../models/BlogView.js'
import { sendData, sendError } from '../helpers/response.js'
import { asyncHandler } from '../helpers/asyncHandler.js'
import {
  getPreviousPeriod,
  calculateTrend,
  getBucketSize,
  buildBlogFilter,
  buildViewFilter,
  parseChartDateToRange,
  CATEGORIES
} from '../helpers/analyticsAggregations.js'

function getFilter(req) {
  return req.analyticsFilter || { from: new Date(0), to: new Date(), category: 'All' }
}

export const getKpis = asyncHandler(async (req, res) => {
  const filter = getFilter(req)
  const { from, to, category } = filter
  const { from: prevFrom, to: prevTo } = getPreviousPeriod(from, to)

  const blogFilter = buildBlogFilter(filter)
  const prevBlogFilter = buildBlogFilter({ from: prevFrom, to: prevTo, category })

  const [blogs, prevBlogs] = await Promise.all([
    Blog.find(blogFilter).select('_id isPublished category').lean(),
    Blog.find(prevBlogFilter).select('_id isPublished category').lean()
  ])

  const blogIdList = blogs.map(b => b._id)
  const prevBlogIdList = prevBlogs.map(b => b._id)

  const [viewCount, prevViewCount, comments, prevComments] = await Promise.all([
    blogIdList.length ? BlogView.countDocuments(buildViewFilter(filter, blogIdList)) : Promise.resolve(0),
    prevBlogIdList.length ? BlogView.countDocuments(buildViewFilter({ from: prevFrom, to: prevTo, category }, prevBlogIdList)) : Promise.resolve(0),
    blogIdList.length ? Comment.find({ blog: { $in: blogIdList } }).select('isApproved').lean() : Promise.resolve([]),
    prevBlogIdList.length ? Comment.find({ blog: { $in: prevBlogIdList } }).select('isApproved').lean() : Promise.resolve([])
  ])

  const totalViews = typeof viewCount === 'number' ? viewCount : 0
  const prevTotalViews = typeof prevViewCount === 'number' ? prevViewCount : 0
  const publishedCount = blogs.filter(b => b.isPublished).length
  const prevPublishedCount = prevBlogs.filter(b => b.isPublished).length
  const draftsCount = blogs.filter(b => !b.isPublished).length
  const prevDraftsCount = prevBlogs.filter(b => !b.isPublished).length
  const approvedCount = comments.filter(c => c.isApproved).length
  const prevApprovedCount = prevComments.filter(c => c.isApproved).length
  const pendingCount = comments.filter(c => !c.isApproved).length
  const prevPendingCount = prevComments.filter(c => !c.isApproved).length
  const totalComments = comments.length
  const prevTotalComments = prevComments.length

  const avgEngagement = publishedCount > 0 ? totalComments / publishedCount : 0
  const prevAvgEngagement = prevPublishedCount > 0 ? prevTotalComments / prevPublishedCount : 0
  const approvalRate = totalComments > 0 ? (approvedCount / totalComments) * 100 : 0
  const prevApprovalRate = prevTotalComments > 0 ? (prevApprovedCount / prevTotalComments) * 100 : 0

  // mostActiveCategory: category with highest views (not blog count)
  let mostActiveCategory = { category: 'N/A', count: 0 }
  if (blogIdList.length > 0) {
    const viewsByBlog = await BlogView.aggregate([
      { $match: buildViewFilter(filter, blogIdList) },
      { $group: { _id: '$blog', views: { $sum: 1 } } }
    ])
    const viewsMap = Object.fromEntries(viewsByBlog.map(v => [v._id.toString(), v.views]))
    const categoryViews = {}
    for (const c of CATEGORIES) {
      if (c === 'All') continue
      categoryViews[c] = 0
    }
    for (const b of blogs) {
      categoryViews[b.category] = (categoryViews[b.category] || 0) + (viewsMap[b._id.toString()] || 0)
    }
    mostActiveCategory = Object.entries(categoryViews).reduce(
      (a, [k, v]) => (v > a.count ? { category: k, count: v } : a),
      { category: 'N/A', count: 0 }
    )
  }

  sendData(res, {
    kpis: {
      totalViews: {
        value: totalViews,
        trend: calculateTrend(totalViews, prevTotalViews),
        previousValue: prevTotalViews
      },
      totalBlogs: {
        value: blogs.length,
        trend: calculateTrend(blogs.length, prevBlogs.length),
        previousValue: prevBlogs.length,
        published: publishedCount,
        drafts: draftsCount
      },
      totalComments: {
        value: totalComments,
        trend: calculateTrend(totalComments, prevTotalComments),
        previousValue: prevTotalComments,
        approved: approvedCount,
        pending: pendingCount
      },
      avgEngagement: {
        value: Math.round(avgEngagement * 100) / 100,
        trend: calculateTrend(avgEngagement, prevAvgEngagement),
        previousValue: Math.round(prevAvgEngagement * 100) / 100
      },
      approvalRate: {
        value: Math.round(approvalRate * 100) / 100,
        trend: calculateTrend(approvalRate, prevApprovalRate),
        previousValue: Math.round(prevApprovalRate * 100) / 100
      },
      mostActiveCategory: {
        value: mostActiveCategory.category,
        count: mostActiveCategory.count
      }
    }
  })
})

export const getViewsOverTime = asyncHandler(async (req, res) => {
  const filter = getFilter(req)
  const { from, to } = filter
  const blogFilter = buildBlogFilter(filter)
  const blogIds = (await Blog.find(blogFilter).select('_id').lean()).map(b => b._id)
  if (blogIds.length === 0) {
    return sendData(res, { data: [] })
  }

  const bucket = getBucketSize(from, to)
  const dateExpr = bucket === 'day'
    ? { $dateToString: { format: '%Y-%m-%d', date: '$viewedAt' } }
    : bucket === 'week'
      ? { $dateToString: { format: '%Y-W%V', date: '$viewedAt' } }
      : { $dateToString: { format: '%Y-%m', date: '$viewedAt' } }

  const viewFilter = buildViewFilter(filter, blogIds)
  const pipeline = [
    { $match: viewFilter },
    { $group: { _id: dateExpr, views: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', views: 1, _id: 0 } }
  ]
  const data = await BlogView.aggregate(pipeline)
  sendData(res, { data })
})

export const getPublicationsOverTime = asyncHandler(async (req, res) => {
  const filter = getFilter(req)
  const blogFilter = buildBlogFilter(filter)
  const blogs = await Blog.find(blogFilter).select('category createdAt').lean()
  const byMonth = {}
  for (const b of blogs) {
    const month = b.createdAt.toISOString().slice(0, 7)
    if (!byMonth[month]) byMonth[month] = { total: 0, byCategory: {} }
    byMonth[month].total += 1
    byMonth[month].byCategory[b.category] = (byMonth[month].byCategory[b.category] || 0) + 1
  }
  const data = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({ month, total: v.total, byCategory: v.byCategory }))
  sendData(res, { data })
})

export const getCategoryDistribution = asyncHandler(async (req, res) => {
  const filter = getFilter(req)
  const blogFilter = buildBlogFilter(filter)
  const blogs = await Blog.find(blogFilter).select('category').lean()
  const counts = {}
  for (const c of CATEGORIES) {
    if (c === 'All') continue
    counts[c] = 0
  }
  for (const b of blogs) {
    counts[b.category] = (counts[b.category] || 0) + 1
  }
  const total = blogs.length
  const data = Object.entries(counts).map(([category, count]) => ({
    category,
    count,
    percent: total > 0 ? Math.round((count / total) * 10000) / 100 : 0
  }))
  sendData(res, { data })
})

export const getCommentActivity = asyncHandler(async (req, res) => {
  const filter = getFilter(req)
  const blogFilter = buildBlogFilter(filter)
  const blogIds = (await Blog.find(blogFilter).select('_id').lean()).map(b => b._id)
  if (blogIds.length === 0) {
    return sendData(res, { data: [] })
  }
  const comments = await Comment.find({ blog: { $in: blogIds } }).select('isApproved createdAt').lean()
  const byMonth = {}
  for (const c of comments) {
    const month = c.createdAt.toISOString().slice(0, 7)
    if (!byMonth[month]) byMonth[month] = { approved: 0, pending: 0, total: 0 }
    byMonth[month].total += 1
    if (c.isApproved) byMonth[month].approved += 1
    else byMonth[month].pending += 1
  }
  const data = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({ month, ...v }))
  sendData(res, { data })
})

export const getViewsByCategory = asyncHandler(async (req, res) => {
  const filter = getFilter(req)
  const { from, to, category } = filter
  const blogFilter = buildBlogFilter(filter)
  const blogs = await Blog.find(blogFilter).select('_id category').lean()
  const blogIds = blogs.map(b => b._id)
  if (blogIds.length === 0) {
    const data = CATEGORIES.filter(c => c !== 'All').map(c => ({ category: c, views: 0 }))
    return sendData(res, { data })
  }
  const viewFilter = buildViewFilter(filter, blogIds)
  const viewsByBlog = await BlogView.aggregate([
    { $match: viewFilter },
    { $group: { _id: '$blog', views: { $sum: 1 } } }
  ])
  const viewsMap = Object.fromEntries(viewsByBlog.map(v => [v._id.toString(), v.views]))
  const byCategory = {}
  for (const c of CATEGORIES) {
    if (c === 'All') continue
    byCategory[c] = 0
  }
  for (const b of blogs) {
    byCategory[b.category] = (byCategory[b.category] || 0) + (viewsMap[b._id.toString()] || 0)
  }
  const data = Object.entries(byCategory).map(([category, views]) => ({ category, views }))
  sendData(res, { data })
})

export const getTopViewedPosts = asyncHandler(async (req, res) => {
  const filter = getFilter(req)
  const blogFilter = buildBlogFilter(filter)
  const blogIds = (await Blog.find(blogFilter).select('_id').lean()).map(b => b._id)
  if (blogIds.length === 0) {
    return sendData(res, { data: [] })
  }
  const viewFilter = buildViewFilter(filter, blogIds)
  const viewCounts = await BlogView.aggregate([
    { $match: viewFilter },
    { $group: { _id: '$blog', views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $limit: 5 }
  ])
  const ids = viewCounts.map(v => v._id)
  const blogs = await Blog.find({ _id: { $in: ids } }).select('title category createdAt').lean()
  const blogMap = Object.fromEntries(blogs.map(b => [b._id.toString(), b]))
  const viewsMap = Object.fromEntries(viewCounts.map(v => [v._id.toString(), v.views]))
  const commentCounts = await Comment.aggregate([
    { $match: { blog: { $in: ids }, isApproved: true } },
    { $group: { _id: '$blog', count: { $sum: 1 } } }
  ])
  const commentMap = Object.fromEntries(commentCounts.map(c => [c._id.toString(), c.count]))
  const data = viewCounts.map(v => {
    const b = blogMap[v._id.toString()]
    if (!b) return null
    return {
      id: b._id,
      title: b.title,
      category: b.category,
      views: v.views,
      comments: commentMap[b._id.toString()] || 0,
      publishDate: b.createdAt
    }
  }).filter(Boolean)
  sendData(res, { data })
})

export const getTopCommentedPosts = asyncHandler(async (req, res) => {
  const filter = getFilter(req)
  const blogFilter = buildBlogFilter(filter)
  const blogIds = (await Blog.find(blogFilter).select('_id').lean()).map(b => b._id)
  if (blogIds.length === 0) {
    return sendData(res, { data: [] })
  }
  const commentCounts = await Comment.aggregate([
    { $match: { blog: { $in: blogIds } } },
    { $group: { _id: '$blog', total: { $sum: 1 }, approved: { $sum: { $cond: ['$isApproved', 1, 0] } } } },
    { $sort: { total: -1 } },
    { $limit: 5 }
  ])
  const ids = commentCounts.map(c => c._id)
  const blogs = await Blog.find({ _id: { $in: ids } }).select('title category').lean()
  const blogMap = Object.fromEntries(blogs.map(b => [b._id.toString(), b]))
  const viewFilter = buildViewFilter(filter, blogIds)
  const viewCounts = await BlogView.aggregate([
    { $match: viewFilter },
    { $group: { _id: '$blog', views: { $sum: 1 } } }
  ])
  const viewsMap = Object.fromEntries(viewCounts.map(v => [v._id.toString(), v.views]))
  const data = commentCounts.map(c => {
    const b = blogMap[c._id.toString()]
    return {
      id: b?._id ?? c._id,
      title: b?.title ?? 'Unknown',
      category: b?.category ?? '',
      comments: { approved: c.approved, total: c.total },
      views: viewsMap[c._id.toString()] ?? 0
    }
  })
  sendData(res, { data })
})

export const getLastComments = asyncHandler(async (req, res) => {
  const filter = getFilter(req)
  const blogFilter = buildBlogFilter(filter)
  const blogIds = (await Blog.find(blogFilter).select('_id').lean()).map(b => b._id)
  if (blogIds.length === 0) {
    return sendData(res, { data: [] })
  }
  const comments = await Comment.find({ blog: { $in: blogIds } })
    .populate('blog', 'title')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean()
  const data = comments.map(c => ({
    id: c._id,
    authorName: c.name,
    contentExcerpt: (c.content || '').slice(0, 100) + ((c.content?.length || 0) > 100 ? '...' : ''),
    blogTitle: c.blog?.title || 'Unknown',
    blogId: c.blog?._id || c.blog,
    createdAt: c.createdAt,
    status: c.isApproved ? 'approved' : 'pending'
  }))
  sendData(res, { data })
})

export const getDrillDownPosts = asyncHandler(async (req, res) => {
  const filter = getFilter(req)
  const dateStr = req.query?.date
  const range = parseChartDateToRange(dateStr)
  const { from, to } = range
  const blogFilter = buildBlogFilter(filter)
  const blogIds = (await Blog.find(blogFilter).select('_id').lean()).map(b => b._id)
  if (blogIds.length === 0) {
    return sendData(res, { data: [] })
  }
  const viewFilter = {
    isAdminView: false,
    blog: { $in: blogIds },
    viewedAt: { $gte: from, $lte: to }
  }
  const viewCounts = await BlogView.aggregate([
    { $match: viewFilter },
    { $group: { _id: '$blog', views: { $sum: 1 } } },
    { $sort: { views: -1 } }
  ])
  const ids = viewCounts.map(v => v._id)
  const blogs = await Blog.find({ _id: { $in: ids } }).select('title category').lean()
  const blogMap = Object.fromEntries(blogs.map(b => [b._id.toString(), b]))
  const viewsMap = Object.fromEntries(viewCounts.map(v => [v._id.toString(), v.views]))
  const data = viewCounts.map(v => {
    const b = blogMap[v._id.toString()]
    if (!b) return null
    return {
      id: b._id,
      title: b.title,
      category: b.category,
      views: v.views
    }
  }).filter(Boolean)
  sendData(res, { data })
})

export const exportCsv = asyncHandler(async (req, res) => {
  const filter = getFilter(req)
  const blogFilter = buildBlogFilter(filter)
  const blogs = await Blog.find(blogFilter).select('title category createdAt isPublished').lean()
  const blogIds = blogs.map(b => b._id)
  const viewFilter = blogIds.length ? buildViewFilter(filter, blogIds) : null
  const viewCounts = viewFilter
    ? await BlogView.aggregate([
        { $match: viewFilter },
        { $group: { _id: '$blog', views: { $sum: 1 } } }
      ])
    : []
  const viewsMap = Object.fromEntries(viewCounts.map(v => [v._id.toString(), v.views]))
  const commentCounts = blogIds.length
    ? await Comment.aggregate([
        { $match: { blog: { $in: blogIds } } },
        { $group: { _id: '$blog', count: { $sum: 1 } } }
      ])
    : []
  const commentMap = Object.fromEntries(commentCounts.map(c => [c._id.toString(), c.count]))

  const fromStr = filter.from.toISOString().slice(0, 10)
  const toStr = filter.to.toISOString().slice(0, 10)
  const filename = `analytics-${fromStr}-${toStr}.csv`

  const BOM = '\uFEFF'
  const header = 'Post Title,Category,Publish Date,Views,Comment Count,Status\n'
  // Sort blogs by views descending for CSV export
  blogs.sort((a, b) => (viewsMap[b._id.toString()] || 0) - (viewsMap[a._id.toString()] || 0))

  const rows = blogs.map(b => {
    const title = (b.title || '').replace(/"/g, '""')
    const category = (b.category || '').replace(/"/g, '""')
    const publishDate = b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-US') : ''
    const views = (viewsMap[b._id.toString()] || 0).toLocaleString()
    const commentCount = (commentMap[b._id.toString()] || 0).toLocaleString()
    const status = b.isPublished ? 'Published' : 'Draft'
    return `"${title}","${category}","${publishDate}","${views}","${commentCount}","${status}"`
  })
  const csv = BOM + header + rows.join('\n')

  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(csv)
})
