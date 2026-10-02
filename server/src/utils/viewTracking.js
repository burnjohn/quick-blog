import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import BlogView from '../models/BlogView.js'
import dbLogger from './dbLogger.js'

const SEARCH_DOMAINS = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu', 'yandex']
const SOCIAL_DOMAINS = ['facebook', 'twitter', 'x.com', 'linkedin', 'instagram', 'reddit', 'pinterest', 'tiktok']

const DEDUP_HOURS = 24

/**
 * Classifies the referrer header into direct, search, social, or other.
 * @param {string|null|undefined} refererHeader - The Referer HTTP header value
 * @returns {'direct'|'search'|'social'|'other'}
 */
export function classifyReferrer(refererHeader) {
  if (!refererHeader || typeof refererHeader !== 'string') {
    return 'direct'
  }

  try {
    const url = new URL(refererHeader)
    const host = (url.hostname || '').toLowerCase()

    const isSearch = SEARCH_DOMAINS.some(d => host.includes(d))
    if (isSearch) return 'search'

    const isSocial = SOCIAL_DOMAINS.some(d => host.includes(d))
    if (isSocial) return 'social'

    return 'other'
  } catch {
    return 'direct'
  }
}

/**
 * Computes a visitor key from IP + User-Agent, or uses X-Visitor-ID header if present.
 * @param {import('express').Request} req
 * @returns {string}
 */
export function computeVisitorKey(req) {
  const customId = req.get('x-visitor-id') || req.get('X-Visitor-ID')
  if (customId && typeof customId === 'string' && customId.trim()) {
    return crypto.createHash('sha256').update(customId.trim()).digest('hex')
  }

  const ip = req.ip || req.socket?.remoteAddress || ''
  const ua = req.get('user-agent') || ''
  const combined = `${ip}|${ua}`
  return crypto.createHash('sha256').update(combined).digest('hex')
}

/**
 * Detects if the request is from an authenticated admin.
 * @param {import('express').Request} req
 * @returns {boolean}
 */
function isAdminRequest(req) {
  const authHeader = req.headers?.authorization
  if (!authHeader?.startsWith?.('Bearer ')) return false

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded?.role === 'admin' || decoded?.role === 'Admin'
  } catch {
    return false
  }
}

/**
 * Fire-and-forget view recording. Does not await. Does not affect response.
 * 24h deduplication for non-admin views (same blog + visitorKey within 24h = skip).
 * @param {import('mongoose').Types.ObjectId} blogId
 * @param {import('express').Request} req
 */
export function recordView(blogId, req) {
  const isAdmin = isAdminRequest(req)
  const visitorKey = computeVisitorKey(req)
  const referrerSource = classifyReferrer(req.get('referer') || req.get('referrer'))

  const doRecord = async () => {
    try {
      if (!isAdmin) {
        const cutoff = new Date(Date.now() - DEDUP_HOURS * 60 * 60 * 1000)
        const existing = await BlogView.findOne({
          blog: blogId,
          visitorKey,
          viewedAt: { $gte: cutoff },
          isAdminView: false
        }).lean()
        if (existing) return
      }

      await BlogView.create({
        blog: blogId,
        viewedAt: new Date(),
        referrerSource,
        isAdminView: isAdmin,
        visitorKey
      })
    } catch (err) {
      dbLogger.logError('VIEW_TRACKING', err)
    }
  }

  doRecord()
}
