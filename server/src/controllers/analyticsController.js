import { asyncHandler } from '../helpers/asyncHandler.js'
import { sendSuccess, sendError } from '../helpers/response.js'
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/messages.js'
import { getMeta, getOverview, getPostDetails, getExport } from '../services/analyticsService.js'

export const getAnalyticsMeta = asyncHandler(async (req, res) => {
  sendSuccess(res, { meta: await getMeta() })
})

export const getAnalyticsOverview = asyncHandler(async (req, res) => {
  sendSuccess(res, { overview: await getOverview(req.analyticsQuery) })
})

export const getAnalyticsPost = asyncHandler(async (req, res) => {
  const post = await getPostDetails(req.params.id, req.analyticsQuery)
  if (!post) return sendError(res, ERROR_MESSAGES.BLOG_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
  sendSuccess(res, { post })
})

export const exportAnalyticsCsv = asyncHandler(async (req, res) => {
  const { csv, filename } = await getExport(req.analyticsQuery)
  res.set({
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="${filename}"`
  })
  res.send(csv)
})
