import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import View from '../models/View.js'
import { asyncHandler } from '../helpers/asyncHandler.js'
import { sendData } from '../helpers/response.js'
import { BLOG_CATEGORIES } from '../constants/messages.js'
import {
  buildDateFilter,
  buildCategoryFilter,
  getGranularity,
  getDateFormat,
  buildBlogDocMatch,
  validateDateParams
} from '../helpers/analyticsFilters.js'

export const getViewsOverTime = asyncHandler(async (req, res) => {
  if (!validateDateParams(req, res)) return

  const { startDate, endDate, category } = req.query
  const dateFilter = buildDateFilter(startDate, endDate)
  const categoryFilter = buildCategoryFilter(category)
  const granularity = getGranularity(startDate, endDate)
  const dateFormat = getDateFormat(granularity)

  const pipeline = [{ $match: { isAdmin: false, ...dateFilter } }]

  if (categoryFilter.category) {
    pipeline.push(
      { $lookup: { from: 'blogs', localField: 'blog', foreignField: '_id', as: 'blogDoc' } },
      { $unwind: '$blogDoc' },
      { $match: { 'blogDoc.category': categoryFilter.category } }
    )
  }

  pipeline.push(
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
        views: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', views: 1, _id: 0 } }
  )

  const data = await View.aggregate(pipeline)
  sendData(res, { data })
})

export const getPublicationsOverTime = asyncHandler(async (req, res) => {
  if (!validateDateParams(req, res)) return

  const { startDate, endDate, category } = req.query
  const dateFilter = buildDateFilter(startDate, endDate)
  const categoryFilter = buildCategoryFilter(category)
  const matchStage = { ...dateFilter, ...categoryFilter }

  if (categoryFilter.category) {
    const data = await Blog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', total: 1, _id: 0 } }
    ])
    return sendData(res, { data })
  }

  // Build category breakdown dynamically from the shared constant
  const categoryConditions = {}
  for (const cat of BLOG_CATEGORIES) {
    categoryConditions[cat] = { $sum: { $cond: [{ $eq: ['$category', cat] }, 1, 0] } }
  }

  const categoryProjection = {}
  for (const cat of BLOG_CATEGORIES) {
    categoryProjection[cat] = 1
  }

  const data = await Blog.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        total: { $sum: 1 },
        ...categoryConditions
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: '$_id',
        total: 1,
        ...categoryProjection,
        _id: 0
      }
    }
  ])

  sendData(res, { data })
})

export const getCategoryDistribution = asyncHandler(async (req, res) => {
  if (!validateDateParams(req, res)) return

  const { startDate, endDate } = req.query
  const dateFilter = buildDateFilter(startDate, endDate)

  const data = await Blog.aggregate([
    { $match: { ...dateFilter } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { category: '$_id', count: 1, _id: 0 } }
  ])

  sendData(res, { data })
})

export const getCommentActivity = asyncHandler(async (req, res) => {
  if (!validateDateParams(req, res)) return

  const { startDate, endDate, category } = req.query
  const dateFilter = buildDateFilter(startDate, endDate)
  const categoryFilter = buildCategoryFilter(category)

  const pipeline = [{ $match: dateFilter }]

  if (categoryFilter.category) {
    pipeline.push(
      { $lookup: { from: 'blogs', localField: 'blog', foreignField: '_id', as: 'blogDoc' } },
      { $unwind: '$blogDoc' },
      { $match: { 'blogDoc.category': categoryFilter.category } }
    )
  }

  pipeline.push(
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          isApproved: '$isApproved'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.date',
        approved: { $sum: { $cond: ['$_id.isApproved', '$count', 0] } },
        pending: { $sum: { $cond: ['$_id.isApproved', 0, '$count'] } }
      }
    },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', approved: 1, pending: 1, _id: 0 } }
  )

  const data = await Comment.aggregate(pipeline)
  sendData(res, { data })
})

export const getViewsByCategory = asyncHandler(async (req, res) => {
  if (!validateDateParams(req, res)) return

  const { startDate, endDate } = req.query
  const dateFilter = buildDateFilter(startDate, endDate)

  const data = await View.aggregate([
    { $match: { isAdmin: false, ...dateFilter } },
    { $lookup: { from: 'blogs', localField: 'blog', foreignField: '_id', as: 'blogDoc' } },
    { $unwind: '$blogDoc' },
    { $group: { _id: '$blogDoc.category', views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $project: { category: '$_id', views: 1, _id: 0 } }
  ])

  sendData(res, { data })
})

export const getTopPosts = asyncHandler(async (req, res) => {
  if (!validateDateParams(req, res)) return

  const { startDate, endDate, category } = req.query
  const dateFilter = buildDateFilter(startDate, endDate)
  const categoryFilter = buildCategoryFilter(category)
  const blogDocMatch = buildBlogDocMatch(dateFilter, categoryFilter)

  const viewsPipeline = [
    { $match: { isAdmin: false, ...dateFilter } },
    { $lookup: { from: 'blogs', localField: 'blog', foreignField: '_id', as: 'blogDoc' } },
    { $unwind: '$blogDoc' }
  ]
  if (Object.keys(blogDocMatch).length) viewsPipeline.push({ $match: blogDocMatch })
  viewsPipeline.push(
    {
      $group: {
        _id: '$blog',
        views: { $sum: 1 },
        title: { $first: '$blogDoc.title' },
        category: { $first: '$blogDoc.category' },
        publishDate: { $first: '$blogDoc.createdAt' }
      }
    },
    { $sort: { views: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'comments',
        let: { blogId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$blog', '$$blogId'] }, ...(dateFilter.createdAt ? { createdAt: dateFilter.createdAt } : {}) } },
          { $count: 'count' }
        ],
        as: 'commentCount'
      }
    },
    {
      $project: {
        _id: 1, title: 1, category: 1, views: 1, publishDate: 1,
        comments: { $ifNull: [{ $arrayElemAt: ['$commentCount.count', 0] }, 0] }
      }
    }
  )

  const commentsPipeline = [
    { $match: dateFilter },
    { $lookup: { from: 'blogs', localField: 'blog', foreignField: '_id', as: 'blogDoc' } },
    { $unwind: '$blogDoc' }
  ]
  if (Object.keys(blogDocMatch).length) commentsPipeline.push({ $match: blogDocMatch })
  commentsPipeline.push(
    {
      $group: {
        _id: '$blog',
        totalComments: { $sum: 1 },
        approvedComments: { $sum: { $cond: ['$isApproved', 1, 0] } },
        title: { $first: '$blogDoc.title' },
        category: { $first: '$blogDoc.category' }
      }
    },
    { $sort: { totalComments: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'views',
        let: { blogId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$blog', '$$blogId'] }, isAdmin: false, ...(dateFilter.createdAt ? { createdAt: dateFilter.createdAt } : {}) } },
          { $count: 'count' }
        ],
        as: 'viewCount'
      }
    },
    {
      $project: {
        _id: 1, title: 1, category: 1,
        approvedComments: 1, totalComments: 1,
        views: { $ifNull: [{ $arrayElemAt: ['$viewCount.count', 0] }, 0] }
      }
    }
  )

  const [topByViews, topByComments] = await Promise.all([
    View.aggregate(viewsPipeline),
    Comment.aggregate(commentsPipeline)
  ])

  sendData(res, { topByViews, topByComments })
})

export const getRecentComments = asyncHandler(async (req, res) => {
  if (!validateDateParams(req, res)) return

  const { startDate, endDate, category } = req.query
  const dateFilter = buildDateFilter(startDate, endDate)
  const categoryFilter = buildCategoryFilter(category)

  const pipeline = [
    { $match: dateFilter },
    { $lookup: { from: 'blogs', localField: 'blog', foreignField: '_id', as: 'blogDoc' } },
    { $unwind: '$blogDoc' }
  ]

  if (categoryFilter.category) {
    pipeline.push({ $match: { 'blogDoc.category': categoryFilter.category } })
  }

  pipeline.push(
    { $sort: { createdAt: -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: 1,
        name: 1,
        content: 1,
        isApproved: 1,
        createdAt: 1,
        blog: { _id: '$blogDoc._id', title: '$blogDoc.title' }
      }
    }
  )

  const comments = await Comment.aggregate(pipeline)
  sendData(res, { comments })
})
