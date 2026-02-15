import Blog from '../models/Blog.js'
import { asyncHandler } from '../helpers/asyncHandler.js'
import { sendCsv } from '../helpers/response.js'
import { CSV_EXPORT_LIMIT } from '../constants/messages.js'
import {
  buildDateFilter,
  buildCategoryFilter,
  validateDateParams
} from '../helpers/analyticsFilters.js'
import { formatBlogCsvRow, CSV_HEADER } from '../helpers/csvExport.js'

export const exportCsv = asyncHandler(async (req, res) => {
  if (!validateDateParams(req, res)) return

  const { startDate, endDate, category } = req.query
  const dateFilter = buildDateFilter(startDate, endDate)
  const categoryFilter = buildCategoryFilter(category)
  const blogMatch = { ...dateFilter, ...categoryFilter }

  const blogs = await Blog.aggregate([
    { $match: blogMatch },
    {
      $lookup: {
        from: 'views',
        let: { blogId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$blog', '$$blogId'] },
              isAdmin: false,
              ...(dateFilter.createdAt && { createdAt: dateFilter.createdAt })
            }
          },
          { $count: 'count' }
        ],
        as: 'viewCount'
      }
    },
    {
      $lookup: {
        from: 'comments',
        let: { blogId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$blog', '$$blogId'] },
              ...(dateFilter.createdAt && { createdAt: dateFilter.createdAt })
            }
          },
          { $count: 'count' }
        ],
        as: 'commentCount'
      }
    },
    {
      $project: {
        title: 1,
        category: 1,
        createdAt: 1,
        isPublished: 1,
        views: { $ifNull: [{ $arrayElemAt: ['$viewCount.count', 0] }, 0] },
        comments: { $ifNull: [{ $arrayElemAt: ['$commentCount.count', 0] }, 0] }
      }
    },
    { $sort: { createdAt: -1 } },
    { $limit: CSV_EXPORT_LIMIT }
  ])

  const rows = blogs.map(formatBlogCsvRow)
  const content = CSV_HEADER + rows.join('\n')

  sendCsv(res, content, 'analytics-export.csv')
})
