import mongoose from 'mongoose'
import View from '../models/View.js'
import Blog from '../models/Blog.js'
import { asyncHandler } from '../helpers/asyncHandler.js'
import { sendSuccess, sendError } from '../helpers/response.js'
import { SUCCESS_MESSAGES, ERROR_MESSAGES, HTTP_STATUS } from '../constants/messages.js'

const VALID_REFERRERS = ['direct', 'search', 'social', 'other']
const MAX_SESSION_ID_LENGTH = 128

export const trackView = asyncHandler(async (req, res) => {
  const { blogId, sessionId, referrer } = req.body ?? {}

  if (!blogId || !sessionId) {
    return sendError(res, ERROR_MESSAGES.VIEW_TRACK_REQUIRED, HTTP_STATUS.BAD_REQUEST)
  }

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return sendError(res, ERROR_MESSAGES.VIEW_INVALID_BLOG_ID, HTTP_STATUS.BAD_REQUEST)
  }

  if (typeof sessionId !== 'string' || sessionId.length > MAX_SESSION_ID_LENGTH) {
    return sendError(res, ERROR_MESSAGES.VIEW_SESSION_TOO_LONG, HTTP_STATUS.BAD_REQUEST)
  }

  const safeReferrer = VALID_REFERRERS.includes(referrer) ? referrer : 'direct'

  const blogExists = await Blog.exists({ _id: blogId })
  if (!blogExists) {
    return sendError(res, ERROR_MESSAGES.BLOG_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
  }

  // Dedup: check if a View with same blog + sessionId exists within last 24h
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const existingView = await View.findOne({
    blog: blogId,
    sessionId,
    createdAt: { $gte: twentyFourHoursAgo }
  })

  if (existingView) {
    return sendSuccess(res, {}, SUCCESS_MESSAGES.VIEW_ALREADY_RECORDED)
  }

  await View.create({
    blog: blogId,
    sessionId,
    referrer: safeReferrer,
    isAdmin: false // Always false for the public endpoint
  })

  sendSuccess(res, {}, SUCCESS_MESSAGES.VIEW_TRACKED, HTTP_STATUS.CREATED)
})
