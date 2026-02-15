import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import View from '../models/View.js'
import { asyncHandler } from '../helpers/asyncHandler.js'
import { sendData } from '../helpers/response.js'
import {
  buildDateFilter,
  buildCategoryFilter,
  percentChange,
  validateDateParams
} from '../helpers/analyticsFilters.js'

export const getSummary = asyncHandler(async (req, res) => {
  if (!validateDateParams(req, res)) return

  const { startDate, endDate, category } = req.query
  const dateFilter = buildDateFilter(startDate, endDate)
  const categoryFilter = buildCategoryFilter(category)
  const blogMatch = { ...dateFilter, ...categoryFilter }

  const [
    totalBlogs, publishedBlogs, totalViews,
    commentStats, mostActiveCategoryResult, prev
  ] = await Promise.all([
    Blog.countDocuments(blogMatch),
    Blog.countDocuments({ ...blogMatch, isPublished: true }),
    categoryFilter.category
      ? View.aggregate([
          { $match: { isAdmin: false, ...dateFilter } },
          { $lookup: { from: 'blogs', localField: 'blog', foreignField: '_id', as: 'blogDoc' } },
          { $unwind: '$blogDoc' },
          { $match: { 'blogDoc.category': categoryFilter.category } },
          { $count: 'count' }
        ]).then((r) => r[0]?.count ?? 0)
      : View.countDocuments({ isAdmin: false, ...dateFilter }),
    // Approved/pending comment counts
    categoryFilter.category
      ? Comment.aggregate([
          { $match: dateFilter },
          { $lookup: { from: 'blogs', localField: 'blog', foreignField: '_id', as: 'blogDoc' } },
          { $unwind: '$blogDoc' },
          { $match: { 'blogDoc.category': categoryFilter.category } },
          { $group: {
              _id: null,
              total: { $sum: 1 },
              approved: { $sum: { $cond: ['$isApproved', 1, 0] } }
            }
          }
        ]).then((r) => r[0] ?? { total: 0, approved: 0 })
      : Comment.aggregate([
          { $match: dateFilter },
          { $group: {
              _id: null,
              total: { $sum: 1 },
              approved: { $sum: { $cond: ['$isApproved', 1, 0] } }
            }
          }
        ]).then((r) => r[0] ?? { total: 0, approved: 0 }),
    // Most active category
    Blog.aggregate([
      { $match: blogMatch },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
      { $project: { category: '$_id', count: 1, _id: 0 } }
    ]).then((r) => r[0] ?? null),
    // Previous period comparison
    startDate && endDate
      ? (async () => {
          const start = new Date(startDate)
          const end = new Date(endDate)
          const durationMs = end - start
          const prevEnd = new Date(start.getTime() - 1)
          const prevStart = new Date(prevEnd.getTime() - durationMs)
          const prevDateFilter = buildDateFilter(prevStart.toISOString(), prevEnd.toISOString())
          const prevCatFilter = buildCategoryFilter(category)
          const prevBlogMatch = { ...prevDateFilter, ...prevCatFilter }
          const [pB, pV, pCommentStats] = await Promise.all([
            Blog.countDocuments(prevBlogMatch),
            prevCatFilter.category
              ? View.aggregate([
                  { $match: { isAdmin: false, ...prevDateFilter } },
                  { $lookup: { from: 'blogs', localField: 'blog', foreignField: '_id', as: 'blogDoc' } },
                  { $unwind: '$blogDoc' },
                  { $match: { 'blogDoc.category': prevCatFilter.category } },
                  { $count: 'count' }
                ]).then((r) => r[0]?.count ?? 0)
              : View.countDocuments({ isAdmin: false, ...prevDateFilter }),
            prevCatFilter.category
              ? Comment.aggregate([
                  { $match: prevDateFilter },
                  { $lookup: { from: 'blogs', localField: 'blog', foreignField: '_id', as: 'blogDoc' } },
                  { $unwind: '$blogDoc' },
                  { $match: { 'blogDoc.category': prevCatFilter.category } },
                  { $group: {
                      _id: null,
                      total: { $sum: 1 },
                      approved: { $sum: { $cond: ['$isApproved', 1, 0] } }
                    }
                  }
                ]).then((r) => r[0] ?? { total: 0, approved: 0 })
              : Comment.aggregate([
                  { $match: prevDateFilter },
                  { $group: {
                      _id: null,
                      total: { $sum: 1 },
                      approved: { $sum: { $cond: ['$isApproved', 1, 0] } }
                    }
                  }
                ]).then((r) => r[0] ?? { total: 0, approved: 0 })
          ])
          const pApprovalRate = pCommentStats.total > 0
            ? (pCommentStats.approved / pCommentStats.total) * 100
            : 0
          return { blogs: pB, views: pV, comments: pCommentStats.total, approvalRate: pApprovalRate }
        })()
      : null
  ])

  const totalComments = commentStats.total
  const approvedComments = commentStats.approved
  const pendingComments = totalComments - approvedComments
  const draftBlogs = totalBlogs - publishedBlogs
  const approvalRate = totalComments > 0
    ? Math.round((approvedComments / totalComments) * 10000) / 100
    : 0
  const avgEngagement = totalViews > 0
    ? Math.round((totalComments / totalViews) * 10000) / 100
    : 0

  const prevData = prev && typeof prev === 'object' ? prev : null
  const trends = startDate && endDate && prevData
    ? {
        blogs: percentChange(totalBlogs, prevData.blogs),
        views: percentChange(totalViews, prevData.views),
        comments: percentChange(totalComments, prevData.comments),
        approvalRate: percentChange(approvalRate, prevData.approvalRate)
      }
    : { blogs: null, views: null, comments: null, approvalRate: null }

  const summary = {
    totalViews,
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    totalComments,
    approvedComments,
    pendingComments,
    avgEngagement,
    approvalRate,
    mostActiveCategory: mostActiveCategoryResult,
    trends
  }

  sendData(res, { summary })
})
