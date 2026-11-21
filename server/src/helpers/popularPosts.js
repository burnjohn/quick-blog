import BlogView from '../models/BlogView.js'
import Comment from '../models/Comment.js'

const DAY_MS = 24 * 60 * 60 * 1000
export const EXCERPT_LENGTH = 160

// Block-level tags become word breaks; inline tags (<strong>, <code>…) vanish
const BLOCK_TAG = /<\/?(p|div|br|hr|h[1-6]|li|ul|ol|blockquote|pre|tr|td|th|table|section|article|figure|figcaption)\b[^>]*>/gi

const HTML_ENTITIES = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'"
}

/**
 * Strips HTML tags/entities and truncates to `maxLength` on a word boundary.
 */
export function toExcerpt(html, maxLength = EXCERPT_LENGTH) {
  if (typeof html !== 'string') return ''
  const text = html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(BLOCK_TAG, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&[a-z#0-9]+;/gi, (entity) => HTML_ENTITIES[entity.toLowerCase()] ?? ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= maxLength) return text
  const cut = text.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  const trimmed = lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut
  return `${trimmed.replace(/[\s.,;:!?-]+$/, '')}…`
}

/**
 * Aggregates non-admin views per published blog, optionally since a date.
 * Returns [{ _id, title, subTitle, category, image, createdAt, description, views }]
 */
async function aggregateTopViewed(limit, since) {
  const match = { isAdminView: false }
  if (since) match.viewedAt = { $gte: since }

  return BlogView.aggregate([
    { $match: match },
    { $group: { _id: '$blog', views: { $sum: 1 } } },
    {
      $lookup: {
        from: 'blogs',
        localField: '_id',
        foreignField: '_id',
        as: 'blog',
        pipeline: [
          { $match: { isPublished: true } },
          { $project: { title: 1, subTitle: 1, category: 1, image: 1, createdAt: 1, description: 1 } }
        ]
      }
    },
    { $unwind: '$blog' },
    { $replaceRoot: { newRoot: { $mergeObjects: ['$blog', { views: '$views' }] } } },
    { $sort: { views: -1, createdAt: -1, _id: 1 } },
    { $limit: limit }
  ])
}

async function countApprovedComments(blogIds) {
  if (blogIds.length === 0) return new Map()
  const rows = await Comment.aggregate([
    { $match: { blog: { $in: blogIds }, isApproved: true } },
    { $group: { _id: '$blog', count: { $sum: 1 } } }
  ])
  return new Map(rows.map((row) => [String(row._id), row.count]))
}

/**
 * Most-viewed published posts within the last `days`; falls back to all-time
 * when the window has fewer than `limit` posts with views.
 * @returns {Promise<{ posts: object[], range: 'window' | 'all' }>}
 */
export async function getPopularPosts({ limit, days }) {
  const since = new Date(Date.now() - days * DAY_MS)
  let rows = await aggregateTopViewed(limit, since)
  let range = 'window'

  if (rows.length < limit) {
    rows = await aggregateTopViewed(limit, null)
    range = 'all'
  }

  const comments = await countApprovedComments(rows.map((row) => row._id))
  const posts = rows.map(({ description, ...row }) => ({
    ...row,
    excerpt: toExcerpt(description),
    comments: comments.get(String(row._id)) ?? 0
  }))

  return { posts, range }
}
